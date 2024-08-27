import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
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
  _active: boolean;
}

export interface ICategory {
  name: string;
  icon: string;
  _id: string;
  _active: boolean;
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

  updateMonthlyIncome: (item: IExpenses) => void;
  updateMonthlyExpenses: (item: IExpenses) => void;

  setCategory: (type: "income" | "expense", item: ICategory) => void;
  updateCategory: (type: "income" | "expense", item: ICategory) => void;

  removeCategory: (_id: string) => void;
  removeExpense: (_id: string) => void;
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
          state.monthlyIncome.push({ ...item, _id: nanoid(12) });
        }),

      setMonthlyExpenses: (item) =>
        set((state) => {
          state.monthlyExpenses.push({ ...item, _id: nanoid(12) });
        }),

      updateMonthlyIncome: (item) =>
        set((state) => {
          state.monthlyIncome = state.monthlyIncome.map((val) => {
            if (val._id === item._id) {
              return item;
            }
            return val;
          });
        }),

      updateMonthlyExpenses: (item) =>
        set((state) => {
          state.monthlyExpenses = state.monthlyExpenses.map((val) => {
            if (val._id === item._id) {
              return item;
            }
            return val;
          });
        }),

      removeCategory: (_id) =>
        set((state) => {
          const findIncomeCategory = _.find(state.incomeCategory, { _id });
          const findExpensesCategory = _.find(state.expensesCategory, { _id });

          if (findIncomeCategory) {
            state.incomeCategory = state.incomeCategory.map((item) => {
              if (item._id === _id) {
                return { ...item, _active: false };
              } else {
                return item;
              }
            });
          }

          if (findExpensesCategory) {
            state.expensesCategory = state.expensesCategory.map((item) => {
              if (item._id === _id) {
                return { ...item, _active: false };
              } else {
                return item;
              }
            });
          }
        }),

      removeExpense: (_id) =>
        set((state) => {
          const findIncome = _.find(state.monthlyIncome, { _id });
          const findExpenses = _.find(state.monthlyExpenses, { _id });

          if (findIncome) {
            state.monthlyIncome = state.monthlyIncome.map((item) => {
              if (item._id === _id) {
                return { ...item, _active: false };
              } else {
                return item;
              }
            });
          }

          if (findExpenses) {
            state.monthlyExpenses = state.monthlyExpenses.map((item) => {
              if (item._id === _id) {
                return { ...item, _active: false };
              } else {
                return item;
              }
            });
          }
        }),

      setCategory: (type, item) => {
        set((state) => {
          if (type === "income") {
            state.incomeCategory.push(item);
          }

          if (type === "expense") {
            state.expensesCategory.push(item);
          }
        });
      },

      updateCategory: (type, updatedValue) => {
        set((state) => {
          if (type === "income") {
            state.incomeCategory = state.incomeCategory.map((item) => {
              if (item._id === updatedValue._id) {
                return updatedValue;
              } else {
                return item;
              }
            });
          }

          if (type === "expense") {
            state.expensesCategory = state.expensesCategory.map((item) => {
              if (item._id === updatedValue._id) {
                return updatedValue;
              } else {
                return item;
              }
            });
          }
        });
      },
    })),
    {
      name: "app-storage",
      version: 0.01,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
