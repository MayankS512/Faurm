import Head from "next/head";
import { Inter } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();

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
        <Link href="/">
          <h1 className={`${inter.className} cursor-pointer text-6xl`}>Faurm</h1>
        </Link>
        <ul className="flex flex-col items-center gap-4 p-4 mt-20 text-xl text-center">
          <li className="w-full">
            <Link
              href="/create"
              className="block w-full p-4 py-2 rounded-sm bg-neutral-800"
            >
              Create New Faurm
            </Link>
          </li>
          {session ? (
            <li className="w-full">
              <Link
                href="/view"
                className="block w-full p-4 py-2 rounded-sm bg-neutral-800"
              >
                View Existing Faurms
              </Link>
            </li>
          ) : null}
          {/* <li className="w-full">
            <Link
              href="/faurm"
              className="block w-full p-4 py-2 rounded-sm bg-neutral-800"
            >
              Fill A Faurm
            </Link>
          </li> */}
        </ul>
      </main>
    </>
  );
}
