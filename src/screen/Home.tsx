import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useIsFocused } from "@react-navigation/native";
import { ArrowDownLeft, ArrowUpRight, Eye } from "@tamagui/lucide-icons";
import { useToggle } from "ahooks";
import { Formik, FormikHelpers } from "formik";
import _ from "lodash";
import moment from "moment";
import React, { FC, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
import { FloatingMenu } from "react-native-floating-action-menu";
import { RenderState } from "react-native-floating-action-menu/dist/src/components/FloatingMenu";
import { ItemConfig } from "react-native-floating-action-menu/dist/src/types";
import {
  Button,
  Heading,
  Paragraph,
  Separator,
  Sheet,
  Text,
  useTheme,
  View,
} from "tamagui";
import * as Yup from "yup";
import CreateOrUpdateExpenses from "../component/CreateOrUpdateExpenses";
import CreateOrUpdateIncome from "../component/CreateOrUpdateIncome";
import { CustomButton, CustomInput } from "../component/form";
import { currencyList } from "../data/currencyList";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
import { IExpenses, useAppStore } from "../store";
import { findCategory } from "../utils";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Please enter a name with at least 3 characters.")
    .required("Name is required."),
});

export const renderItemIcon = (
  item: ItemConfig,
  index: number,
  props: RenderState
) => {
  if ("fa" in item && item.fa) {
    return <FontAwesome6 color="black" name={item.fa} size={18} />;
  }

  return null;
};

const FloatingButton: FC<{
  toggleIncome: Function;
  toggleExpenses: Function;
}> = ({ toggleExpenses, toggleIncome }) => {
  const theme = useTheme();
  const [isOpen, { toggle }] = useToggle(false);

  const items = useMemo<ItemConfig[]>(
    () => [
      {
        label: "Add Expense",
        fa: "plus",
      },
      {
        label: "Add Income",
        fa: "piggy-bank",
      },
    ],
    []
  );

  const handleItemPress = (item: ItemConfig, index: number) => {
    toggle();

    if (item.label === "Add Expense") toggleExpenses();

    if (item.label === "Add Income") toggleIncome();
  };

  return (
    <>
      {/*  @ts-ignore */}
      <FloatingMenu
        items={items}
        onMenuToggle={toggle}
        onItemPress={handleItemPress}
        isOpen={isOpen}
        renderMenuIcon={() => (
          <FontAwesome6
            color="black"
            name={isOpen ? "xmark" : "plus"}
            size={18}
          />
        )}
        primaryColor={theme.color4.val}
        borderColor={theme.color4.val}
        buttonWidth={60}
        innerWidth={50}
        renderItemIcon={renderItemIcon}
      />
    </>
  );
};

