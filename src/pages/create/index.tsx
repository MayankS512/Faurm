import { TRPCOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import { useState, useRef, useEffect, useCallback } from "react";
import SortableItem from "@/components/SortableItem";
import QuestionDndContainer from "@/components/QuestionDndContainer";
import { RoundedButton } from "@/components/RoundedButton";
import {
  Question,
  QuestionOverlay,
  type TQuestion,
} from "@/components/Question";
import FormTitle from "@/components/FormTitle";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { defaultTextboxState } from "@/components/Lexical/LexicalTextbox";
import { useSession } from "next-auth/react";

export type TFaurm = Exclude<TRPCOutputs["faurm"]["getFaurm"]["faurm"], null>;

// TODO: If no user is logged in, directly take to share modal / page and inform the user before the faurm creation step that they cannot edit the form once published if not logged in.
// TODO: Needs branding with Faurm logo (actually just text)
// TODO: Make this into a sub-component that can be shared between index.tsx and [id].tsx routes"
//    ?: Take trpc procedure as input as it is the only major difference between the 2 (save for comments in [id].tsx verrsion).
export default function Create() {
  const [title, setTitle] = useState("Faurm Title");
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [open, setOpen] = useState<string>();

  const { data: session } = useSession();
  const router = useRouter();

  const temp = useRef(open);
  const added = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

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
    // console.log("Updated Faurm", res.faurm.id)
  };

  const updateQuestion = (question: TQuestion) => {
    setQuestions((prev) => {
      const res = [...prev];
      res[res.findIndex((val) => val.id === question.id)] = question;
      return res;
    });
  };

  const handleCreate = async () => {
    setQuestions((prev) => {
      return [
        ...prev,
        {
          id: "!" + (prev[prev.length - 1]?.id ?? ""),
          faurmId: "",
          title: defaultTextboxState,
          type: "Text",
          fields: [],
        },
      ];
    });

    added.current = true;
  };
  const handleDelete = async (idx: number) => {
    setQuestions((prev) => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
  };

  const [compensate, setCompensate] = useState(false);
  const [scrollLimit, setScrollLimit] = useState(0);
  const fixScroll = useCallback(() => {
    if (sliderRef.current && containerRef.current) {
      const PADDING = 40;
      const MARGIN = sliderRef.current.offsetLeft;
      const DIFFERENCE = MARGIN - PADDING;
      const SLIDER_WIDTH = 116 * questions.length - 16;
      const CONTAINER_WIDTH = containerRef.current.clientWidth;
      const OUTLINE_OFFSET = 4; // ? Outline / Ring offset

      const SCROLL_LIMIT =
        SLIDER_WIDTH + DIFFERENCE * 2 - CONTAINER_WIDTH + OUTLINE_OFFSET;

      setScrollLimit(SCROLL_LIMIT);
      setCompensate(
        containerRef.current.clientWidth + 116 <
          containerRef.current.scrollWidth
      );
    }
  }, [questions]);

  useEffect(() => {
    window.addEventListener("resize", fixScroll);
    fixScroll();

    return () => window.removeEventListener("resize", fixScroll);
  }, [fixScroll]);

  useEffect(() => {
    if (!added.current) return;
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: scrollLimit,
        behavior: "smooth",
      });
      added.current = false;
    }
  }, [scrollLimit, open]);

  return (
    <>
      <Head>
        <title>Faurm | Create</title>
      </Head>
      {/* bg-gradient-to-br from-neutral-900 to-neutral-950 */}
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
          onScroll={(e) => {
            if (e.currentTarget.scrollLeft > scrollLimit) {
              e.currentTarget.scrollLeft = scrollLimit;
              return;
            }
          }}
          ref={containerRef}
          // hidden-scroll
          className="flex items-center h-[500px] overflow-x-auto overflow-y-hidden horizontal-scroll max-w-full gap-4 mt-10"
        >
          {!questions.length ? (
            <div className="p-4 rounded-sm bg-neutral-800">
              <p>No Questions...</p>
            </div>
          ) : (
            <motion.div
              initial={{ marginLeft: 196 }}
              animate={{
                marginLeft: compensate
                  ? open !== undefined
                    ? 4
                    : 196 / 2
                  : 196,
              }}
              transition={{
                duration: 0.5,
              }}
              ref={sliderRef}
              className="flex items-center mx-[196px] h-full gap-4 "
            >
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
                          setOpen(
                            question.id === open ? undefined : question.id
                          );
                        }}
                        open={question.id === open}
                        handleDelete={() => handleDelete(idx)}
                        handleUpdate={updateQuestion}
                        {...question}
                      />
                    )}
                  </SortableItem>
                ))}
              </QuestionDndContainer>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
