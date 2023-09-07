import { router } from "../trpc";
import { z } from "zod";

import { faurmRouter } from "./faurm";
import { responseRouter } from "./response";

export const appRouter = router({
  faurm: faurmRouter,
  // question: questionRouter,
  response: responseRouter,
  // field: fieldRouter,
});

export type AppRouter = typeof appRouter;
