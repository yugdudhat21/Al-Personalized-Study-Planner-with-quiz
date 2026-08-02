/**
 * Web Audio API synthesizer for timer alarms and notification chimes.
 */

export function playTimerCompletionSound() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Uplifting multi-chord chime sequence
    playTone(523.25, 0, 0.4);   // C5
    playTone(659.25, 0.2, 0.4); // E5
    playTone(783.99, 0.4, 0.5); // G5
    playTone(1046.50, 0.6, 0.8); // C6
  } catch (err) {
    console.error('Audio playback error:', err);
  }
}

export function playBreakCompletionSound() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const playTone = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    playTone(440.00, 0, 0.3);   // A4
    playTone(554.37, 0.2, 0.5); // C#5
  } catch (err) {
    console.error('Audio playback error:', err);
  }
}
