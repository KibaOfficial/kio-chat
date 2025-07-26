// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import useSound from "use-sound";
import { toast } from "sonner";

interface ToastOptions {
  soundName?: string;
  [key: string]: any;
}

type ToastFunction = (message: string, options?: any) => any;

export function useToastWithSound() {
  const [playNotification] = useSound("/sounds/notification.mp3");

  const playCustomSound = (soundName: string): void => {
    if (soundName) {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  const createToastWithSound = (toastFn: ToastFunction, defaultSound?: () => void) => {
    return (message: string, options: ToastOptions = {}) => {
      const { soundName, ...toastOptions } = options;

      if (soundName) {
        playCustomSound(soundName);
      } else if (defaultSound) {
        defaultSound();
      }

      return toastFn(message, toastOptions);
    };
  };

  return {
    toast: {
      success: createToastWithSound(toast.success, playNotification),
      error: createToastWithSound(toast.error, playNotification),
      info: createToastWithSound(toast.info, playNotification),
      warning: createToastWithSound(toast.warning, playNotification),
      loading: createToastWithSound(toast.loading, playNotification),
      toast: createToastWithSound(toast, undefined),
    },
    playCustomSound,
  };
}