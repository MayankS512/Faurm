import { TRPCOutputs, trpc } from "@/utils/trpc";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnswerFaurm, MobileAnswerFaurm } from "@/components/Answers";
import { useEffect, useState } from "react";

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
  const [width, setWidth] = useState(0);
  const resizeHandler = () => {
    setWidth(innerWidth);
  };

  useEffect(() => {
    if (window) {
      window.addEventListener("resize", resizeHandler);
    }

    return () => window.removeEventListener("resize", resizeHandler);
  });

  if (width < 1024) return <MobileAnswerFaurm faurm={faurm} />;
  return <AnswerFaurm faurm={faurm} />;
}
