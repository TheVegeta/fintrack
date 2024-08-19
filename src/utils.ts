import _ from "lodash";
import { ICategory } from "./store";

export const findCategory = (
  _id: string,
  arr: ICategory[]
): ICategory | undefined => {
  return _.find(arr, { _id });
};
