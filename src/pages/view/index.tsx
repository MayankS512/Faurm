import Head from "next/head";
import { Inter } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function View() {
  const { data: session } = useSession();
  // if (!session?.user) {
  //   router.push("/");
  // }

  const faurms = trpc.faurm.getFaurms.useQuery();
  console.log(faurms.data?.faurms);

  return (
    <>
      <Head>
        <title>Faurm</title>
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
      <main className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-neutral-900 to-neutral-950">
        <h1 className={`${inter.className} text-6xl`}>Faurm</h1>
        {faurms.data?.faurms && faurms.data?.faurms.length ? (
          <ul className="flex flex-col items-center gap-4 p-4 mt-20 text-xl text-center">
            {faurms.data?.faurms.map((faurm, idx) => (
              <li key={idx} className="w-full">
                <Link
                  href={`/view/${faurm.id}`}
                  className="block w-full p-4 py-2 rounded-sm bg-neutral-800"
                >
                  {faurm.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-6 p-4 mt-20 text-xl bg-neutral-800 bg-opacity-70">
            <p>No Faurms Found... :(</p>
            <Link className="p-2 py-1 rounded-sm bg-neutral-700" href="/">
              To Homepage
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
