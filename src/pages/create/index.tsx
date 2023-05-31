import { TRPCOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import React, { useState, useRef, useEffect, useMemo } from "react";
import SortableItem from "@/components/SortableItem";
import QuestionDndContainer from "@/components/QuestionDndContainer";
import { RoundedButton } from "@/components/RoundedButton";
import {
  Question,
  QuestionOverlay,
  type TQuestion,
} from "@/components/Question";
import FormTitle from "@/components/FormTitle";
import { useRouter } from "next/router";
import { defaultTextboxState } from "@/components/Lexical/LexicalTextbox";
import { useSession } from "next-auth/react";
import { motion, useSpring } from "framer-motion";
import { MobileQuestion } from "@/components/MobileQuestion";

export type TFaurm = Exclude<TRPCOutputs["faurm"]["getFaurm"]["faurm"], null>;

// TODO: Could make this into a sub-component that can be shared between index.tsx and [id].tsx routes
// ?: Take trpc procedure as input as it is the only major difference between the 2 (save for comments in [id].tsx verrsion).
export default function Create() {
  const MOBILE_WIDTH = 820;

  const [width, setWidth] = useState(MOBILE_WIDTH);
  const [title, setTitle] = useState("Faurm Title");
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [open, setOpen] = useState<string>();
  const openIdx = useMemo(
    () => questions.findIndex((question) => question.id === open),
    [open, questions]
  );

  const { data: session } = useSession();
  const router = useRouter();

  const temp = useRef(open);
  const createFaurm = trpc.faurm.createFaurm.useMutation();

  const x = useSpring(0, {
    stiffness: 400,
    damping: 30,
  });

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
    const id = crypto.randomUUID();
    setQuestions((prev) => {
      return [
        ...prev,
        {
          id,
          faurmId: "",
          title: defaultTextboxState,
          type: "Text",
          fields: [],
        },
      ];
    });
    if (width < MOBILE_WIDTH) setOpen(id);
  };

  const handleDelete = (idx: number) => {
    setQuestions((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
    if (width < MOBILE_WIDTH) {
      setOpen((prev) => {
        if (questions.length === 1) {
          return undefined;
        }
        const idx = questions.findIndex((question) => question.id === prev);
        if (idx > 0) return questions[idx - 1].id;
        else questions[idx + 1].id;
      });
    }
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
  }, []);

  useEffect(() => {
    if (width < MOBILE_WIDTH && questions.length && !open) {
      setOpen(questions[questions.length - 1].id);
    }
  }, [width, open, questions]);

  // if (width < 1024) return <Mobile />;

  // return <Default />;

  return (
    <div className="flex h-screen overflow-x-hidden">
      <Head>
        <title>Faurm | Create</title>
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
                <RoundedButton onClick={() => setOpen(question.id)}>
                  {idx + 1}
                </RoundedButton>
              </SortableItem>
            ))}
          </QuestionDndContainer>
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
          className="flex flex-col items-center justify-evenly w-full min-h-screen h-full gap-4 p-10 touch-pan-y bg-neutral-900 z-[5]"
        >
          <button
            className="absolute h-10 p-2 rounded-sm outline-none top-4 right-4 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            onClick={handleSave}
            type="button"
            aria-label="Publish Faurm"
          >
            Publish
          </button>
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
                {...questions[openIdx]}
                handleDelete={() => handleDelete(openIdx)}
                handleUpdate={handleUpdate}
                index={openIdx}
              />
            )}
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-screen gap-4 p-10 ">
          <button
            className="absolute h-10 p-2 rounded-sm outline-none top-4 right-4 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            onClick={handleSave}
            type="button"
            aria-label="Publish Faurm"
          >
            Publish
          </button>
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
              <div className="p-4 rounded-sm bg-neutral-800">
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
                      setOpen(temp.current);
                      temp.current = undefined;
                    },
                  }}
                  Overlay={({ dragging }) => (
                    <QuestionOverlay
                      index={dragging}
                      open={open === questions[dragging].id}
                      {...questions[dragging]}
                    />
                  )}
                >
                  {questions.map((question, idx) => (
                    <SortableItem
                      className={`${
                        question.id === open ? "rounded-md" : "rounded-full"
                      } outline-none focus-visible:ring-2 ring-neutral-600  ring-offset-1 h-fit 
                  ring-offset-neutral-900`}
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
                            setOpen(
                              question.id === open ? undefined : question.id
                            );
                          }}
                          open={question.id === open}
                          handleDelete={() => handleDelete(idx)}
                          handleUpdate={handleUpdate}
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
      )}
    </div>
  );
}

function Default() {
  const [title, setTitle] = useState("Faurm Title");
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [open, setOpen] = useState<string>();

  const { data: session } = useSession();
  const router = useRouter();

  const temp = useRef(open);
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
  };

  const handleDelete = (idx: number) => {
    setQuestions((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };

  return (
    <>
      <Head>
        <title>Faurm | Create</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full h-screen gap-4 p-10 ">
        <button
          className="absolute h-10 p-2 rounded-sm outline-none top-4 right-4 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          onClick={handleSave}
          type="button"
          aria-label="Publish Faurm"
        >
          Publish
        </button>
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
          className="flex items-center h-[500px] overflow-x-auto  overflow-y-hidden horizontal-scroll max-w-full gap-4 mt-10"
        >
          {!questions.length ? (
            <div className="p-4 rounded-sm bg-neutral-800">
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
                    setOpen(temp.current);
                    temp.current = undefined;
                  },
                }}
                Overlay={({ dragging }) => (
                  <QuestionOverlay
                    index={dragging}
                    open={open === questions[dragging].id}
                    {...questions[dragging]}
                  />
                )}
              >
                {questions.map((question, idx) => (
                  <SortableItem
                    className={`${
                      question.id === open ? "rounded-md" : "rounded-full"
                    } outline-none focus-visible:ring-2 ring-neutral-600  ring-offset-1 h-fit 
                  ring-offset-neutral-900`}
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
                          setOpen(
                            question.id === open ? undefined : question.id
                          );
                        }}
                        open={question.id === open}
                        handleDelete={() => handleDelete(idx)}
                        handleUpdate={handleUpdate}
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
    </>
  );
}

function Mobile() {
  const [title, setTitle] = useState("Faurm Title");
  const [questions, setQuestions] = useState<TQuestion[]>([]);
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
        <button
          className="absolute h-10 p-2 rounded-sm outline-none top-4 right-4 focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          onClick={handleSave}
          type="button"
          aria-label="Publish Faurm"
        >
          Publish
        </button>
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
