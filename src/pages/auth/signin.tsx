import Head from "next/head";
import { Inter } from "next/font/google";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getProviders, signIn } from "next-auth/react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const inter = Inter({ subsets: ["latin"] });

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Faurm | Sign In</title>
        <meta
          name="description"
          content="Create and share forms in the easiest way possible."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={
          "bg-gradient-to-br from-black to-neutral-900 h-screen w-screen flex flex-col items-center justify-center " +
          inter.className
        }
      >
        <div className="flex flex-col items-center gap-4 p-4 rounded-sm bg-neutral-800">
          <h1 className="text-2xl font-thin">Sign In</h1>
          {Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              className="flex items-center justify-center gap-2 p-2 rounded-sm bg-neutral-700 text-neutral-100 hover:bg-neutral-600"
              onClick={() => signIn(provider.id)}
            >
              <GitHubLogoIcon />
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
