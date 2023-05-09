import { Answer } from "@/components/Answer";
import { defaultTextboxState } from "@/components/Lexical/LexicalTextbox";
import { TRPCOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ShareModal } from "./create/[id]";
import { Link2Icon } from "@radix-ui/react-icons";

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

  const [pointer, setPointer] = useState(false);

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
          {/* <Link
            href={id + "?share"}
            // p-2 flex items-center gap-2
            className="flex items-center justify-center w-10 h-10 rounded-sm outline-none focus:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-900 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          >
            <Link2Icon />
          </Link> */}
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
          onPointerEnter={() => {
            setPointer(true);
          }}
          onPointerLeave={() => {
            setPointer(false);
          }}
          data-horizontal={pointer}
          // ? Can also consider using pan gesture to make for easy scroll on Desktop, no need on mobile as that is the defualt behavior
          className="flex items-center h-[500px] px-2 overflow-x-auto overflow-y-hidden horizontal-scroll max-w-full gap-4 mt-10"
        >
          <div className="flex items-center justify-center h-full gap-4 mx-[196px]">
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

/*
<div key={id}>
              <div className="flex flex-col items-center gap-4 p-4 rounded-sm bg-neutral-800">
                <TextReader title={title} id={id} />
                <p className="text-base text-neutral-300">
                  <span className="font-medium">Type:</span> {type}
                </p>
                {fields.length ? (
                  <ul className="flex flex-col gap-2">
                    {fields.map(({ id, value }) => (
                      // ? Name should ideally be question.id
                      <li key={id}>
                        <label className="flex items-center gap-2 p-2 rounded-sm focus-within:ring-2 bg-neutral-700">
                          <input
                            type="radio"
                            value={value}
                            name={title}
                            aria-label={value}
                            className="outline-none"
                          />
                          {value}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Textbox id={id} placeholder="Enter Answer Here..." />
                )}
              </div>
            </div>
*/
