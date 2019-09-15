import React from "react";
import { Platform } from "react-native";
import { golfGreen } from "../constants/Colours";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import Colours from "../constants/Colours";
import { Icon } from "react-native-elements";

import DashboardScreen from "../Dashboard/DashboardScreen";
import ResultsScreen from "../Results/ResultsScreen";

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: golfGreen
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold"
  },
  title: "Par Town"
};

const TournamentsStack = createStackNavigator(
  { DashboardScreen },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarLabel: "Tournaments",
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="golf" />;
      }
    }
  }
);

const ResultsStack = createStackNavigator(
  { ResultsScreen },
  {
    defaultNavigationOptions,
    navigationOptions: {
      tabBarLabel: "Results"
    }
  }
);

export default createBottomTabNavigator({ TournamentsStack, ResultsStack });
