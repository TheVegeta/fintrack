import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";
import { ThemeName } from "tamagui";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { expensesCategory, incomeCategory } from "./data/category";

export interface IExpenses {
  date: Date;
  categoryId: string;
  amt: number;
  notes: string;
  _id: string;
}

export interface ICategory {
  name: string;
  icon: string;
  _id: string;
}

interface AppState {
  currencyCode: string;
  setCurrencyCode: (symbol: string) => void;

  theme: ThemeName;

  userName: string;
  setUserName: (userName: string) => void;

  incomeCategory: ICategory[];
  expensesCategory: ICategory[];

  monthlyIncome: IExpenses[];
  monthlyExpenses: IExpenses[];

  setMonthlyIncome: (item: IExpenses) => void;
  setMonthlyExpenses: (item: IExpenses) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set) => ({
      currencyCode: "",
      setCurrencyCode: (symbol) => set((state) => ({ currencyCode: symbol })),

      theme: "light_pink",

      userName: "Guest",
      setUserName: (userName) => set((state) => ({ userName })),

      incomeCategory,
      expensesCategory,

      monthlyIncome: [],
      monthlyExpenses: [],

      setMonthlyIncome: (item) =>
        set((state) => {
          state.monthlyIncome.push({ ...item, _id: nanoid(6) });
        }),
      setMonthlyExpenses: (item) =>
        set((state) => {
          state.monthlyExpenses.push({ ...item, _id: nanoid(6) });
        }),
    })),
    {
      name: "app-storage",
      version: 0.01,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
