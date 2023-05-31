import { TRPCOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { defaultTextboxState } from "@/components/Lexical/LexicalTextbox";
import { ShareModal } from "./create/[id]";
import { Link2Icon } from "@radix-ui/react-icons";
import { Answer } from "@/components/Answer";
import { motion, useSpring } from "framer-motion";
import { RoundedButton } from "@/components/RoundedButton";
import { MobileAnswer } from "@/components/MobileAnswer";

type Faurm = Exclude<TRPCOutputs["faurm"]["getFaurm"]["faurm"], null>;

export default function ParamCheck() {
  const router = useRouter();
  const { id } = router.query;

  // TODO: Needs branding with Faurm logo (actually just text)
  return (
    <>
      {typeof id === "string" ? (
        <DataCheck id={id} />
      ) : (
        <>
          <Head>
            <title>Faurm | Loading...</title>
          </Head>
          <div className="flex items-center justify-center w-screen h-screen">
            <span className="loader"></span>
          </div>
        </>
      )}
    </>
  );
}

function DataCheck({ id }: { id: string }) {
  const faurm = trpc.faurm.getFaurm.useQuery(
    { id },
    { refetchOnWindowFocus: false } // ? Might be better to keep it on
  );

  if (faurm.isLoading)
    return (
      <>
        <Head>
          <title>Faurm | Loading...</title>
        </Head>
        <div className="flex items-center justify-center w-screen h-screen">
          <span className="loader"></span>
        </div>
      </>
    );
  if (faurm.isError || !faurm.data.faurm)
    return (
      <>
        <Head>
          <title>Faurm | Invalid Request</title>
        </Head>
        <div className="flex items-center justify-center w-screen h-screen">
          <p className="flex flex-col gap-4 p-4 text-xl rounded-sm bg-neutral-800">
            Invalid Request :(
            <Link
              className="p-2 rounded-sm bg-neutral-700 hover:bg-neutral-900"
              href="/"
            >
              Go To Homepage
            </Link>
          </p>
        </div>
      </>
    );

  return <Faurm faurm={faurm.data.faurm} />;
}

function Faurm({ faurm }: { faurm: Faurm }) {
  const MOBILE_WIDTH = 820;

  const { id, title, questions } = faurm;
  const [width, setWidth] = useState(MOBILE_WIDTH);
  const [open, setOpen] = useState<string>();
  const openIdx = useMemo(
    () => questions.findIndex((question) => question.id === open),
    [open, questions]
  );
  const [answers, setAnswers] = useState<
    { questionId: string; value: string }[]
  >(
    questions.map((question) => ({
      questionId: question.id,
      value: question.type !== "Text" ? "" : defaultTextboxState,
    }))
  );
  const x = useSpring(0, {
    stiffness: 400,
    damping: 30,
  });

  const submit = trpc.response.createResponse.useMutation();

  const handleSubmit = () => {
    console.log("Submitted");
    submit.mutateAsync({
      faurmId: id,
      answers: answers,
    });
  };
  const handleUpdate = (id: string, value: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[
        newAnswers.findIndex((answer) => answer.questionId === id)
      ].value = value;

      return newAnswers;
    });
  };

  useEffect(() => {
    const resizeHandler = () => {
      setWidth(innerWidth);
    };

    if (window) {
      resizeHandler();
      window.addEventListener("resize", resizeHandler);
    }

    return () => window.removeEventListener("resize", resizeHandler);
  });

  useEffect(() => {
    if (width < MOBILE_WIDTH && questions.length && !open) {
      setOpen(questions[questions.length - 1].id);
    }
  }, [open, width, questions]);

  // if (width < 1024) return <MobileAnswerFaurm faurm={faurm} />;
  // return <AnswerFaurm faurm={faurm} />;

  return (
    <div className="flex h-screen overflow-x-hidden">
      <Head>
        <title>Faurm | {title}</title>
      </Head>

      {width < MOBILE_WIDTH ? (
        <motion.section
          onPan={(_evt, { delta }) => {
            x.jump(Math.max(Math.min(x.get() + delta.x, 160), 0));
          }}
          onPanEnd={() => {
            if (x.get() > 80) {
              x.set(160);
            } else {
              x.set(0);
            }
          }}
          className="absolute top-0 left-0 flex flex-col items-center w-40 h-screen gap-8 py-8 overflow-auto bg-neutral-800 touch-pan-y"
        >
          {questions.map((question, idx) => (
            <RoundedButton
              key={question.id}
              onClick={() => setOpen(question.id)}
            >
              {idx + 1}
            </RoundedButton>
          ))}
        </motion.section>
      ) : null}

      {width < MOBILE_WIDTH ? (
        <motion.div
          onPan={(_evt, { delta }) => {
            x.jump(Math.max(Math.min(x.get() + delta.x, 160), 0));
          }}
          onPanEnd={() => {
            if (x.get() > 80) {
              x.set(160);
            } else {
              x.set(0);
            }
          }}
          style={{ x }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col items-center justify-center w-full h-screen gap-4 p-10 touch-pan-y bg-neutral-900 z-[5]"
        >
          <ShareModal />
          <div className="absolute flex gap-2 top-4 right-4">
            <Link
              href={id + "?share"}
              // p-2 flex items-center gap-2
              className="flex items-center justify-center w-10 h-10 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            >
              <Link2Icon />
            </Link>
            <button
              className="p-2 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              type="submit"
              aria-label="Submit Response"
            >
              Submit
            </button>
          </div>
          <h1 className="text-2xl">{title}</h1>
          <div
            // onPointerEnter={() => {
            //   setPointer(true);
            // }}
            // onPointerLeave={() => {
            //   setPointer(false);
            // }}
            // data-horizontal={pointer}
            // ? Can also consider using pan gesture to make for easy scroll on Desktop, no need on mobile as that is the defualt behavior
            className="flex items-center justify-center h-[500px] px-2 w-full overflow-y-hidden horizontal-scroll max-w-full gap-4 mt-10"
          >
            {answers[openIdx] ? (
              <MobileAnswer
                {...questions[openIdx]}
                value={answers[openIdx].value}
                key={questions[openIdx].id}
                index={openIdx}
                handleUpdate={handleUpdate}
              />
            ) : null}
          </div>
        </motion.div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col items-center justify-center w-full h-screen gap-4 p-10 "
        >
          <ShareModal />
          <div className="absolute flex gap-2 top-4 right-4">
            <Link
              href={id + "?share"}
              // p-2 flex items-center gap-2
              className="flex items-center justify-center w-10 h-10 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            >
              <Link2Icon />
            </Link>
            <button
              className="p-2 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              type="submit"
              aria-label="Submit Response"
            >
              Submit
            </button>
          </div>
          <h1 className="text-2xl">{title}</h1>
          <div
            // onPointerEnter={() => {
            //   setPointer(true);
            // }}
            // onPointerLeave={() => {
            //   setPointer(false);
            // }}
            // data-horizontal={pointer}
            // ? Can also consider using pan gesture to make for easy scroll on Desktop, no need on mobile as that is the defualt behavior
            className="flex items-center h-[500px] px-2 overflow-x-auto overflow-y-hidden horizontal-scroll max-w-full gap-4 mt-10"
          >
            <div className="flex items-center h-full gap-4 mx-[196px]">
              {questions.map((question, idx) => (
                <Answer
                  {...question}
                  value={answers[idx].value}
                  key={question.id}
                  index={idx}
                  open={open === question.id}
                  onClick={() =>
                    setOpen(open === question.id ? undefined : question.id)
                  }
                  handleUpdate={handleUpdate}
                />
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
