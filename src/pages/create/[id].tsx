import { trpc } from "@/utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import SortableItem from "@/components/SortableItem";
import QuestionDndContainer from "@/components/QuestionDndContainer";
import { RoundedButton } from "@/components/RoundedButton";
import {
  Question,
  QuestionOverlay,
  type TQuestion,
} from "@/components/Question";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import FormTitle from "@/components/FormTitle";
import Link from "next/link";
import {
  CheckIcon,
  CopyIcon,
  Cross1Icon,
  Link2Icon,
} from "@radix-ui/react-icons";
import { Dialog } from "@headlessui/react";
import { defaultTextboxState } from "@/components/Lexical/LexicalTextbox";
import { TFaurm } from ".";
import { useSession } from "next-auth/react";
import { MobileQuestion } from "@/components/MobileQuestion";

/* 
TODO: Responsive Design
* Could switch to @container queries instead of breakpoints and / or modify breakpoints to also account for height of the viewport.
* Could also utilize Navigator.userAgent to render specific designs on specific devices instead of estimating that using breakpoints.
*/

/* 
TODO: FormContainer Overlay
* A revision for this drag behaviour could also prove to be beneficial such as: 
  * Closing opened FormContainer if it is not the one beind dragged.
  * Revisiting the keyboard drag behavior of instantly (w/o animation) closing the opened containers. 
*/

export default function ParamCheck() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useSession();

  if (!data?.user) {
    return (
      <>
        <Head>Faurm | Create</Head>
        <div className="flex items-center justify-center w-screen h-screen">
          <div className="p-2 bg-neutral-800">
            <h2 className="text-2xl">Invalid User!</h2>
            <Link className="p-2 cursor-pointer bg-neutral-700" href="/">
              Go to Homepage
            </Link>
          </div>
        </div>
      </>
    );
  }

  // console.log(share);

  // TODO: Needs branding with Faurm logo (actually just text)
  return (
    <>
      <Head>
        <title>Faurm | Create</title>
      </Head>
      {typeof id === "string" ? (
        <DataCheck id={id} />
      ) : (
        <div className="flex items-center justify-center w-screen h-screen">
          <span className="loader"></span>
        </div>
      )}
    </>
  );
}

function DataCheck({ id }: { id: string }) {
  const { data: session } = useSession();
  const faurm = trpc.faurm.getFaurm.useQuery(
    { id },
    { refetchOnWindowFocus: false } // ? Should possibly be true in prod.
  );

  if (faurm.isLoading)
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="loader"></span>
      </div>
    );
  if (faurm.data?.faurm?.userId !== session?.user.id) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="p-2 bg-neutral-800">
          <h2 className="text-2xl">Invalid User!</h2>
          <Link className="p-2 cursor-pointer bg-neutral-700" href="/">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
  if (faurm.isError || !faurm.data.faurm) return <p>Invalid Request :(</p>;

  return <Create faurm={faurm.data.faurm} />;
}

function Create({ faurm }: { faurm: TFaurm }) {
  const [width, setWidth] = useState(0);
  const resizeHandler = () => {
    setWidth(innerWidth);
  };

  useEffect(() => {
    if (window) {
      window.addEventListener("resize", resizeHandler);
    }

    return () => window.removeEventListener("resize", resizeHandler);
  });

  if (width < 1024) return <Mobile faurm={faurm} />;
  return <Default faurm={faurm} />;
}

