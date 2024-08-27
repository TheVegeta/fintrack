import { Formik, FormikHelpers } from "formik";
import _ from "lodash";
import { nanoid } from "nanoid/non-secure";
import React, { FC, useState } from "react";
import { Sheet } from "tamagui";
import * as Yup from "yup";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
import { useAppStore } from "../store";
import { CustomButton, CustomInput } from "./form";

const initialValues = {
  name: "",
  _id: "",
};

const validationSchema = Yup.object().shape({
  _id: Yup.string(),
  name: Yup.string()
    .min(3, "Please enter at least 3 characters.")
    .required("category name is required"),
});

const CreateOrUpdateCategory: FC<{
  isOpen: boolean;
  toggle: () => void;
  id?: string;
  setEditId?: (id: string) => void;
  type: "" | "income" | "expense";
}> = ({ isOpen, toggle, id, setEditId, type }) => {
  const [initVal, setInitVal] = useState(initialValues);
  const expensesCategory = useAppStore((state) => state.expensesCategory);
  const incomeCategory = useAppStore((state) => state.incomeCategory);
  const setCategory = useAppStore((state) => state.setCategory);
  const updateCategory = useAppStore((state) => state.updateCategory);

  useRunAfterInteraction(() => {
    if (id) {
      const findIncomeCategory = _.find(incomeCategory, { _id: id });
      const findExpensesCategory = _.find(expensesCategory, { _id: id });

      if (findIncomeCategory) {
        setInitVal({
          name: findIncomeCategory.name,
          _id: findIncomeCategory._id,
        });
      }
      if (findExpensesCategory) {
        setInitVal({
          name: findExpensesCategory.name,
          _id: findExpensesCategory._id,
        });
      }
    }
  }, [id]);

  const handleSubmit = (
    val: typeof initialValues,
    actions: FormikHelpers<typeof initialValues>
  ) => {
    actions.setSubmitting(true);

    if (id) {
      const findIncomeCategory = _.find(incomeCategory, { _id: id });
      const findExpensesCategory = _.find(expensesCategory, { _id: id });

      if (findIncomeCategory) {
        updateCategory("income", {
          _active: true,
          _id: id,
          icon: "",
          name: val.name,
        });
      }

      if (findExpensesCategory) {
        updateCategory("expense", {
          _active: true,
          _id: id,
          icon: "",
          name: val.name,
        });
      }
    } else {
      if (type === "expense" || type === "income") {
        setCategory(type, {
          _id: nanoid(12),
          _active: true,
          icon: "",
          name: val.name,
        });
      }
    }

    setInitVal(initialValues);

    if (typeof setEditId === "function") {
      setEditId("");
    }

    toggle();
    actions.resetForm();
    actions.setSubmitting(false);
  };

  return (
    <>
      <Sheet
        dismissOnSnapToBottom={false}
        animation="medium"
        open={isOpen}
        snapPoints={[25]}
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
                  <CustomInput
                    errMsg={errors.name}
                    heading="Category Name"
                    isInvalid={!!touched.name && !!errors.name}
                    onChangeText={handleChange("name")}
                    value={values.name}
                    placeholder="Enter the category Name"
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

export default CreateOrUpdateCategory;
