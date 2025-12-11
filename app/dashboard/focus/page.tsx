"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ProgressRing } from "@/components/timer/progress-ring";
import { TimerControls } from "@/components/timer/timer-controls";
import { ReflectionModal } from "@/components/timer/reflection-modal";
import { useTimer } from "@/hooks/use-timer";
import { useSettings } from "@/hooks/use-settings";
import { useHaptics } from "@/hooks/use-haptics";
import { formatTime, calculateProgress } from "@/lib/utils";
import { playCompletionSound } from "@/lib/audio";
import { Focus } from "lucide-react";

export default function FocusPage() {
  const { settings, loading: settingsLoading } = useSettings();
  const [duration, setDuration] = useState(1500);
  const [showReflection, setShowReflection] = useState(false);
  const { trigger: triggerHaptic } = useHaptics();

  useEffect(() => {
    if (settings) {
      setDuration(settings.defaultDuration);
    }
  }, [settings]);

  const handleComplete = () => {
    if (settings?.soundEnabled) {
      playCompletionSound();
    }
    if (settings?.hapticEnabled) {
      triggerHaptic("success");
    }
    setShowReflection(true);
  };

  const {
    timeRemaining,
    isRunning,
    isPaused,
    sessionId,
    start,
    pause,
    resume,
    reset,
  } = useTimer({
    initialDuration: duration,
    sessionType: "FOCUS",
    onComplete: handleComplete,
  });

  const handleReflectionSubmit = async (rating: number, notes: string) => {
    if (!sessionId) return;

    try {
      await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          rating,
          notes,
        }),
      });
      toast.success("Reflection saved!");
    } catch (error) {
      toast.error("Failed to save reflection");
    }
  };

  const handleDurationChange = (value: number[]) => {
    if (!isRunning && !isPaused) {
      setDuration(value[0]);
    }
  };

  const progress = calculateProgress(timeRemaining, duration);

  if (settingsLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-12rem)] space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Focus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          Focus Session
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay focused and productive
        </p>
      </div>

      <Card className="p-8 w-full max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="space-y-8">
          <div className="flex justify-center">
            <ProgressRing progress={progress} size={280}>
              <div className="text-center">
                <div className="text-6xl font-bold tabular-nums text-gray-900 dark:text-white">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {isRunning ? "In Progress" : isPaused ? "Paused" : "Ready"}
                </div>
              </div>
            </ProgressRing>
          </div>

          {!isRunning && !isPaused && (
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Duration: {Math.floor(duration / 60)} minutes
              </label>
              <Slider
                value={[duration]}
                onValueChange={handleDurationChange}
                min={300}
                max={3600}
                step={300}
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
        </div>
      </Card>

      <ReflectionModal
        open={showReflection}
        onOpenChange={setShowReflection}
        sessionId={sessionId}
        onSubmit={handleReflectionSubmit}
      />
    </div>
  );
}
