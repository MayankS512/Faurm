import Head from "next/head";
import { Inter } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import { TRPCOutputs, trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import LexicalRenderer from "@/components/Lexical/LexicalRenderer";
import Link from "next/link";
import { TFaurm } from "@/pages/create";

type TResponse = Exclude<TRPCOutputs["response"]["getResponse"], null>;

const inter = Inter({ subsets: ["latin"] });

export default function ParamCheck() {
  const router = useRouter();
  const { id, responseId } = router.query;

  // TODO: Needs branding with Faurm logo (actually just text)
  return (
    <>
      {typeof id === "string" && typeof responseId === "string" ? (
        <DataCheck id={id} responseId={responseId} />
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

function DataCheck({ id, responseId }: { id: string; responseId: string }) {
  const response = trpc.response.getResponse.useQuery({
    id: responseId,
  });
  const faurm = trpc.faurm.getFaurm.useQuery({ id: id });
  const { data: session } = useSession();

  if (faurm.isLoading || response.isLoading)
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
  if (faurm.isError || !faurm.data.faurm || response.isError || !response.data)
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
  if (
    faurm.data?.faurm?.userId &&
    faurm.data?.faurm?.userId !== session?.user.id
  ) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col items-center justify-center gap-2 p-2 rounded-sm bg-neutral-800">
          <h2 className="text-xl">Invalid User!</h2>
          <Link
            className="p-2 rounded-sm outline-none cursor-pointer focus-visible:ring-2 ring-neutral-200 ring-offset-1 ring-offset-neutral-800 bg-neutral-700"
            href="/"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return <ViewUsers faurm={faurm.data.faurm} response={response.data} />;
}

function ViewUsers({
  faurm,
  response,
}: {
  faurm: TFaurm;
  response: TResponse;
}) {
  const { data: session } = useSession();
  const questions = faurm.questions;

  const answers = response.answers.map((answer) => {
    const question = questions?.find(
      (question) => question.id === answer.questionId
    );

    if (!question) return;
    return {
      id: answer.id,
      questionId: question.id,
      question: question.title,
      type: question.type,
      value: answer.value,
    };
  });

  return (
    <>
      <Head>
        <title>Faurm | {faurm.title}</title>
        <meta
          name="description"
          content="Create and share simple forms in the easiest way possible."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${inter.className} absolute top-0 right-0 p-4 text-right`}
      >
        {session ? (
          <>
            <p>Signed in as {session.user?.name}</p>
            <button
              aria-label="Sign Out"
              className="p-2 py-1 mt-2 rounded-sm bg-neutral-800"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <p>Not signed in :(</p>
            <button
              aria-label="Sign In"
              className="p-2 py-1 mt-2 rounded-sm bg-neutral-800"
              onClick={() => signIn()}
              // * No need for pages using this syntax:
              // * onClick={() => signIn('github')}
            >
              Sign In
            </button>
          </>
        )}
      </div>
      <main className="flex flex-col items-center w-full h-full min-h-screen gap-8 p-10 bg-gradient-to-br from-neutral-900 to-neutral-950">
        <h1 className={`${inter.className} text-6xl`}>Faurm</h1>
        <h2 className="text-2xl">{faurm.title}</h2>
        <h3 className="text-neutral-400">
          Submitted by:{" "}
          {session && response.User?.id === session?.user.id
            ? "You"
            : response.User?.name ?? "Anonymous"}
        </h3>
        {answers && answers.length ? (
          <ul className="flex flex-col items-center gap-4 p-4 min-w-[20rem]">
            {answers.map((answer) => {
              if (!answer) return;
              return (
                <li key={answer.id} className="w-full gap-2">
                  <div className="w-full p-4 rounded-sm bg-neutral-800">
                    <div className="w-full">
                      <span className="font-medium">Question:</span>
                      <LexicalRenderer
                        placeholder="No Question Provided."
                        title={answer.question}
                        id={answer.questionId}
                      />
                    </div>
                    <p>
                      <span className="font-medium">Type:</span> {answer.type}
                    </p>
                    <div className="w-full">
                      <span className="font-medium">Response:</span>
                      {answer.type === "Text" ? (
                        <LexicalRenderer
                          id={answer.id}
                          placeholder="No Answer Provided."
                          title={answer.value}
                        />
                      ) : (
                        <span className="ml-1">{answer.value}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </main>
    </>
  );
}
