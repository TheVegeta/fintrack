import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "FinTrack",
  slug: "FinTrack",
  version: "0.0.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  jsEngine: "hermes",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#fff7fc",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#fff7fc",
    },
    package: "in.tripmine.fintrack",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: ["expo-font"],
});
