import { TRPCOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import React, { useState, useRef, useEffect } from "react";
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

export type TFaurm = Exclude<TRPCOutputs["faurm"]["getFaurm"]["faurm"], null>;

export function Create() {
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
