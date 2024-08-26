import { useIsFocused } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { ArrowRight } from "@tamagui/lucide-icons";
import _ from "lodash";
import moment from "moment";
import React, { FC, useCallback, useState } from "react";
import { Button, Heading, Paragraph, Separator, View } from "tamagui";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
import { useAppStore } from "../store";

const RenderMonthList: FC<{ month: string }> = ({ month }) => {
  return (
    <View
      key={month}
      flexDirection="row"
      alignItems="center"
      gap="$3"
      my="$1.5"
      justifyContent="space-between"
      flex={1}
    >
      <Paragraph fontSize="$5">
        {moment(month).format("MMM")} {moment(month).format("Y")}
      </Paragraph>
      <Button p="$0" px="$3" icon={<ArrowRight size={20} mb="$1" />} />
    </View>
  );
};

const History = () => {
  const monthlyExpenses = useAppStore((state) => state.monthlyExpenses);

  const [monthArr, setMonthArr] = useState<string[]>([]);

  const isFocused = useIsFocused();

  useRunAfterInteraction(() => {
    const monthArr: string[] = [];

    monthlyExpenses.map((item) => {
      const date = moment(item.date).startOf("M").toISOString();
      monthArr.push(date);
    });

    const uniqArr = _.uniq(monthArr).sort((a, b) =>
      moment(a).toISOString().localeCompare(moment(b).toISOString())
    );

    setMonthArr(uniqArr);
  }, [monthlyExpenses, isFocused]);

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item }) => <RenderMonthList month={item} />,
    []
  );

  return (
    <View flex={1} bg="$color2" px="$6">
      <View
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <View mt="$5">
          <Heading>Monthly Transaction</Heading>
        </View>
      </View>

      <Separator borderWidth="$0.5" my="$2.5" />

      <FlashList
        data={monthArr}
        estimatedItemSize={monthArr.length}
        renderItem={renderItem}
      />
    </View>
  );
};

export default History;
