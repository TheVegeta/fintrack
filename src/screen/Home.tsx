import { ArrowDownLeft, ArrowUpRight, Eye } from "@tamagui/lucide-icons";
import { useToggle } from "ahooks";
import { Formik, FormikHelpers } from "formik";
import _ from "lodash";
import React, { useState } from "react";
import { InteractionManager } from "react-native";
import { Button, Heading, Paragraph, Separator, Sheet, View } from "tamagui";
import * as Yup from "yup";
import { CustomButton, CustomInput } from "../component/form";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
import { useAppStore } from "../store";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Please enter a name with at least 3 characters.")
    .required("Name is required."),
});

const Home = () => {
  const userName = useAppStore((state) => state.userName);
  const currencyCode = useAppStore((state) => state.currencyCode);
  const setUserName = useAppStore((state) => state.setUserName);
  const [isOpen, { toggle }] = useToggle(false);
  const [initialValue, setInitialValue] = useState({
    name: "",
  });

  useRunAfterInteraction(() => {
    if (userName) {
      setInitialValue({ name: userName });
    }
  }, [userName]);

  const handleSubmit = (
    val: typeof initialValue,
    actions: FormikHelpers<typeof initialValue>
  ) => {
    InteractionManager.runAfterInteractions(() => {
      actions.setSubmitting(true);
      setUserName(val.name);
      toggle();
      actions.setSubmitting(false);
    });
  };

  return (
    <>
      <View flex={1} bg="$color2" px="$6">
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <View mt="$5">
            <Paragraph mb="$-true">Hello,</Paragraph>
            <Heading mt="$2.5">{_.capitalize(userName)}</Heading>
          </View>
          <View mt="$5">
            <Button icon={Eye} scaleIcon={1.5} onPress={toggle} />
          </View>
        </View>

        <Separator borderWidth="$0.5" my="$2.5" />

        <View flexDirection="row" gap="$3">
          <View bg="$color4" p="$4" borderRadius="$4" w="48%">
            <View flexDirection="row" alignItems="center" gap="$1" py="$1">
              <Paragraph fontSize="$4">Income</Paragraph>
              <ArrowDownLeft size={14} mb="$1" />
            </View>

            <Heading fontSize="$8">{currencyCode} 20,000</Heading>
          </View>

          <View bg="$color4" p="$4" borderRadius="$4" w="48%">
            <View flexDirection="row" alignItems="center" gap="$1" py="$1">
              <Paragraph fontSize="$4">Expense</Paragraph>
              <ArrowUpRight size={14} mb="$1" />
            </View>

            <Heading fontSize="$8">{currencyCode} 20,000</Heading>
          </View>
        </View>

        <Separator borderWidth="$0.5" my="$2.5" />
      </View>

      <Sheet
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
            initialValues={initialValue}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              touched,
              errors,
              isSubmitting,
            }) => {
              return (
                <>
                  <CustomInput
                    errMsg={errors.name}
                    heading="Name"
                    isInvalid={!!touched.name && !!errors.name}
                    onChangeText={handleChange("name")}
                    value={values.name}
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

export default Home;
