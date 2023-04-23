import { EditorState, SerializedEditorState } from "lexical";
import { create } from "zustand";

// TODO: Simplify the logic and try to use arrays instead of Map.

type FaurmQuestion =
  | {
      title?: SerializedEditorState;
      type: "MCQ" | "MAQ";
      fields: string[];
    }
  | { title?: SerializedEditorState; type: "Text" };

interface FaurmState {
  open: number | undefined;
  setOpen: (newOpen: number | undefined) => void;

  questions: Map<number | string, FaurmQuestion>;
  setQuestion: (
    id: number | string,
    {
      title,
      type,
      fields,
    }:
      | {
          title?: SerializedEditorState;
          type?: "MCQ" | "MAQ";
          fields?: string[];
        }
      | { title?: SerializedEditorState; type: "Text"; fields: never }
  ) => void;

  // questions: FaurmQuestion[];
  // addQuestion: (id: number) => void;
  // updateTitle: (id: number, title: SerializedEditorState) => void;
  // updateType: (
  //   id: number,
  //   type: "MCQ" | "MAQ" | "Text",
  //   fields?: string[]
  // ) => void;
}

export const useFaurmStore = create<FaurmState>()((set, get) => ({
  open: undefined,
  setOpen(newOpen) {
    set(() => ({
      open: newOpen,
    }));
  },
  questions: new Map<number | string, FaurmQuestion>(),
  setQuestion(id, { title, type, fields }) {
    const prev = get().questions.get(id);
    const question: FaurmQuestion =
      type === "Text"
        ? prev?.type === "Text"
          ? {
              title: title ?? prev?.title,
              type: type ?? prev?.type ?? "Text",
            }
          : {
              title: title ?? prev?.title,
              type: type ?? "Text",
            }
        : prev?.type !== "Text"
        ? {
            title: title ?? prev?.title,
            type: type ?? prev?.type ?? "MCQ",
            fields: fields ?? prev?.fields ?? [],
          }
        : {
            title: title ?? prev?.title,
            type: type ?? prev?.type ?? "MCQ",
            fields: fields ?? [],
          };

    set((state) => ({
      questions: state.questions.set(id, question),
    }));
  },
}));
