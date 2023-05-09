import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const fieldRouter = router({
  getFields: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return {
        fields: await ctx.prisma.field.findMany({
          where: {
            questionId: input.questionId,
          },
        }),
      };
    }),
  setFields: protectedProcedure
    .input(z.object({ questionId: z.string(), fields: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.field.deleteMany({
        where: {
          questionId: input.questionId,
        },
      });
      input.fields.map((field) => {
        ctx.prisma.field.create({
          data: {
            value: field,
            questionId: input.questionId,
          },
        });
      });
    }),
  clearFields: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.field.deleteMany({
        where: {
          questionId: input.questionId,
        },
      });
    }),
  createField: protectedProcedure
    .input(z.object({ questionId: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.field.create({
        data: {
          questionId: input.questionId,
          value: input.value,
        },
      });
    }),
  deleteField: protectedProcedure
    .input(z.object({ fieldId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.field.delete({
        where: {
          id: input.fieldId,
        },
      });
    }),
  updateField: protectedProcedure
    .input(z.object({ fieldId: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.field.update({
        where: {
          id: input.fieldId,
        },
        data: {
          value: input.value,
        },
      });
    }),
});
