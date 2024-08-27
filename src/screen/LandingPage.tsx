import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Check as CheckIcon } from "@tamagui/lucide-icons";
import { useToggle } from "ahooks";
import _ from "lodash";
import React, { FC, memo, useCallback, useState } from "react";
import { InteractionManager } from "react-native";
import {
  Button,
  Checkbox,
  H4,
  Heading,
  Image,
  Input,
  Paragraph,
  Sheet,
  Text,
  View,
} from "tamagui";
import { currencyList } from "../data/currencyList";
import { useRunAfterInteraction } from "../hooks/useRunAfterInteraction";
import { IRootParams } from "../Route";
import { useAppStore } from "../store";

export interface ICurrecy {
  name: string;
  symbol: string;
  code: string;
}

export const RenderCurrencyList: FC<{
  item: ICurrecy;
  selectedCurrency: string;
  selectCurrency: (code: string) => void;
}> = memo(({ item, selectCurrency, selectedCurrency }) => {
  const handlePress = () => {
    selectCurrency(item.symbol);
  };

  return (
    <View onPress={handlePress} flex={1} flexDirection="row" gap="$3" my="$1.5">
      <Checkbox
        checked={selectedCurrency === item.symbol}
        onCheckedChange={handlePress}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>

      <Text>
        {item.symbol} - {item.name}
      </Text>
    </View>
  );
}, _.isEqual);

const LandingPage = () => {
  const [isOpen, { toggle }] = useToggle(false);
  const [currency, setCurrency] = useState<ICurrecy[]>([]);
  const [input, setInput] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("$");
  const setCurrencyCode = useAppStore((state) => state.setCurrencyCode);
  const { navigate } = useNavigation<NavigationProp<IRootParams>>();

  useRunAfterInteraction(() => {
    const data: ICurrecy[] = [];

    _.map(currencyList, (item) => {
      data.push({ name: item.name, symbol: item.symbol, code: item.code });
    });

    setCurrency(
      data.filter((item) =>
        _.toLower(JSON.stringify(item)).includes(_.toLower(_.trim(input)))
      )
    );
  }, [currencyList, input]);

  const selectCurrency = (code: string) => {
    setSelectedCurrency(code);
  };

  const handleSubmit = () => {
    InteractionManager.runAfterInteractions(() => {
      if (_.trim(selectedCurrency) !== "") {
        setCurrencyCode(selectedCurrency);
        navigate("bottomTab");
      }
    });
  };

  const renderItem: ListRenderItem<ICurrecy> = useCallback(
    ({ item }) => (
      <RenderCurrencyList
        item={item}
        selectCurrency={selectCurrency}
        selectedCurrency={selectedCurrency}
      />
    ),
    [selectedCurrency]
  );

  return (
    <>
      <View flex={1} justifyContent="center" alignItems="center" bg="$color2">
        <Image
          source={require("../assets/Piggy bank-bro.png")}
          height={350}
          width={350}
        />

        <View>
          <Heading>Effortlessly manage your expenses with Fintrack</Heading>
          <Paragraph>
            Track your spending, set budgets, and reach your financial goals
            with ease
          </Paragraph>
          <Button mt="$3" onPress={toggle}>
            Get Started
          </Button>
        </View>
      </View>

      <Sheet
        animation="medium"
        open={isOpen}
        snapPoints={[55]}
        onOpenChange={toggle}
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame
          px="$6"
          py="$4"
          justifyContent="center"
          alignItems="center"
        >
          <H4 textAlign="center">Select currency</H4>
          <Input
            my="$4"
            mx="$6"
            w="100%"
            placeholder="Search currency..."
            onChangeText={setInput}
          />

          <View flex={1} w="100%">
            {Array.isArray(currency) && currency.length !== 0 && (
              <FlashList
                data={currency}
                extraData={selectedCurrency}
                estimatedItemSize={currency.length}
                renderItem={renderItem}
              />
            )}
          </View>

          <Button w="100%" onPress={handleSubmit}>
            Done
          </Button>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default LandingPage;
