import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { InteractionManager } from "react-native";
import { Separator, Tabs } from "tamagui";
import Category from "./screen/Category";
import Chart from "./screen/Chart";
import History from "./screen/History";
import HistoryTransaction from "./screen/HistoryTransaction";
import Home from "./screen/Home";
import LandingPage from "./screen/LandingPage";
import { useAppStore } from "./store";

export type IRootParams = {
  landing: undefined;
  bottomTab: undefined;
  historyTransaction: { date: string };
};

export type IBottomTabParams = {
  home: undefined;
  chart: undefined;
  history: undefined;

  category: undefined;
};

const Stack = createNativeStackNavigator<IRootParams>();
const Tab = createBottomTabNavigator<IBottomTabParams>();

const BottomTabBar: FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { navigate } = useNavigation<NavigationProp<IBottomTabParams>>();

  const handleHomeNavigation = () => {
    InteractionManager.runAfterInteractions(() => {
      navigate("home");
    });
  };

  const handleCategoryNavigation = () => {
    InteractionManager.runAfterInteractions(() => {
      navigate("category");
    });
  };

  const handleHistoryNavigation = () => {
    InteractionManager.runAfterInteractions(() => {
      navigate("history");
    });
  };

  const handleChartNavigation = () => {
    InteractionManager.runAfterInteractions(() => {
      navigate("chart");
    });
  };

  return (
    <>
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
      >
        <Tabs.List
          separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab
            flex={1}
            value="tab1"
            justifyContent="center"
            alignItems="center"
            gap="$1.5"
            h={50}
            onPress={handleHomeNavigation}
          >
            <FontAwesome6 name="house" size={15} color="black" />
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            value="tab2"
            justifyContent="center"
            alignItems="center"
            gap="$1.5"
            h={50}
            onPress={handleCategoryNavigation}
          >
            <FontAwesome6 name="tags" size={15} color="black" />
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            value="tab3"
            justifyContent="center"
            alignItems="center"
            gap="$1.5"
            h={50}
            onPress={handleHistoryNavigation}
          >
            <FontAwesome6 name="clock-rotate-left" size={15} color="black" />
          </Tabs.Tab>
          <Tabs.Tab
            flex={1}
            value="tab4"
            justifyContent="center"
            alignItems="center"
            gap="$1.5"
            h={50}
            onPress={handleChartNavigation}
          >
            <FontAwesome6 name="chart-pie" size={15} color="black" />
          </Tabs.Tab>
        </Tabs.List>
        <Separator />
      </Tabs>
    </>
  );
};

export const MyBottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false, lazy: true }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="home" component={Home} />
      <Tab.Screen name="chart" component={Chart} />
      <Tab.Screen name="history" component={History} />
      <Tab.Screen name="category" component={Category} />
    </Tab.Navigator>
  );
};

const Route = () => {
  const currencyCode = useAppStore((state) => state.currencyCode);

  return (
    <Stack.Navigator
      initialRouteName={currencyCode ? "bottomTab" : "landing"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="landing" component={LandingPage} />
      <Stack.Screen name="bottomTab" component={MyBottomTabs} />
      <Stack.Screen name="historyTransaction" component={HistoryTransaction} />
    </Stack.Navigator>
  );
};

export default Route;
