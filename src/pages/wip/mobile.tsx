import { TRPCOutputs, trpc } from "@/utils/trpc";
import React, { useState } from "react";
import SortableItem from "@/components/SortableItem";
import QuestionDndContainer from "@/components/QuestionDndContainer";
import { RoundedButton } from "@/components/RoundedButton";
import {
  type TQuestion,
} from "@/components/Question";
import FormTitle from "@/components/FormTitle";
import { useRouter } from "next/router";
import { defaultTextboxState } from "@/components/Lexical/LexicalTextbox";
import { useSession } from "next-auth/react";
import { motion, useSpring } from "framer-motion";
import { MobileQuestion } from "@/components/MobileQuestion";

export type TFaurm = Exclude<TRPCOutputs["faurm"]["getFaurm"]["faurm"], null>;

export default function Create() {
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
