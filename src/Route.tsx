import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { FC } from "react";
import { Separator, Tabs } from "tamagui";
import Home from "./screen/Home";
import LandingPage from "./screen/LandingPage";
import { useAppStore } from "./store";

export type IRootParams = {
  landing: undefined;
  bottomTab: undefined;
};

export type IBottomTabParams = {
  home: undefined;
};

const Stack = createNativeStackNavigator<IRootParams>();
const Tab = createBottomTabNavigator<IBottomTabParams>();

const BottomTabBar: FC<BottomTabBarProps> = ({ navigation, state }) => {
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
    </Stack.Navigator>
  );
};

export default Route;
