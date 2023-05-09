import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const questionRouter = router({
  getQuestions: publicProcedure
    .input(z.object({ faurmId: z.string() }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.prisma.question.findMany({
        where: {
          faurmId: input.faurmId,
        },
      });

      return {
        questions,
      };
    }),
  // ? Works considering a question is filled on the frontend first and then posted to the backend, without creating any entries beforehand.
  // createQuestion: publicProcedure
  //   .input(
  //     z.object({
  //       faurmId: z.string(),
  //       title: z.string(),
  //       type: z.string(),
  //       fields: z.array(z.string()).optional(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     if (input.type !== "Text") {
  //       if (!input.fields) return;

  //       return await ctx.prisma.question.create({
  //         data: {
  //           faurmId: input.faurmId,
  //           title: input.title,
  //           type: input.type,
  //           fields: {
  //             create: [...input.fields.map((field) => ({ value: field }))],
  //           },
  //         },
  //       });
  //     } else {
  //       return await ctx.prisma.question.create({
  //         data: {
  //           faurmId: input.faurmId,
  //           title: input.title,
  //           type: input.type,
  //         },
  //       });
  //     }
  //   }),

  createQuestion: publicProcedure
    .input(z.object({ faurmId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const create = await ctx.prisma.question.create({
        data: {
          faurmId: input.faurmId,
          type: "Text",
          // title: defaultTextboxState,
          title: "Question",
        },
      });

      return create;
    }),
  updateQuestion: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        type: z.string().optional(),
        fields: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type !== "Text") {
        if (!input.fields || !input.fields.length) return;

        return await ctx.prisma.question.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            type: input.type,
            fields: {
              deleteMany: {},
              create: [...input.fields.map((field) => ({ value: field }))],
            },
          },
        });
      } else {
        return await ctx.prisma.question.update({
          where: {
            id: input.id,
          },
          data: {
            title: input.title,
            type: input.type,
            fields: {
              deleteMany: {},
            },
          },
        });
      }
    }),
  deleteQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.question.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
