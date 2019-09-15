import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { firestore } from 'react-native-firebase';
import moment from 'moment';
import {
  H1,
  H3,
  Body,
  Button,
  Card,
  ScrollContainer,
  Spacer,
  HR,
  Emoji,
  Loading
} from '../common';
import { golfGreen } from '../constants/Colours';
import useAppContext from '../hooks/useAppContext';
import {
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native-gesture-handler';

const DashboardScreen = ({ navigation }) => {
  const { navigate } = navigation;
  const { currentUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetchTournaments();
    navigation.setParams({ fetchTournaments });
  }, []);

  const fetchTournaments = async () => {
    const db = firestore();
    let tournamentsRef = db.collection('tournament_player');
    const query = tournamentsRef.where('userId', '==', currentUser.id);

    try {
      setLoading(true);
      let querySnap = await query.get();
      let fetchedTournaments = [];

      for (let i = 0; i < querySnap.docs.length; i++) {
        let tournament = await db
          .collection('tournaments')
          .doc(querySnap.docs[i].data().tournamentId)
          .get();
        fetchedTournaments.push({ ...tournament.data(), id: tournament.id });
      }
      setTournaments(fetchedTournaments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tournaments', error);
    }
  };

  const getPlayers = players => {
    return Object.keys(players)
      .map(playerId => {
        return players[playerId].nickName;
      })
      .join(', ');
  };
  return (
    <ScrollContainer>
      <View style={styles.headerClip} />
      <Card>
        <View style={styles.userCard}>
          <View>
            <H1 green>{currentUser.nickName.toUpperCase()}</H1>
            <Body>{currentUser.fullName}</Body>
          </View>
          <Emoji symbol={currentUser.emoji} size="large" />
        </View>
        <HR />
        <Spacer />
        <View>
          <View style={styles.stat}>
            <Body bold>Last Round Played</Body>
            <Body>
              {(currentUser.lastRoundDate &&
                moment(currentUser.lastRoundDate.toDate())
                  .local()
                  .from(moment())) ||
                'N/A'}
            </Body>
          </View>
          <View style={styles.stat}>
            <Body bold>Last Round Score</Body>
            <Body>{currentUser.lastRoundScore || 'N/A'}</Body>
          </View>
          <View style={styles.stat}>
            <Body bold>Highest Score</Body>
            <Body>{currentUser.highestScore || 'N/A'}</Body>
          </View>
          <View style={styles.stat}>
            <Body bold>Lowest Score</Body>
            <Body>{currentUser.lowestScore || 'N/A'}</Body>
          </View>
        </View>
      </Card>
      <Spacer size={2} />
      <Card flex={3}>
        <H3 regular style={{ marginBottom: 10 }}>
          TOURNAMENTS
        </H3>
        <ScrollView>
          {loading ? (
            <Loading size="large" />
          ) : (
            tournaments &&
            tournaments.length > 0 &&
            tournaments.map(tournament => {
              return (
                <TouchableOpacity
                  key={tournament.id}
                  style={styles.tournament}
                  onPress={() => navigate('TournamentDash', { tournament })}>
                  <H3 white underline>
                    {tournament.title.toUpperCase()}
                  </H3>
                  <Body white>{getPlayers(tournament.players)}</Body>
                  <Body white>
                    Last Competition:{' '}
                    {(tournament.lastRoundDate &&
                      moment(tournament.lastRoundDate.toDate())
                        .local()
                        .from(moment())) ||
                      'N/A'}
                  </Body>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
        <Button
          white
          onPress={() =>
            navigate('NewTournament', { refetch: fetchTournaments })
          }>
          NEW TOURNAMENT
        </Button>

        <Button
          white
          onPress={() =>
            navigate('FindTournament', { refetch: fetchTournaments })
          }>
          JOIN TOURNAMENT
        </Button>
      </Card>
    </ScrollContainer>
  );
};

const styles = StyleSheet.create({
  stats: {
    marginTop: 30
  },
  stat: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  headerClip: {
    backgroundColor: golfGreen,
    height: 125,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    margin: -10
  },
  userCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tournament: {
    width: '100%',
    backgroundColor: golfGreen,
    padding: 10,
    borderRadius: 5,
    marginBottom: 5
  }
});

export default DashboardScreen;

DashboardScreen.navigationOptions = ({ navigation }) => {
  return {
    headerRight: (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('Settings', {
            refetch: navigation.state.params.fetchTournaments
          })
        }>
        <Icon
          name="settings"
          color="white"
          containerStyle={{ marginRight: 25 }}
        />
      </TouchableWithoutFeedback>
    )
  };
};
