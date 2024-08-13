// useCountdown.ts
export function useCountdown(initialTime: number) {
  const countdown = ref(initialTime);
  const isRunning = ref(false);
  let countdownStartTime: number | null = null;
  let countdownAnimationFrameId: number | null = null;

  function start() {
    countdownStartTime = performance.now();
    isRunning.value = true;
    requestAnimationFrame(updateCountdown);
  }

  function updateCountdown(timestamp: number) {
    if (countdownStartTime !== null) {
      const elapsed = (timestamp - countdownStartTime) / 1000;
      const newCountdown = Math.max(initialTime - Math.floor(elapsed), 0);
      countdown.value = newCountdown;

      if (newCountdown <= 0) {
        isRunning.value = false;
      } else {
        countdownAnimationFrameId = requestAnimationFrame(updateCountdown);
      }
    }
  }

  function stop() {
    if (countdownAnimationFrameId !== null) {
      cancelAnimationFrame(countdownAnimationFrameId);
      countdownAnimationFrameId = null;
    }
    isRunning.value = false;
  }

  onUnmounted(() => {
    stop();
  });

  return {
    countdown,
    isRunning,
    start,
    stop
  };
}
