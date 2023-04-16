import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";

interface faurmState {
  toolbar: boolean;
  setToolbar: (toolbar: boolean) => void;
}

export const useFaurmStore = create<faurmState>()((set) => ({
  toolbar: false,
  setToolbar(toolbar) {
    set({
      toolbar,
    });
  },
}));
