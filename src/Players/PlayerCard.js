import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { firestore } from 'react-native-firebase';
import { Colors, Card, Emoji, Body, Button, Loading } from '../common';

function PlayerCard({ player, tournament }) {
  const [showButtons, setShowButtons] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const addPenaltyRound = async () => {
    const db = firestore();
    setLoading(true);
    try {
      const details = {
        playerId: player.id,
        date: new Date(),
        tournamentId: tournament.id
      };
      await db.collection('penalties').add(details);
      setLoading(false);
      toggleButtons();
    } catch (error) {
      console.error(error, 'There was an error');
    }
  };

  const showAddPenaltyRoundAlert = () => {
    Alert.alert(
      `Penalize ${player.nickName}`,
      `Add one penalty round to ${player.fullName}? This can not be undone. A penalty round adds one lost round to the player's stats. It only affects total losses and loss average.`,
      [
        { text: 'Yes', onPress: addPenaltyRound },
        {
          text: 'No',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <Card>
      <TouchableWithoutFeedback onPress={toggleButtons}>
        <View>
          <View style={styles.container}>
            <View>
              <Text style={styles.cardTitle}>
                {player.nickName.toUpperCase()}
              </Text>
              <Body>{player.fullName}</Body>
            </View>
            <Emoji symbol={player.emoji} size="large" />
          </View>
          {showButtons && (
            <View>
              {loading ? (
                <Loading />
              ) : (
                <Button onPress={showAddPenaltyRoundAlert} warning>
                  Add Penalty Round
                </Button>
              )}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Card>
  );
}

export default PlayerCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 32,
    fontFamily: 'Dosis-Regular',
    fontWeight: '500',
    color: Colors.golfGreen,
    textAlign: 'left'
  }
});
