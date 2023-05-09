import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const faurmRouter = router({
  getFaurms: protectedProcedure.query(async ({ ctx }) => {
    const faurms = await ctx.prisma.faurm.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return {
      faurms,
    };
  }),
  getFaurmFilled: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const faurm = await ctx.prisma.faurm.findUnique({
        where: {
          id: input.id,
        },
        include: {
          filledBy: true,
        },
      });

      return {
        faurm,
      };
    }),
  getFaurm: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const faurm = await ctx.prisma.faurm.findUnique({
        where: {
          id: input.id,
        },
        include: {
          questions: {
            include: {
              fields: true,
            },
          },
        },
      });
      // console.log("Got");

      return {
        faurm,
      };
    }),
  setFaurm: publicProcedure
    .input(
      z.object({
        questions: z.array(
          z.object({
            title: z.string(),
            type: z.string(),
            fields: z.array(z.string()).optional(),
          })
        ),
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const faurm = await ctx.prisma.faurm.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          questions: {
            deleteMany: {},
            create: input.questions.map((question) => {
              if (
                question.type === "Text" ||
                !question.fields ||
                !question.fields.length
              ) {
                return {
                  title: question.title,
                  type: "Text",
                };
              } else {
                return {
                  title: question.title,
                  type: question.type,
                  fields: {
                    create: question.fields.map((field) => ({
                      value: field,
                    })),
                  },
                };
              }
            }),
          },
        },
      });
      return {
        faurm,
      };
    }),

  clearFaurms: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.faurm.deleteMany();
  }),
  createFaurm: publicProcedure
    .input(
      z.object({
        questions: z.array(
          z.object({
            title: z.string(),
            type: z.string(),
            fields: z.array(z.string()).optional(),
          })
        ),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const faurm = await ctx.prisma.faurm.create({
        data: {
          userId: ctx.session?.user.id,
          title: input.title,
          questions: {
            create: input.questions.map((question) => {
              if (
                question.type === "Text" ||
                !question.fields ||
                !question.fields.length
              ) {
                return {
                  title: question.title,
                  type: "Text",
                };
              } else {
                return {
                  title: question.title,
                  type: question.type,
                  fields: {
                    create: question.fields.map((field) => ({
                      value: field,
                    })),
                  },
                };
              }
            }),
          },
        },
      });
      return {
        faurm,
      };
    }),
  updateTitle: publicProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.faurm.update({
        data: {
          title: input.title,
        },
        where: {
          id: input.id,
        },
      });
    }),
});

// TODO: Figure out how to perform CRUD for the data model of FaurmState.
