"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {!isRunning && !isPaused && (
        <Button onClick={onStart} size="lg" className="px-8">
          <Play className="mr-2 h-5 w-5" />
          Start
        </Button>
      )}

      {isRunning && !isPaused && (
        <Button
          onClick={onPause}
          size="lg"
          variant="secondary"
          className="px-8"
        >
          <Pause className="mr-2 h-5 w-5" />
          Pause
        </Button>
      )}

      {isPaused && (
        <Button onClick={onResume} size="lg" className="px-8">
          <Play className="mr-2 h-5 w-5" />
          Resume
        </Button>
      )}

      {(isRunning || isPaused) && (
        <Button onClick={onReset} size="lg" variant="outline">
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      )}
    </div>
  );
}
