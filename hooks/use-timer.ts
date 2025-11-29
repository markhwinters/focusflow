import { useState, useEffect, useCallback, useRef } from "react";
import { SessionType } from "@/types";

interface UseTimerProps {
  initialDuration: number;
  sessionType: SessionType;
  onComplete: () => void;
  onTick?: (timeRemaining: number) => void;
}

export function useTimer({
  initialDuration,
  sessionType,
  onComplete,
  onTick,
}: UseTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(async () => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: sessionType,
          duration: initialDuration,
        }),
      });

      if (!response.ok) throw new Error("Failed to start session");

      const data = await response.json();
      setSessionId(data.id);
      setIsRunning(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  }, [sessionType, initialDuration]);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(initialDuration);
    setSessionId(null);
  }, [initialDuration]);

  const complete = useCallback(async () => {
    if (!sessionId) return;

    try {
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedAt: new Date().toISOString() }),
      });
    } catch (error) {
      console.error("Failed to complete session:", error);
    }

    setIsRunning(false);
    setIsPaused(false);
    onComplete();
  }, [sessionId, onComplete]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;

          if (onTick) {
            onTick(newTime);
          }

          if (newTime <= 0) {
            complete();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, complete, onTick]);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    sessionId,
    start,
    pause,
    resume,
    reset,
  };
}
