import { router } from "../trpc";
import { z } from "zod";

import { userRouter } from "./user";
import { faurmRouter } from "./faurm";
import { questionRouter } from "./question";
import { responseRouter } from "./response";
import { fieldRouter } from "./field";

export const appRouter = router({
  user: userRouter,
  faurm: faurmRouter,
  question: questionRouter,
  response: responseRouter,
  field: fieldRouter,
});

export type AppRouter = typeof appRouter;
