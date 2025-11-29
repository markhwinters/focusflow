let audioContext: AudioContext | null = null;

export function initAudio() {
  if (typeof window === "undefined") return;

  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
}

export function playCompletionSound() {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio("/sounds/complete.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.error("Audio playback failed:", err));
  } catch (error) {
    console.error("Failed to play completion sound:", error);
  }
}

export function playTickSound() {
  if (!audioContext) initAudio();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.1
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}
