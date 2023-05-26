import Head from "next/head";
import React from "react";
import SortableItem from "@/components/SortableItem";
import QuestionDndContainer from "@/components/QuestionDndContainer";
import { RoundedButton } from "@/components/RoundedButton";
import {
  Question,
  QuestionOverlay,
  type TQuestion,
} from "@/components/Question";
import FormTitle from "@/components/FormTitle";

interface IFaurmsProps {
  handleSave: () => void;
  handleCreate: () => void;
  handleDelete: (idx: number) => void;
  handleUpdate: (question: TQuestion) => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  questions: TQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  open: string | undefined;
  setOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
  temp: React.MutableRefObject<string | undefined>;
}

export const Faurms: React.FC<IFaurmsProps> = ({
  handleCreate,
  handleDelete,
  handleSave,
  handleUpdate,
  open,
  questions,
  setOpen,
  setQuestions,
  setTitle,
  title,
  temp,
}) => {
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
            <div className="flex mx-[196px] h-full gap-4 p-2">
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
};

/* 
? Usage
<Faurms
  handleSave={handleSave}
  handleCreate={handleCreate}
  handleDelete={handleDelete}
  handleUpdate={handleUpdate}
  open={open}
  setOpen={setOpen}
  questions={questions}
  setQuestions={setQuestions}
  title={title}
  setTitle={setTitle}
  temp={temp}
/>
*/
