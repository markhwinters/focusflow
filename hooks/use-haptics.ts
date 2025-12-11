import { useEffect, useState } from "react";
import { triggerHapticFeedback, isHapticSupported } from "@/lib/haptics";

export function useHaptics() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isHapticSupported());
  }, []);

  return {
    isSupported,
    trigger: triggerHapticFeedback,
  };
}