function Default({ faurm }: { faurm: TFaurm }) {
  const { title: retrievedTitle, questions: retrievedQuestions, id } = faurm;

  const [title, setTitle] = useState(retrievedTitle);
  const [questions, setQuestions] = useState(retrievedQuestions);
  const [open, setOpen] = useState<string>();

  const temp = useRef(open);

  const setFaurm = trpc.faurm.setFaurm.useMutation();

  const handleSave = async () => {
    const res = await setFaurm.mutateAsync({
      id,
      title,
      questions: questions.map(({ title, type, fields }) => ({
        title,
        type,
        fields: fields.map(({ value }) => value),
      })),
    });
  };

  const updateQuestion = (question: TQuestion) => {
    setQuestions((prev) => {
      const res = [...prev];
      res[res.findIndex((val) => val.id === question.id)] = question;
      return res;
    });
  };

  const handleCreate = async () => {
    if (questions.length >= 100) return;
    setQuestions((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          faurmId: id,
          title: defaultTextboxState,
          type: "Text",
          fields: [],
        },
      ];
    });
  };

  const handleDelete = async (idx: number, id: string) => {
    setQuestions((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };

  return (
    //  bg-gradient-to-br from-neutral-900 to-neutral-950
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4 p-10 ">
      <ShareModal />
      <div className="absolute flex gap-2 top-4 right-4">
        <Link
          href={id + "?share"}
          // p-2 flex items-center gap-2
          className="flex items-center justify-center w-10 h-10 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
        >
          <Link2Icon />
          {/* Share */}
        </Link>
        <button
          className="p-2 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          onClick={handleSave}
          type="button"
          aria-label="Save Faurm"
        >
          Save
        </button>
      </div>
      <FormTitle title={title} setTitle={setTitle} />
      <div className="flex gap-4">
        <button
          className="p-2 rounded-sm outline-none dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900"
          onClick={handleCreate}
          aria-label="Create Question"
        >
          Add Question
        </button>
      </div>

      <div
        // hidden-scroll
        className="flex items-center h-[500px] overflow-x-auto overflow-y-hidden horizontal-scroll max-w-full gap-4 mt-10"
      >
        {!questions.length ? (
          <div className="p-4 mx-auto rounded-sm bg-neutral-800">
            <p>No Questions...</p>
          </div>
        ) : (
          <div className="flex mx-[196px] h-full gap-4 p-2 items-center">
            <QuestionDndContainer
              orientation="horizontal"
              questions={questions}
              setQuestions={setQuestions}
              keyboardEvents={{
                start() {
                  temp.current = open;
                  setOpen(undefined);
                },
                end() {
                  const timeout = setTimeout(() => {
                    setOpen(temp.current);
                    temp.current = undefined;
                  }, 400);

                  return () => clearTimeout(timeout);
                },
              }}
              Overlay={({ dragging }) => (
                <QuestionOverlay
                  index={dragging}
                  open={open === questions[dragging].id}
                  {...questions[dragging]}
                />
                // <RoundedButton className="outline-none bg-neutral-800">{dragging + 1}</RoundedButton>
              )}
            >
              {questions.map((question, idx) => (
                <SortableItem
                  className={`${
                    question.id === open ? "rounded-sm" : "rounded-full"
                  } outline-none focus-visible:ring-2 ring-neutral-600 ring-offset-1 ring-offset-neutral-900`}
                  key={question.id}
                  id={question.id}
                >
                  {temp.current ? (
                    <RoundedButton className="bg-neutral-800">
                      {idx + 1}
                    </RoundedButton>
                  ) : (
                    <Question
                      index={idx}
                      onClick={() => {
                        // setOpen(idx === open ? undefined : idx);
                        setOpen(question.id === open ? undefined : question.id);
                      }}
                      open={question.id === open}
                      handleDelete={() => handleDelete(idx, question.id)}
                      handleUpdate={updateQuestion}
                      {...question}
                    />
                  )}
                </SortableItem>
              ))}
            </QuestionDndContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function Mobile({ faurm }: { faurm: TFaurm }) {
  const { title: retrievedTitle, questions: retrievedQuestions, id } = faurm;

  const [title, setTitle] = useState(retrievedTitle);
  const [questions, setQuestions] = useState(retrievedQuestions);
  const [open, setOpen] = useState<number | undefined>(
    questions.length ? 0 : undefined
  );

  const { data: session } = useSession();
  const router = useRouter();

  const createFaurm = trpc.faurm.createFaurm.useMutation();

  const handleSave = async () => {
    const res = await createFaurm.mutateAsync({
      title,
      questions: questions.map(({ title, type, fields }) => ({
        title,
        type,
        fields: fields.map(({ value }) => value),
      })),
    });

    if (session?.user) {
      router.push(`/create/${res.faurm.id}?share`);
    } else {
      router.push(`/${res.faurm.id}?share`);
    }
  };

  const handleUpdate = (question: TQuestion) => {
    setQuestions((prev) => {
      const res = [...prev];
      res[res.findIndex((val) => val.id === question.id)] = question;
      return res;
    });
  };

  const handleCreate = () => {
    if (questions.length >= 100) return;

    setQuestions((prev) => {
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          faurmId: "",
          title: defaultTextboxState,
          type: "Text",
          fields: [],
        },
      ];
    });
    setOpen(questions.length);
  };

  // useEffect(() => {
  //   console.log(window.navigator.userAgent);

  // }, [])

  const handleDelete = (idx: number) => {
    setOpen((prev) => {
      if (prev === undefined) {
        return prev;
      }
      if (questions.length === 1) {
        return undefined;
      }
      if (prev > 0) {
        return prev - 1;
      } else {
        return prev;
      }
    });
    setQuestions((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };

  const x = useSpring(0, {
    stiffness: 400,
    damping: 30,
  });

  return (
    <div className="flex h-screen overflow-x-hidden">
      <motion.section
        onPan={(_evt, { delta }) => {
          x.jump(Math.max(Math.min(x.get() + delta.x, 160), 0));
        }}
        onPanEnd={(_evt, { offset }) => {
          if (x.get() > 80) {
            x.set(160);
          } else {
            x.set(0);
          }
        }}
        className="absolute top-0 left-0 flex flex-col items-center w-40 h-screen gap-8 py-8 overflow-auto bg-neutral-800 touch-pan-y"
      >
        <QuestionDndContainer
          orientation="vertical"
          questions={questions}
          setQuestions={setQuestions}
        >
          {questions.map((question, idx) => (
            <SortableItem
              className="rounded-full outline-none "
              key={question.id}
              id={question.id}
            >
              <RoundedButton onClick={() => setOpen(idx)}>
                {idx + 1}
              </RoundedButton>
            </SortableItem>
          ))}
        </QuestionDndContainer>
      </motion.section>

      <motion.div
        onPan={(_evt, { delta }) => {
          x.jump(Math.max(Math.min(x.get() + delta.x, 160), 0));
        }}
        onPanEnd={(_evt, { offset }) => {
          if (x.get() > 80) {
            x.set(160);
          } else {
            x.set(0);
          }
        }}
        style={{ x }}
        className="flex flex-col items-center justify-evenly w-full min-h-screen h-full gap-4 p-10 touch-pan-y bg-neutral-900 z-[5]"
      >
        <ShareModal />
        <div className="absolute flex gap-2 top-4 right-4">
          <Link
            href={id + "?share"}
            // p-2 flex items-center gap-2
            className="flex items-center justify-center w-10 h-10 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          >
            <Link2Icon />
            {/* Share */}
          </Link>
          <button
            className="p-2 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            onClick={handleSave}
            type="button"
            aria-label="Save Faurm"
          >
            Save
          </button>
        </div>
        <FormTitle title={title} setTitle={setTitle} />
        <button
          className="p-2 rounded-sm outline-none dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900"
          onClick={handleCreate}
          aria-label="Create Question"
        >
          Add Question
        </button>

        <div className="flex items-center h-[500px] max-w-full gap-4">
          {open === undefined ? (
            <div className="p-4 rounded-sm bg-neutral-800">
              <p>No Questions...</p>
            </div>
          ) : (
            <MobileQuestion
              key={open}
              faurmId={questions[open].faurmId}
              fields={questions[open].fields}
              handleDelete={() => handleDelete(open)}
              handleUpdate={handleUpdate}
              id={questions[open].id}
              index={open}
              title={questions[open].title}
              type={questions[open].type}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ShareModal() {
  const router = useRouter();
  const { id, share } = router.query;

  const url =
    (process.env.MODE
      ? "http://localhost:3000/"
      : "https://faurm.vercel.app/") + id;

  const [copied, setCopied] = useState(false);
  // const copiedValue = useMotionValue(0);
  // const springed = useSpring(copiedValue);
  // const clipboardOpacity = useTransform(springed, [0, 100], [1, 0]);
  // const copiedOpacity = useTransform(springed, [0, 100], [0, 0.6]);

  const close = () => {
    if (typeof id === "string") router.push(id);
  };

  const copy = () => {
    if (!navigator) return;

    navigator.clipboard.writeText(url);
    setCopied(true);
    // copiedValue.set(100);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }

    return () => clearTimeout(timeout);
  }, [copied]);

  // useMotionValueEvent(copiedValue, "change", (val) => {
  //   let timeout: NodeJS.Timeout | undefined;
  //   if (val) {
  //     timeout = setTimeout(() => copiedValue.set(0), 2000);
  //   }

  //   return () => clearTimeout(timeout);
  // });

  return (
    <Dialog open={share !== undefined} onClose={close}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-md"
        aria-hidden="true"
      />
      {/* <AnimatePresence>
        {copied && (
          <motion.div
            key="Copied"
            initial={{ y: -100, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0.5 }}
            className="absolute px-2 py-1 -translate-x-1/2 rounded-sm bg-neutral-800 drop-shadow-md top-10 left-1/2"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence> */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative flex flex-col gap-4 p-4 rounded-sm bg-neutral-800 text-neutral-200 drop-shadow-md">
          <Dialog.Title className="text-xl">Share Faurm</Dialog.Title>
          <Dialog.Description>
            Copy the url below to share this faurm with your friends!
            <span className="ml-1 text-sm text-neutral-400">
              (or anybody else for that matter.)
            </span>
          </Dialog.Description>
          <div className="relative px-3 py-2 transition-all duration-200 rounded-sm bg-neutral-900 focus-within:drop-shadow-md hover:drop-shadow-md focus-within:ring-2 ring-neutral-200 ">
            <AnimatePresence>
              {copied ? (
                <motion.p
                  className="absolute flex items-center p-2 text-sm -translate-y-1/2 outline-none right-1 top-1/2"
                  key="copied"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  // style={{ opacity: copiedOpacity }}
                >
                  <CheckIcon className="w-5 h-5" />
                  Copied!
                </motion.p>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="copy"
                  className="absolute p-2 -translate-y-1/2 rounded-full outline-none group right-1 top-1/2"
                  type="button"
                  onClick={copy}
                  // style={{ opacity: clipboardOpacity }}
                >
                  <CopyIcon className="transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 opacity-40 " />
                </motion.button>
              )}
            </AnimatePresence>
            {/* <button
              className="absolute p-2 -translate-y-1/2 rounded-full outline-none group right-1 top-1/2"
              type="button"
              onClick={copy}
            >
              <CopyIcon className="transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 opacity-40 " />
            </button> */}
            {url}
          </div>
          <button
            className="p-2 transition-all duration-200 rounded-sm outline-none bg-neutral-700 focus-visible:ring-2 focus-visible:drop-shadow-md ring-offset-1 ring-neutral-200 ring-offset-neutral-800 hover:bg-neutral-600 hover:drop-shadow-md"
            onClick={close}
            type="button"
          >
            Close
          </button>
          <button
            onClick={close}
            className="absolute p-2 transition-all duration-200 rounded-full outline-none right-4 top-4 hover:bg-red-600 focus-visible:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 bg-neutral-700"
          >
            <Cross1Icon className="w-3 h-3" />
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
