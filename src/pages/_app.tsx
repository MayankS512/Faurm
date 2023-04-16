import "@/styles/globals.css";
import type { AppProps, AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { trpc } from "@/utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
