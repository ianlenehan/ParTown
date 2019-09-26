import React, { useState } from 'react';
import { View, DatePickerIOS, Picker, Alert } from 'react-native';
import { firestore } from 'react-native-firebase';
import useAppContext from '../hooks/useAppContext';
import {
  H1,
  H3,
  HR,
  Button,
  Card,
  ScrollContainer,
  Spacer,
  Emoji,
  Colors
} from '../common';
import { TouchableOpacity } from 'react-native-gesture-handler';

const initialRoundState = {
  scores: {},
  date: new Date(),
  winner: {},
  loser: {}
};

function ScorePicker({ playerId, setRoundDetails, roundDetails, inactive }) {
  const scoreSelections = Array.from(Array(60).keys());
  return (
    <Picker
      selectedValue={roundDetails.scores[playerId] || (inactive ? 0 : 30)}
      style={{ height: 44, width: 50, backgroundColor: Colors.greySolitude }}
      itemStyle={{ height: 44, fontSize: 24 }}
      mode="dropdown"
      onValueChange={itemValue => {
        if (inactive) return null;
        setRoundDetails(roundDetails => ({
          ...roundDetails,
          scores: { ...roundDetails.scores, [playerId]: itemValue }
        }));
      }}>
      {scoreSelections.map(value => (
        <Picker.Item label={value} value={value} key={value} />
      ))}
    </Picker>
  );
}

function NewRoundScreen({ navigation }) {
  const { tournament, refetch, currentUser, setAppState } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [roundDetails, setRoundDetails] = useState(initialRoundState);
  const { players } = tournament;
  const playerIds = Object.keys(players);

  const setDate = date => {
    setRoundDetails(roundDetails => ({ ...roundDetails, date }));
  };

  const toggleParticipant = id => {
    let newParticipants = [...participants, id];
    let newScores = { ...roundDetails.scores, [id]: 30 };
    if (participants.includes(id)) {
      newParticipants = participants.filter(p => p !== id);
      newScores = { ...roundDetails.scores };
      delete newScores[id];
    }
    setRoundDetails(roundDetails => ({
      ...roundDetails,
      scores: newScores
    }));
    setParticipants(newParticipants);
  };

  const setAwardee = (player, win) => {
    const field = win ? 'winner' : 'loser';
    const awardee = player.id === roundDetails[field].id ? {} : player;
    setRoundDetails(roundDetails => ({
      ...roundDetails,
      [field]: awardee
    }));
  };

  const renderIcon = (player, win) => {
    if (!participants.includes(player.id)) return null;
    let symbol = '🏆';
    let idToCompare = roundDetails.winner.id;
    if (!win) {
      symbol = '😤';
      idToCompare = roundDetails.loser.id;
    }
    let style = styles.icon;
    if (player.id === idToCompare) {
      style = styles.selectedIcon;
    }
    return (
      <TouchableOpacity onPress={() => setAwardee(player, win)}>
        <Emoji symbol={symbol} size="small" style={style} />
      </TouchableOpacity>
    );
  };

  const getCurrentUser = async () => {
    const currentUserSnap = await firestore()
      .collection('users')
      .doc(currentUser.id)
      .get();

    setAppState('currentUser', {
      id: currentUserSnap.id,
      ...currentUserSnap.data()
    });
  };

  const clearState = () => {
    setRoundDetails(initialRoundState);
    setParticipants([]);
    setLoading(false);
  };

  const handleRoundSubmit = async () => {
    if (!roundDetails.winner.id && !roundDetails.loser.id) {
      return Alert.alert(
        'Wait',
        'Please select a winner and loser by tapping on the emojis next to the relevant players.'
      );
    }
    try {
      setLoading(true);
      const db = firestore();
      const round = await db
        .collection('rounds')
        .add({ ...roundDetails, tournamentId: tournament.id });

      let tournamentUpdate = { lastRoundDate: roundDetails.date };
      if (
        roundDetails.date > tournament.lastRoundDate ||
        !tournament.lastRoundDate
      ) {
        tournamentUpdate = {
          ...tournamentUpdate,
          currentChamp: roundDetails.winner.nickName,
          currentLoser: roundDetails.loser.nickName
        };
      }

      await db
        .collection('tournaments')
        .doc(tournament.id)
        .update(tournamentUpdate);

      const roundScores = participants.map(p => {
        return {
          playerId: p,
          roundId: round.id,
          tournamentId: tournament.id,
          score: roundDetails.scores[p],
          date: roundDetails.date,
          winner: p === roundDetails.winner.id,
          loser: p === roundDetails.loser.id
        };
      });

      roundScores.forEach(async rs => {
        await db.collection('round_scores').add(rs);
      });

      await refetch();
      await getCurrentUser();
      clearState();
      navigation.navigate('Stats');
    } catch (error) {
      console.error('Error adding you to the tournament', error);
    }
  };

  return (
    <ScrollContainer>
      <Card>
        <H1 style={{ textAlign: 'center' }}>Round Results</H1>
        <H3 style={{ textAlign: 'center' }}>{tournament.title}</H3>
        <HR />
        <Spacer size={2} />
        <DatePickerIOS
          style={styles.pickerStyle}
          date={roundDetails.date}
          onDateChange={setDate}
          mode={'date'}
        />
        <Spacer size={2} />
        {playerIds.map(id => (
          <View
            key={id}
            style={[
              styles.centeredRow,
              {
                justifyContent: 'space-between',
                padding: 5
              }
            ]}>
            <View style={styles.centeredRow}>
              <TouchableOpacity onPress={() => toggleParticipant(id)}>
                <Emoji
                  symbol={players[id].emoji}
                  size="small"
                  inactive={!participants.includes(id)}
                />
              </TouchableOpacity>
              <H3 style={{ marginLeft: 5 }}>
                {players[id].nickName.toUpperCase()}
              </H3>
            </View>
            <View style={styles.centeredRow}>
              {renderIcon(players[id], true)}
              {renderIcon(players[id], false)}
              <ScorePicker
                playerId={id}
                inactive={!participants.includes(id)}
                setRoundDetails={setRoundDetails}
                roundDetails={roundDetails}
              />
            </View>
          </View>
        ))}
        <Spacer size={2} />
        <Button
          loading={loading}
          onPress={handleRoundSubmit}
          disabled={Object.keys(roundDetails.scores).length < 1}>
          Submit
        </Button>
      </Card>
    </ScrollContainer>
  );
}

export default NewRoundScreen;

NewRoundScreen.navigationOptions = () => ({
  tabBarLabel: 'New Round',
  title: 'New Round'
});

const styles = {
  pickerStyle: {
    height: 80,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  centeredRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: { marginRight: 5, opacity: 0.2 },
  selectedIcon: { marginRight: 5, opacity: 1 }
};
