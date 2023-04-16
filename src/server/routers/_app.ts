import { router } from "../trpc";
import { z } from "zod";

import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
