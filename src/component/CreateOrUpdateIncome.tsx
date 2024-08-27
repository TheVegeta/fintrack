import { Formik, FormikHelpers } from "formik";
import _ from "lodash";
import moment from "moment";
import { nanoid } from "nanoid/non-secure";
import React, { FC, useState } from "react";
import { InteractionManager } from "react-native";
import { Sheet } from "tamagui";
import * as Yup from "yup";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
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

const CreateOrUpdateIncome: FC<{
  isOpen: boolean;
  toggle: () => void;
  id?: string;
  setEditId?: (id: string) => void;
}> = ({ isOpen, toggle, id = "", setEditId }) => {
  const [initVal, setInitVal] = useState(initialValues);
  const incomeCategory = useAppStore((state) => state.incomeCategory);
  const monthlyIncome = useAppStore((state) => state.monthlyIncome);
  const setMonthlyIncome = useAppStore((state) => state.setMonthlyIncome);
  const updateMonthlyIncome = useAppStore((state) => state.updateMonthlyIncome);

  useRunAfterInteraction(() => {
    if (id) {
      const item = _.find(monthlyIncome, { _id: id });

      if (item) {
        setInitVal({
          amt: _.toString(item.amt),
          category: item.categoryId,
          date: moment(item.date).toISOString(),
          note: item.notes,
        });
      }
    } else {
      setInitVal(initialValues);
    }
  }, [id]);

  const handleSubmit = (
    val: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    InteractionManager.runAfterInteractions(() => {
      actions.setSubmitting(true);

      if (id) {
        updateMonthlyIncome({
          _id: id,
          categoryId: val.category,
          notes: val.note,
          amt: _.toNumber(val.amt),
          date: moment(val.date).toDate(),
          _active: true,
        });
      } else {
        setMonthlyIncome({
          _id: nanoid(12),
          categoryId: val.category,
          notes: val.note,
          amt: _.toNumber(val.amt),
          date: moment(val.date).toDate(),
          _active: true,
        });
      }

      actions.resetForm();

      actions.setSubmitting(false);

      if (typeof setEditId === "function") {
        setEditId("");
        setInitVal(initialValues);
      }

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
            initialValues={initVal}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
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
                    options={incomeCategory}
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

export default CreateOrUpdateIncome;
