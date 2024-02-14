import Head from "next/head";
import { Inter } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import { TRPCOutputs, trpc } from "@/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import { TFaurm } from "@/pages/create";

type TResponse = Exclude<
  TRPCOutputs["response"]["getResponsesbyFaurm"],
  null
>[number];

const inter = Inter({ subsets: ["latin"] });

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
    { refetchOnWindowFocus: false }
  );
  const responses = trpc.response.getResponsesbyFaurm.useQuery(
    { faurmId: id },
    { refetchOnWindowFocus: false }
  );
  const { data: session } = useSession();

  if (faurm.isLoading || responses.isLoading)
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
  if (
    faurm.isError ||
    !faurm.data.faurm ||
    responses.isError ||
    !responses.data
  )
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

  return (
    <ViewUsers id={id} faurm={faurm.data.faurm} responses={responses.data} />
  );
}

function ViewUsers({
  id,
  faurm,
  responses,
}: {
  id: string;
  faurm: TFaurm;
  responses: TResponse[];
}) {
  const { data: session } = useSession();

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
      <main className="flex flex-col items-center justify-center w-full h-screen gap-8 bg-gradient-to-br from-neutral-900 to-neutral-950">
        <h1 className={`${inter.className} text-6xl`}>Faurm</h1>
        <h2 className="text-2xl">{faurm.title}</h2>
        <Link
          href={`/create/${id}`}
          className="p-2 px-3 rounded-sm bg-neutral-800"
        >
          Edit Faurm
        </Link>
        {responses && responses.length ? (
          <ul className="flex flex-col items-center gap-4 p-4 mt-10 text-xl text-center">
            {responses.map((response, idx) => (
              <li key={idx} className="w-full">
                <Link
                  href={`/view/${id}/${response.id}`}
                  className="block w-full p-4 py-2 rounded-sm bg-neutral-800"
                >
                  {response.User?.name ?? "Anonymous"}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-6 p-4 mt-20 text-xl bg-neutral-800 bg-opacity-70">
            <p>No Responses Found... :(</p>
            <Link className="p-2 py-1 rounded-sm bg-neutral-700" href="/">
              To Homepage
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
