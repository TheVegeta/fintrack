import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { ArrowDownLeft, ArrowUpRight } from "@tamagui/lucide-icons";
import { useToggle } from "ahooks";
import _ from "lodash";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { Heading, Paragraph, Separator, View } from "tamagui";
import { IRootParams } from "../Route";
import CreateOrUpdateExpenses from "../component/CreateOrUpdateExpenses";
import CreateOrUpdateIncome from "../component/CreateOrUpdateIncome";
import { currencyList } from "../data/currencyList";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
import { IExpenses, useAppStore } from "../store";
import { ITransactionHistory, RenderTransactionList } from "./Home";

const HistoryTransaction = () => {
  const { params } = useRoute<RouteProp<IRootParams>>();
  const isFocused = useIsFocused();

  const [isIncomeOpen, { toggle: toggleIncome }] = useToggle(false);
  const [isExpensesOpen, { toggle: toggleExpenses }] = useToggle(false);

  const currencyCode = useAppStore((state) => state.currencyCode);
  const monthlyIncome = useAppStore((state) => state.monthlyIncome);
  const monthlyExpenses = useAppStore((state) => state.monthlyExpenses);

  const [stat, setStat] = useState({ monthlyIncome: "", monthlyExpenses: "" });
  const [editId, setEditId] = useState("");

  const [transactionHistory, setTransactionHistory] = useState<
    ITransactionHistory[]
  >([]);

  const [title, setTitle] = useState("");

  useRunAfterInteraction(() => {
    if (params && "date" in params) {
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
        return moment(a.date).unix() - moment(b.date).unix();
      });

      monthlyIncome.map((item) => {
        const itemDate = moment(item.date).startOf("D").add(12, "hour");
        const startDate = moment(params.date).startOf("month");
        const endDate = moment(params.date).endOf("month");

        const isBetween = itemDate.isBetween(startDate, endDate);

        if (isBetween) {
          currIncome = _.toNumber(currIncome) + _.toNumber(item.amt);
        }
      });

      monthlyExpenses.map((item) => {
        const itemDate = moment(item.date).startOf("D").add(12, "hour");
        const startDate = moment(params.date).startOf("month");
        const endDate = moment(params.date).endOf("month");

        const isBetween = itemDate.isBetween(startDate, endDate);

        if (isBetween) {
          currExpenses = _.toNumber(currExpenses) + _.toNumber(item.amt);
        }
      });

      setStat({
        monthlyIncome: formatter.format(currIncome),
        monthlyExpenses: formatter.format(currExpenses),
      });

      setTransactionHistory(allTransaction);

      setTitle(
        `${moment(params.date).format("MMM")} ${moment(params.date).format(
          "Y"
        )}`
      );
    }
  }, [isFocused, monthlyIncome, monthlyExpenses, currencyCode, params]);

  const renderItem: ListRenderItem<ITransactionHistory> = useCallback(
    ({ item }) => (
      <RenderTransactionList
        item={item}
        toggleExpenses={toggleExpenses}
        toggleIncome={toggleIncome}
        setEditId={setEditId}
      />
    ),
    []
  );

  return (
    <>
      <View flex={1} bg="$color2" px="$6">
        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <View mt="$5">
            <Heading> {title} </Heading>
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

        <View flex={1}>
          <View flexDirection="row" justifyContent="space-between">
            <Paragraph fontSize="$6" my="$2">
              All Transactions
            </Paragraph>
          </View>

          {_.isArray(transactionHistory) && !_.isEmpty(transactionHistory) && (
            <FlashList
              data={transactionHistory}
              estimatedItemSize={transactionHistory.length}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>

      <CreateOrUpdateIncome
        isOpen={isIncomeOpen}
        toggle={toggleIncome}
        id={editId}
        setEditId={setEditId}
      />
      <CreateOrUpdateExpenses
        isOpen={isExpensesOpen}
        toggle={toggleExpenses}
        id={editId}
        setEditId={setEditId}
      />
    </>
  );
};

export default HistoryTransaction;
