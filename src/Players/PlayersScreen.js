import React from 'react';
import useAppContext from '../hooks/useAppContext';
import { View } from 'react-native';
import PlayerCard from './PlayerCard';

function PlayersScreen() {
  const { tournament } = useAppContext();
  const { players } = tournament;
  if (!players) return null;

  return (
    <View>
      {Object.keys(players).map(playerId => (
        <PlayerCard
          key={players[playerId].nickName}
          player={players[playerId]}
          tournament={tournament}
        />
      ))}
    </View>
  );
}

export default PlayersScreen;
