import { Formik, FormikHelpers } from "formik";
import _ from "lodash";
import moment from "moment";
import { nanoid } from "nanoid/non-secure";
import React, { FC } from "react";
import { InteractionManager } from "react-native";
import { Sheet } from "tamagui";
import * as Yup from "yup";
import { useAppStore } from "../store";
import {
  CustomButton,
  CustomDatePicker,
  CustomInput,
  CustomSelectCategory,
} from "./form";

const initialValues = {
  date: "",
  note: "",
  amt: "",
  category: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  note: Yup.string(),
  category: Yup.string().required("Category is required"),
  amt: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
});

const CreateOrUpdateExpenses: FC<{
  isOpen: boolean;
  toggle: () => void;
}> = ({ isOpen, toggle }) => {
  const expensesCategory = useAppStore((state) => state.expensesCategory);
  const setMonthlyExpenses = useAppStore((state) => state.setMonthlyExpenses);

  const handleSubmit = (
    val: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    InteractionManager.runAfterInteractions(() => {
      actions.setSubmitting(true);

      setMonthlyExpenses({
        _id: nanoid(6),
        categoryId: val.category,
        notes: val.note,
        amt: _.toNumber(val.amt),
        date: moment(val.date).toDate(),
      });

      actions.resetForm();

      actions.setSubmitting(false);

      toggle();
    });
  };

  return (
    <>
      <Sheet
        dismissOnSnapToBottom={false}
        animation="medium"
        open={isOpen}
        snapPoints={[65]}
        onOpenChange={toggle}
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame px="$6" py="$4">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
              isSubmitting,
            }) => {
              return (
                <>
                  <CustomDatePicker
                    errMsg={errors.date}
                    heading="Date"
                    isInvalid={!!touched.date && !!errors.date}
                    setFieldValue={setFieldValue}
                    fieldName="date"
                    value={values.date}
                    placeholder="Enter the date"
                  />

                  <CustomInput
                    errMsg={errors.amt}
                    heading="Amount"
                    isInvalid={!!touched.amt && !!errors.amt}
                    onChangeText={handleChange("amt")}
                    value={values.amt}
                    placeholder="Enter the amount"
                  />

                  <CustomSelectCategory
                    errMsg={errors.category}
                    heading="Category"
                    isInvalid={!!touched.category && !!errors.category}
                    options={expensesCategory}
                    setFieldValue={setFieldValue}
                    fieldName="category"
                    placeholder="Select a category"
                    value={values.category}
                  />

                  <CustomInput
                    errMsg={errors.note}
                    heading="Note"
                    isInvalid={!!touched.note && !!errors.note}
                    onChangeText={handleChange("note")}
                    value={values.note}
                    placeholder="Enter the note"
                    isTextArea={true}
                  />

                  <CustomButton
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                </>
              );
            }}
          </Formik>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default CreateOrUpdateExpenses;
