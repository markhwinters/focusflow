"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ProgressRing } from "@/components/timer/progress-ring";
import { TimerControls } from "@/components/timer/timer-controls";
import { useTimer } from "@/hooks/use-timer";
import { useSettings } from "@/hooks/use-settings";
import { useHaptics } from "@/hooks/use-haptics";
import { formatTime, calculateProgress } from "@/lib/utils";
import { playCompletionSound } from "@/lib/audio";
import { Coffee } from "lucide-react";

export default function BreakPage() {
  const { settings, loading: settingsLoading } = useSettings();
  const [duration, setDuration] = useState(300);
  const { trigger: triggerHaptic } = useHaptics();

  useEffect(() => {
    if (settings) {
      setDuration(settings.breakDuration);
    }
  }, [settings]);

  const handleComplete = () => {
    if (settings?.soundEnabled) {
      playCompletionSound();
    }
    if (settings?.hapticEnabled) {
      triggerHaptic("success");
    }
    toast.success("Break complete! Ready to focus again?");
  };

  const { timeRemaining, isRunning, isPaused, start, pause, resume, reset } =
    useTimer({
      initialDuration: duration,
      sessionType: "BREAK",
      onComplete: handleComplete,
    });

  const handleDurationChange = (value: number[]) => {
    if (!isRunning && !isPaused) {
      setDuration(value[0]);
    }
  };

  const progress = calculateProgress(timeRemaining, duration);

  if (settingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Coffee className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Break Time</h1>
        </div>
        <p className="text-muted-foreground">Take a well-deserved break</p>
      </div>

      <Card className="p-8 w-full max-w-md">
        <div className="space-y-8">
          <div className="flex justify-center">
            <ProgressRing progress={progress} size={280}>
              <div className="text-center">
                <div className="text-6xl font-bold tabular-nums">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {isRunning ? "Relaxing" : isPaused ? "Paused" : "Ready"}
                </div>
              </div>
            </ProgressRing>
          </div>

          {!isRunning && !isPaused && (
            <div className="space-y-4">
              <label className="text-sm font-medium">
                Duration: {Math.floor(duration / 60)} minutes
              </label>
              <Slider
                value={[duration]}
                onValueChange={handleDurationChange}
                min={60}
                max={900}
                step={60}
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-center">
            <TimerControls
              isRunning={isRunning}
              isPaused={isPaused}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
            />
          </div>

          {!isRunning && !isPaused && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-sm">Break Suggestions:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Stretch your body</li>
                <li>• Get some water</li>
                <li>• Step outside for fresh air</li>
                <li>• Do some light exercise</li>
                <li>• Rest your eyes</li>
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
