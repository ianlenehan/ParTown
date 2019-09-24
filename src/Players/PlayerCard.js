import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { Colors, Card, Emoji, Body } from '../common';

function PlayerCard({ player }) {
  return (
    <Card>
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <View>
            <Text style={styles.cardTitle}>
              {player.nickName.toUpperCase()}
            </Text>
            <Body>{player.fullName}</Body>
          </View>
          <Emoji symbol={player.emoji} size="large" />
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
