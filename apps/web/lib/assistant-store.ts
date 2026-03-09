"use client";

import { create } from "zustand";

interface AssistantState {
  answers: Record<string, string>;
  setAnswer: (questionId: string, value: string) => void;
  reset: () => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  answers: {},
  setAnswer: (questionId, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: value,
      },
    })),
  reset: () => set({ answers: {} }),
}));
