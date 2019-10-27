import React, { Component } from 'react';
import { StatusBar, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import { createAppContainer } from 'react-navigation';
import RootNavigator from './src/navigation/RootNavigator';
import LoginScreen from './src/auth/LoginScreen';
import AppContext from './src/utils/AppContext';
import { Loading } from './src/common';

const MainApp = createAppContainer(RootNavigator);

class App extends Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      loading: true,
      appState: {
        tournament: null,
        players: null,
        authUser: null,
        currentUser: null,
        emoji: null,
        roundScores: null,
        refetch: () => {},
        filterDates: {
          from: new Date(new Date().getFullYear(), 0, 1),
          to: new Date(new Date().getFullYear(), 11, 31)
        },
        setAppState: async (key, value) => {
          await this.setState({
            appState: {
              ...this.state.appState,
              [key]: value
            }
          });
        }
      }
    };
  }

  /**
   * Listen for any auth state changes and update component state
   */
  async componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(async authUser => {
      let appState = {
        ...this.state.appState,
        authUser: null,
        currentUser: null
      };
      if (authUser) {
        const currentUserSnap = await firebase
          .firestore()
          .collection('users')
          .doc(authUser._user.uid)
          .get();

        const currentUser = {
          id: currentUserSnap.id,
          ...currentUserSnap.data()
        };
        this.retrieveRegistrationToken(currentUser);
        appState = {
          ...this.state.appState,
          authUser,
          currentUser
        };
      }
      return this.setState({
        appState,
        loading: false
      });
    });

    await this.requestMessagingPermission();

    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh(fcmToken => {
        console.log('token?', fcmToken);
      });
    this.messageListener = firebase
      .notifications()
      .onNotification(async message => {
        Alert.alert(message.title, message.body);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        // const action = notificationOpen.action;
        const notification = notificationOpen.notification;
        if (notification.title === 'Can You Play?') {
          console.log('go to it');
        }
      });
  }

  componentWillUnmount() {
    if (this.unsubscriber) this.unsubscriber();
    this.onTokenRefreshListener();
    this.messageListener();
  }

  updateSettingsInTournament = async (currentUser, fcmToken) => {
    const db = firebase.firestore();

    const tpSnap = await db
      .collection('tournament_player')
      .where('userId', '==', currentUser.id)
      .get();

    for (let i = 0; i < tpSnap.docs.length; i++) {
      await db
        .collection('tournaments')
        .doc(tpSnap.docs[i].data().tournamentId)
        .update({ [`players.${currentUser.id}.fcmToken`]: fcmToken });
    }
  };

  async retrieveRegistrationToken(currentUser) {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      if (currentUser.fcmToken !== fcmToken) {
        firebase
          .firestore()
          .collection('users')
          .doc(currentUser.id)
          .update({ fcmToken });

        this.updateSettingsInTournament(currentUser, fcmToken);
      }
    }

    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      console.warn('no permission');
      this.requestMessagingPermission();
    }
  }

  async requestMessagingPermission() {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      console.warn('rejected');
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading size="large" />;
    }
    if (!this.state.appState.authUser) {
      return <LoginScreen />;
    }

    return (
      <AppContext.Provider value={this.state.appState}>
        <StatusBar barStyle="light-content" />
        <MainApp />
      </AppContext.Provider>
    );
  }
}

export default App;
