import { RouteProp, useRoute } from "@react-navigation/native";
import moment from "moment";
import React, { useState } from "react";
import { Heading, Separator, View } from "tamagui";
import { IRootParams } from "../Route";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";

const HistoryTransaction = () => {
  const { params } = useRoute<RouteProp<IRootParams>>();

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
    </View>
  );
};

export default HistoryTransaction;
