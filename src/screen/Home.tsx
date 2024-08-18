import { ArrowDownLeft, ArrowUpRight, Eye } from "@tamagui/lucide-icons";
import _ from "lodash";
import React from "react";
import { Button, Heading, Paragraph, Separator, View } from "tamagui";
import { useAppStore } from "../store";

const Home = () => {
  const userName = useAppStore((state) => state.userName);
  const currencyCode = useAppStore((state) => state.currencyCode);

  return (
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
          <Button icon={Eye} scaleIcon={1.5} />
        </View>
      </View>

      <Separator borderWidth="$0.5" my="$2" />

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

      <Separator borderWidth="$0.5" my="$2" />
    </View>
  );
};

export default Home;
