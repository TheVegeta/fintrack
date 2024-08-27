import { RouteProp, useRoute } from "@react-navigation/native";
import { ArrowDownLeft, ArrowUpRight } from "@tamagui/lucide-icons";
import moment from "moment";
import React, { useState } from "react";
import { Heading, Paragraph, Separator, View } from "tamagui";
import { IRootParams } from "../Route";
import { currencyList } from "../data/currencyList";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
import { ITransactionHistory } from "./Home";

const HistoryTransaction = () => {
  const { params } = useRoute<RouteProp<IRootParams>>();
  const [stat, setStat] = useState({ monthlyIncome: "", monthlyExpenses: "" });

  const [transactionHistory, setTransactionHistory] = useState<
    ITransactionHistory[]
  >([]);

  const [title, setTitle] = useState("");

  useRunAfterInteraction(() => {
    if (params && "date" in params) {
      setTitle(
        `${moment(params.date).format("MMM")} ${moment(params.date).format(
          "Y"
        )}`
      );
    }
  }, [params]);

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

  return (
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
    </View>
  );
};

export default HistoryTransaction;
