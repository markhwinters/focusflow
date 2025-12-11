export function triggerHapticFeedback(
  pattern: "success" | "warning" | "error" = "success"
) {
  if (typeof window === "undefined" || !("vibrate" in navigator)) {
    return;
  }

  try {
    switch (pattern) {
      case "success":
        navigator.vibrate([100, 50, 100]);
        break;
      case "warning":
        navigator.vibrate([50, 50, 50]);
        break;
      case "error":
        navigator.vibrate([200, 100, 200, 100, 200]);
        break;
    }
  } catch (error) {
    console.error("Haptic feedback failed:", error);
  }
}

export function isHapticSupported(): boolean {
  return typeof window !== "undefined" && "vibrate" in navigator;
}
