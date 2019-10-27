import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { golfGreen } from '../constants/Colours';
import DashboardScreen from '../Dashboard/DashboardScreen';
import NewTournamentScreen from '../Tournaments/NewTournamentScreen';
import TournamentDashboardScreen from '../Tournaments/TournamentDashboardScreen';
import FindTournamentScreen from '../Tournaments/FindTournamentScreen';
import AvailabilityScreen from '../Tournaments/AvailabilityScreen';
import NewRoundScreen from '../Tournaments/NewRoundScreen';
import RoundsScreen from '../Tournaments/RoundsScreen';
import DateFilterScreen from '../Tournaments/DateFilterScreen';
import PlayersScreen from '../Players/PlayersScreen';
import SettingsScreen from '../Settings/SettingsScreen';
import EmojiPickerScreen from '../EmojiPicker/EmojiPickerScreen';

const LogoTitle = () => {
  return (
    <Image
      source={require('../images/ParTownLogoWhite.png')}
      style={{ width: 80, height: 30 }}
    />
  );
};

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: golfGreen,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'
  },
  headerBackTitle: 'Dashboard',
  headerTitle: <LogoTitle />
};

const TournamentTabNavigator = createBottomTabNavigator(
  {
    Stats: TournamentDashboardScreen,
    NewRound: NewRoundScreen,
    Rounds: RoundsScreen,
    Availability: AvailabilityScreen,
    Players: PlayersScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Stats') {
          iconName = 'ios-stats';
        } else if (routeName === 'Players') {
          iconName = 'ios-contacts';
        } else if (routeName === 'NewRound') {
          iconName = 'ios-add-circle';
        } else if (routeName === 'Rounds') {
          iconName = 'ios-list-box';
        } else if (routeName === 'Availability') {
          iconName = 'ios-calendar';
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
      ...defaultNavigationOptions
    }),
    tabBarOptions: {
      activeTintColor: golfGreen,
      inactiveTintColor: 'gray'
    }
  }
);

const MainStackNavigator = createStackNavigator(
  {
    Dashboard: DashboardScreen,
    NewTournament: NewTournamentScreen,
    TournamentDash: TournamentTabNavigator,
    Settings: SettingsScreen
  },
  {
    defaultNavigationOptions
  },
  {
    initialRouteName: 'Dashboard'
  }
);

const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStackNavigator
    },
    EmojiPicker: EmojiPickerScreen,
    FindTournament: FindTournamentScreen,
    DateFilter: DateFilterScreen
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

export default RootStackNavigator;
