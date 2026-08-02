import { create } from 'zustand';
import { playTimerCompletionSound, playBreakCompletionSound } from '@/utils/sound';

export const useTimerStore = create((set, get) => ({
  mode: '25/5', // '25/5', '50/10', or 'custom'
  isBreak: false,
  workMinutes: 25,
  breakMinutes: 5,
  timeLeft: 25 * 60, // in seconds
  isRunning: false,
  selectedSubjectId: null,
  selectedTopic: '',
  elapsedSeconds: 0,
  intervalId: null,

  setMode: (mode, customWork = 25, customBreak = 5) => {
    get().pauseTimer();
    let work = 25;
    let breakMin = 5;

    if (mode === '50/10') {
      work = 50;
      breakMin = 10;
    } else if (mode === 'custom') {
      work = Math.max(1, customWork);
      breakMin = Math.max(1, customBreak);
    }

    set({
      mode,
      isBreak: false,
      workMinutes: work,
      breakMinutes: breakMin,
      timeLeft: work * 60,
      elapsedSeconds: 0,
    });
  },

  setSelectedSubject: (subjectId, topic = '') => {
    set({ selectedSubjectId: subjectId, selectedTopic: topic });
  },

  startTimer: () => {
    if (get().isRunning) return;

    // Request notification permission if needed
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    set({ isRunning: true });

    const interval = setInterval(() => {
      const { timeLeft, isBreak, elapsedSeconds, workMinutes, breakMinutes } = get();

      if (timeLeft > 1) {
        set({
          timeLeft: timeLeft - 1,
          elapsedSeconds: !isBreak ? elapsedSeconds + 1 : elapsedSeconds,
        });
      } else {
        // Timer Completed!
        get().pauseTimer();

        if (!isBreak) {
          // Work session finished -> switch to break
          playTimerCompletionSound();
          get().sendNotification('Study Session Completed!', 'Time for a well-deserved break!');
          
          set({
            isBreak: true,
            timeLeft: breakMinutes * 60,
          });
        } else {
          // Break finished -> switch to work
          playBreakCompletionSound();
          get().sendNotification('Break Finished!', 'Ready to crush another study block?');

          set({
            isBreak: false,
            timeLeft: workMinutes * 60,
          });
        }
      }
    }, 1000);

    set({ intervalId: interval });
  },

  pauseTimer: () => {
    const { intervalId } = get();
    if (intervalId) {
      clearInterval(intervalId);
    }
    set({ isRunning: false, intervalId: null });
  },

  resetTimer: () => {
    get().pauseTimer();
    const { isBreak, workMinutes, breakMinutes } = get();
    set({
      timeLeft: (isBreak ? breakMinutes : workMinutes) * 60,
      elapsedSeconds: 0,
    });
  },

  sendNotification: (title, body) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  },
}));
