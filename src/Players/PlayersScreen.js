import React from 'react';
import useAppContext from '../hooks/useAppContext';
import { ScrollView } from 'react-native';
import PlayerCard from './PlayerCard';

function PlayersScreen() {
  const { tournament } = useAppContext();
  const { players } = tournament;
  if (!players) return null;

  return (
    <ScrollView>
      {Object.keys(players).map(playerId => (
        <PlayerCard
          key={players[playerId].nickName}
          player={players[playerId]}
          tournament={tournament}
        />
      ))}
    </ScrollView>
  );
}

export default PlayersScreen;
