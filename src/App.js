import React from "react";

import { StackRouter, createNavigator } from "@react-navigation/core";
import { createBrowserApp } from "@react-navigation/web";
import { Spinner } from "./Components/Spinner";
import { Transitioner } from "./local-forks/react-navigation-transitioner";

import HomePage from "./Pages/Home";
import DetailPage from "./Pages/Detail";

const routeConfigs = {
  Home: {
    screen: HomePage,
    path: "",
  },
  Detail: {
    screen: DetailPage,
    path: ":movieId",
  },
};

const options = {
  initialRouteName: "Home",
};

const router = StackRouter(routeConfigs, routeConfigs);
const AppNavigator = createNavigator(Transitioner, router, options);
const App = createBrowserApp(AppNavigator);

export default () => (
  <React.Suspense maxDuration={800} fallback={<Spinner />}>
    <App />
  </React.Suspense>
);
