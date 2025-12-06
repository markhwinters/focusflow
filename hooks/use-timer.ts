import { useState, useEffect, useCallback, useRef } from "react";
import { SessionType } from "@/types";

interface UseTimerProps {
  initialDuration: number;
  sessionType: SessionType;
  onComplete: () => void;
  onTick?: (timeRemaining: number) => void;
}

interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  sessionId: string | null;
  duration: number;
  startTime: number | null;
}

export function useTimer({
  initialDuration,
  sessionType,
  onComplete,
  onTick,
}: UseTimerProps) {
  const storageKey = `focusflow_timer_${sessionType.toLowerCase()}`;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer state from localStorage
  const loadState = (): TimerState => {
    if (typeof window === "undefined") {
      return {
        timeRemaining: initialDuration,
        isRunning: false,
        isPaused: false,
        sessionId: null,
        duration: initialDuration,
        startTime: null,
      };
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.isRunning && state.startTime) {
          const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
          const remaining = Math.max(0, state.duration - elapsed);
          return {
            ...state,
            timeRemaining: remaining,
          };
        }
        return state;
      } catch (e) {
        console.error("Failed to load timer state:", e);
      }
    }

    return {
      timeRemaining: initialDuration,
      isRunning: false,
      isPaused: false,
      sessionId: null,
      duration: initialDuration,
      startTime: null,
    };
  };

  // Initialize state from loadState
  const [state, setState] = useState<TimerState>(loadState);

  // Save timer state to localStorage
  const saveState = useCallback(
    (newState: TimerState) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(newState));
      }
      setState(newState);
    },
    [storageKey]
  );

  // Update timeRemaining when initialDuration changes (e.g., slider moved)
  useEffect(() => {
    if (!state.isRunning && !state.isPaused) {
      setState((prev) => ({
        ...prev,
        timeRemaining: initialDuration,
        duration: initialDuration,
      }));
    }
  }, [initialDuration, state.isRunning, state.isPaused]);

  // Start timer session
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
      const newState: TimerState = {
        timeRemaining: initialDuration,
        isRunning: true,
        isPaused: false,
        sessionId: data.id,
        duration: initialDuration,
        startTime: Date.now(),
      };
      saveState(newState);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  }, [sessionType, initialDuration, saveState]);

  // Pause timer
  const pause = useCallback(() => {
    const newState = {
      ...state,
      isPaused: true,
      isRunning: false,
      startTime: null,
    };
    saveState(newState);
  }, [state, saveState]);

  // Resume timer
  const resume = useCallback(() => {
    const newState = {
      ...state,
      isPaused: false,
      isRunning: true,
      startTime: Date.now() - (state.duration - state.timeRemaining) * 1000,
    };
    saveState(newState);
  }, [state, saveState]);

  // Reset timer
  const reset = useCallback(() => {
    const newState: TimerState = {
      timeRemaining: initialDuration,
      isRunning: false,
      isPaused: false,
      sessionId: null,
      duration: initialDuration,
      startTime: null,
    };
    saveState(newState);
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [initialDuration, saveState, storageKey]);

  // Mark session as completed
  const complete = useCallback(async () => {
    if (!state.sessionId) return;

    try {
      await fetch(`/api/sessions/${state.sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedAt: new Date().toISOString() }),
      });
    } catch (error) {
      console.error("Failed to complete session:", error);
    }

    const newState: TimerState = {
      timeRemaining: 0,
      isRunning: false,
      isPaused: false,
      sessionId: state.sessionId,
      duration: state.duration,
      startTime: null,
    };
    saveState(newState);

    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }

    onComplete();
  }, [state.sessionId, state.duration, onComplete, saveState, storageKey]);

  // Timer ticking logic
  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      intervalRef.current = setInterval(() => {
        setState((prevState) => {
          const newTime = prevState.timeRemaining - 1;

          if (onTick) {
            onTick(newTime);
          }

          const newState = {
            ...prevState,
            timeRemaining: newTime,
          };

          if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify(newState));
          }

          if (newTime <= 0) {
            complete();
            return { ...newState, timeRemaining: 0 };
          }

          return newState;
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
  }, [state.isRunning, state.isPaused, complete, onTick, storageKey]);

  return {
    timeRemaining: state.timeRemaining,
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    sessionId: state.sessionId,
    start,
    pause,
    resume,
    reset,
  };
}
