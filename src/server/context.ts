import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { prisma } from "./db";

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts.req, opts.res, authOptions);

  // console.log(session);
  return {
    session,
    prisma,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