const Home = () => {
  const userName = useAppStore((state) => state.userName);
  const currencyCode = useAppStore((state) => state.currencyCode);
  const monthlyIncome = useAppStore((state) => state.monthlyIncome);
  const monthlyExpenses = useAppStore((state) => state.monthlyExpenses);
  const incomeCategory = useAppStore((state) => state.incomeCategory);
  const expensesCategory = useAppStore((state) => state.expensesCategory);
  const setUserName = useAppStore((state) => state.setUserName);

  const [isOpen, { toggle }] = useToggle(false);
  const [isIncomeOpen, { toggle: toggleIncome }] = useToggle(false);
  const [isExpensesOpen, { toggle: toggleExpenses }] = useToggle(false);

  const isFocused = useIsFocused();

  const [initialValue, setInitialValue] = useState({ name: "" });
  const [stat, setStat] = useState({ monthlyIncome: "", monthlyExpenses: "" });
  const [transactionHistory, setTransactionHistory] = useState<
    Array<IExpenses & { type: "IN" | "OUT"; fmtAmt: string }>
  >([]);

  useRunAfterInteraction(() => {
    if (userName) {
      setInitialValue({ name: userName });
    }
  }, [userName, isFocused]);

  useRunAfterInteraction(() => {
    let currIncome = 0;
    let currExpenses = 0;

    let tempCurrencyCode = "";

    _.map(currencyList, (value, key) => {
      if (value.symbol === currencyCode) {
        tempCurrencyCode = value.code;
      }
    });

    if (!tempCurrencyCode) return;

    const tempTransaction: Array<
      IExpenses & { type: "IN" | "OUT"; fmtAmt: string }
    > = [];

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: tempCurrencyCode,
    });

    monthlyExpenses.map((item) => {
      tempTransaction.push({
        ...item,
        type: "OUT",
        fmtAmt: formatter.format(item.amt),
      });
    });

    monthlyIncome.map((item) => {
      tempTransaction.push({
        ...item,
        type: "IN",
        fmtAmt: formatter.format(item.amt),
      });
    });

    const allTransaction = tempTransaction.sort((a, b) => {
      return moment(b.date).unix() - moment(a.date).unix();
    });

    monthlyIncome.map((item) => {
      const itemDate = moment(item.date).startOf("D").add(12, "hour");
      const startDate = moment().startOf("month");
      const endDate = moment().endOf("month");

      const isBetween = itemDate.isBetween(startDate, endDate);

      if (isBetween) {
        currIncome = _.toNumber(currIncome) + _.toNumber(item.amt);
      }
    });

    monthlyExpenses.map((item) => {
      const itemDate = moment(item.date).startOf("D").add(12, "hour");
      const startDate = moment().startOf("month");
      const endDate = moment().endOf("month");

      const isBetween = itemDate.isBetween(startDate, endDate);

      if (isBetween) {
        currExpenses = _.toNumber(currExpenses) + _.toNumber(item.amt);
      }
    });

    setStat({
      monthlyIncome: formatter.format(currIncome),
      monthlyExpenses: formatter.format(currExpenses),
    });
    setTransactionHistory(allTransaction.slice(0, 30));
  }, [isFocused, monthlyIncome, monthlyExpenses, currencyCode]);

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

            <Heading fontSize="$7">{stat.monthlyIncome}</Heading>
          </View>

          <View bg="$color4" p="$4" borderRadius="$4" w="48%">
            <View flexDirection="row" alignItems="center" gap="$1" py="$1">
              <Paragraph fontSize="$4">Expense</Paragraph>
              <ArrowUpRight size={14} mb="$1" />
            </View>

            <Heading fontSize="$7">{stat.monthlyExpenses}</Heading>
          </View>
        </View>

        <Separator borderWidth="$0.5" my="$2.5" />

        <View>
          <View flexDirection="row" justifyContent="space-between">
            <Paragraph fontSize="$6" my="$2">
              Recent Transactions
            </Paragraph>

            <Button
              p="$0"
              px="$3"
              icon={<FontAwesome6 name="arrow-right" size={16} color="black" />}
            />
          </View>

          {transactionHistory.map((item) => {
            return (
              <View
                key={item._id}
                flexDirection="row"
                alignItems="center"
                gap="$3"
                my="$1.5"
                justifyContent="space-between"
              >
                <View flexDirection="row" alignItems="center" gap="$3">
                  <Button
                    p="$0"
                    px="$3"
                    icon={
                      item.type === "IN" ? (
                        <ArrowDownLeft size={20} mb="$1" />
                      ) : (
                        <ArrowUpRight size={20} mb="$1" />
                      )
                    }
                  />

                  <View>
                    <Paragraph fontSize="$5">
                      {
                        findCategory(item.categoryId, [
                          ...expensesCategory,
                          ...incomeCategory,
                        ])?.name
                      }
                    </Paragraph>
                    <Text fontSize="$1">
                      {moment(item.date).format("DD/MM/YYYY")}
                    </Text>
                  </View>
                </View>

                <Heading
                  fontSize="$5"
                  color={item.type === "IN" ? "$green11" : "$gray11"}
                >
                  {item.type === "IN" ? "+" : "-"} {item.fmtAmt}
                </Heading>
              </View>
            );
          })}
        </View>
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
                    placeholder="Enter your name"
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

      <FloatingButton
        toggleIncome={toggleIncome}
        toggleExpenses={toggleExpenses}
      />

      <CreateOrUpdateIncome isOpen={isIncomeOpen} toggle={toggleIncome} />
      <CreateOrUpdateExpenses isOpen={isExpensesOpen} toggle={toggleExpenses} />
    </>
  );
};

export default Home;
