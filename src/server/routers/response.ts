import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const responseRouter = router({
  getResponsesbyFaurm: publicProcedure
    .input(z.object({ faurmId: z.string() }))
    .query(async ({ ctx, input }) => {
      const responses = await ctx.prisma.response.findMany({
        where: {
          faurmId: input.faurmId,
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return responses;
    }),
  getResponse: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.response.findUnique({
        where: {
          id: input.id,
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
            },
          },
          answers: {
            select: {
              // question: {
              //   select: {
              //     id: true,
              //     title: true,
              //     type: true,
              //   },
              // },
              questionId: true,
              id: true,
              value: true,
            },
          },
        },
      });

      return response;
    }),
  // TODO: Check this fetch!!
  getResponseByUser: protectedProcedure
    .input(z.object({ faurmId: z.string() }))
    .query(async ({ ctx, input }) => {
      const response = await ctx.prisma.faurm.findUnique({
        where: {
          id: input.faurmId,
        },
        select: {
          responses: {
            where: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      return response;
    }),
  createResponse: publicProcedure
    .input(
      z.object({
        faurmId: z.string(),
        answers: z.array(
          z.object({ questionId: z.string(), value: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.response.create({
        data: {
          userId: ctx.session?.user.id,
          faurmId: input.faurmId,
          answers: {
            create: input.answers.map((answer) => ({
              value: answer.value ?? "",
              questionId: answer.questionId,
            })),
          },
        },
      });
    }),
  updateResponse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        answers: z.array(
          z.object({ questionId: z.string(), value: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.response.update({
        where: {
          id: input.id,
        },
        data: {
          answers: {
            deleteMany: {},
            create: input.answers,
          },
        },
      });
    }),
});

// TODO: Figure out how to perform CRUD for the data model of FaurmState.
