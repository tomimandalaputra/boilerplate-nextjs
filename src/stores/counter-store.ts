import { create } from "zustand";

// Client/UI state ONLY (PRD §3 Rule 1). Plain example: a counter with
// increment / decrement / reset actions. No server data, no async here.
interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset: () => set({ count: 0 }),
}));
