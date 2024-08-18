import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeName } from "tamagui";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AppState {
  currencyCode: string;
  theme: ThemeName;
  userName: string;
  setCurrencyCode: (symbol: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      currencyCode: "",
      theme: "light_pink",
      userName: "Guest",
      setCurrencyCode: (symbol) => set((state) => ({ currencyCode: symbol })),
    })),
    {
      name: "app-storage",
      version: 0.01,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
