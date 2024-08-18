import { useEffect } from "react";
import { InteractionManager } from "react-native";

export const useRunAfterInteraction = (
  effect: () => void | (() => void),
  deps: any[]
) => {
  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      if (typeof effect === "function") {
        const cleanup = effect();
        if (typeof cleanup === "function") {
          return cleanup;
        }
      }
    });

    return () => {
      if (handle) {
        handle.cancel();
      }
    };
  }, deps);
};
