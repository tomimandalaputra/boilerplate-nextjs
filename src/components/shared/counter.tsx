"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/stores/counter-store";

// Reads the counter slice from Zustand. Selecting each field individually
// keeps re-renders scoped to what this component actually uses.
export function Counter() {
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const decrement = useCounterStore((s) => s.decrement);
  const reset = useCounterStore((s) => s.reset);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-5xl font-bold tabular-nums">{count}</p>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={decrement} aria-label="Decrement">
          <Minus className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={reset} aria-label="Reset">
          <RotateCcw className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={increment} aria-label="Increment">
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
