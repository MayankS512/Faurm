import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  hello: publicProcedure
    .input(
      z
        .object({
          title: z.string().optional(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return {
        greeting: `hello ${ctx.session?.user?.name ?? input?.title ?? "world"}`,
      };
    }),
  getUsers: publicProcedure.query(async ({ ctx }) => {
    return {
      result: await ctx.prisma.user.findMany(),
    };
  }),
});
