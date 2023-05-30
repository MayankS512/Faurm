import { Answer } from "@/components/Answer";
import { defaultTextboxState } from "@/components/Lexical/LexicalTextbox";
import { TRPCOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Link2Icon } from "@radix-ui/react-icons";
import { motion, useSpring } from "framer-motion";
import { RoundedButton } from "@/components/RoundedButton";
import { MobileAnswer } from "@/components/MobileAnswer";
import { ShareModal } from "@/pages/create/[id]";

type Faurm = Exclude<TRPCOutputs["faurm"]["getFaurm"]["faurm"], null>;

export function MobileAnswerFaurm({ faurm }: { faurm: Faurm }) {
  const { id, title, questions } = faurm;
  const [open, setOpen] = useState<number>(0);
  const [answers, setAnswers] = useState<
    { questionId: string; value: string }[]
  >(
    questions.map((question) => ({
      questionId: question.id,
      value: question.type !== "Text" ? "" : defaultTextboxState,
    }))
  );
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

  const x = useSpring(0, {
    stiffness: 400,
    damping: 30,
  });

  // const [pointer, setPointer] = useState(false);

  return (
    <>
      <Head>
        <title>Faurm | {title}</title>
      </Head>
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
          {questions.map((question, idx) => (
            <RoundedButton key={question.id} onClick={() => setOpen(idx)}>
              {idx + 1}
            </RoundedButton>
          ))}
        </motion.section>

        <motion.form
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
            className="flex items-center h-[500px] px-2 overflow-x-auto overflow-y-hidden horizontal-scroll max-w-full gap-4 mt-10"
          >
            <div className="flex items-center h-full gap-4 mx-[196px]">
              <MobileAnswer
                {...questions[open]}
                value={answers[open].value}
                key={questions[open].id}
                index={open}
                handleUpdate={handleUpdate}
              />
            </div>
          </div>
        </motion.form>
      </div>
    </>
  );
}

export function AnswerFaurm({ faurm }: { faurm: Faurm }) {
  const { id, title, questions } = faurm;
  const [open, setOpen] = useState<string>();
  const [answers, setAnswers] = useState<
    { questionId: string; value: string }[]
  >(
    questions.map((question) => ({
      questionId: question.id,
      value: question.type !== "Text" ? "" : defaultTextboxState,
    }))
  );
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

  // const [pointer, setPointer] = useState(false);

  return (
    <>
      <Head>
        <title>Faurm | {title}</title>
      </Head>
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
    </>
  );
}

