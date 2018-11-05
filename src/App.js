import React from "react";
// import { Router, Redirect } from "@reach/router";
import { createSwitchNavigator } from "@react-navigation/core";
import { createBrowserApp } from "@react-navigation/web";

import { Spinner } from "./Components/Spinner";

const AppNavigator = createSwitchNavigator(
  {
    Home: {
      screen: React.lazy(() => import("./Pages/Home")),
      path: "",
      navigationOptions: ({ navigation }) => ({
        title: "Movies",
      }),
    },
    Detail: {
      screen: React.lazy(() => import("./Pages/Detail")),
      path: ":movieId",
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam("movieTitle", "Movie"),
      }),
    },
  },
  {
    initialRouteName: "Home",
    backBehavior: "initialRoute",
  }
);

const App = createBrowserApp(AppNavigator);

export default () => (
  <React.Suspense maxDuration={400} fallback={<Spinner />}>
    <App />
  </React.Suspense>
);
