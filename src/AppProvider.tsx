import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { NavigationContainer } from "@react-navigation/native";
import { TamaguiProvider, Theme, View } from "@tamagui/core";
import { useFonts } from "expo-font";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { FC, ReactNode } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { PortalProvider } from "tamagui";
import tamaguiConfig from "../tamagui.config";
import { useAppStore } from "./store";

const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = useAppStore((state) => state.theme);

  const [loaded] = useFonts({
    Inter: Poppins_400Regular,
    InterBold: Poppins_700Bold,
  });

  if (!loaded) return null;

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
      <PortalProvider>
        <Theme name={theme}>
          <View flex={1} paddingTop={StatusBar.currentHeight}>
            <NavigationContainer>{children}</NavigationContainer>
          </View>
        </Theme>
      </PortalProvider>

      <ExpoStatusBar
        // @ts-ignore
        backgroundColor={tamaguiConfig.themes[theme].color2.val}
      />
    </TamaguiProvider>
  );
};

export default AppProvider;
