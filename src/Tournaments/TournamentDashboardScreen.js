import React, { useState, useEffect } from 'react';
import { View, Clipboard, Alert, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import numeral from 'numeral';
import { firestore } from 'react-native-firebase';
import useAppContext from '../hooks/useAppContext';
import { Body, Button, ScrollContainer, Spacer, Loading } from '../common';
import StatCard from './StatCard';
import { golfGreen } from '../constants/Colours';

function TournamentDashboardScreen({ navigation }) {
  const { tournament } = navigation.state.params;
  const { setAppState, filterDates } = useAppContext();
  useEffect(() => {
    setAppStates();
    getStats();
  }, [navigation.state.params.tournament.id]);

  useEffect(() => {
    getStats();
  }, [filterDates.to, filterDates.from]);

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const { players, currentChampId, currentLoserId } = tournament;
  const playerIds = Object.keys(players);

  const setAppStates = async () => {
    await setAppState('tournament', navigation.state.params.tournament);
    setAppState('refetch', getStats);
  };

  const getStats = async () => {
    setLoading(true);
    const db = firestore();
    const query = db
      .collection('round_scores')
      .where('tournamentId', '==', tournament.id)
      .where('date', '>=', new Date(filterDates.from))
      .where('date', '<=', new Date(filterDates.to));

    const res = await query.get();
    const roundScores = res.docs.map(doc => doc.data());
    setAppState('roundScores', roundScores);

    if (!roundScores || roundScores.length < 1) {
      setLoading(false);
      return null;
    }

    const roundsPlayed = playerIds
      .map(playerId => {
        const num = roundScores.filter(s => s.playerId === playerId).length;
        return { playerId, num };
      })
      .sort((a, b) => (a.num > b.num ? -1 : a.num < b.num ? 1 : 0));

    const roundsWon = playerIds
      .map(playerId => {
        const num = roundScores.filter(s => s.playerId === playerId && s.winner)
          .length;
        return { playerId, num };
      })
      .sort((a, b) => (a.num > b.num ? -1 : a.num < b.num ? 1 : 0));

    const roundsLost = playerIds
      .map(playerId => {
        const num = roundScores.filter(s => s.playerId === playerId && s.loser)
          .length;
        return { playerId, num };
      })
      .sort((a, b) => (a.num > b.num ? -1 : a.num < b.num ? 1 : 0));

    const mostWins = getMostWins(roundsWon);
    const mostLosses = getMostLosses(roundsLost);
    const averages = getAverages(roundsPlayed, roundsWon, roundsLost);
    const winAverages = getWinAverages(averages);
    const lossAverages = getLossAverages(averages);
    const highestWinAvg = getHighestWinAvg(winAverages);
    const highestLossAvg = getHighestLossAvg(lossAverages);
    setLoading(false);

    return setStats({
      mostWins,
      roundsWon,
      mostLosses,
      roundsLost,
      winAverages,
      lossAverages,
      highestWinAvg,
      highestLossAvg
    });
  };

  const getAverages = (roundsPlayed, roundsWon, roundsLost) => {
    return playerIds.map(id => {
      const playedCount = roundsPlayed.find(r => r.playerId === id).num;
      const wonCount = roundsWon.find(r => r.playerId === id).num;
      const lostCount = roundsLost.find(r => r.playerId === id).num;
      const winAvg = wonCount / playedCount;
      const lossAvg = lostCount / playedCount;

      return { playerId: id, winAvg, lossAvg };
    });
  };

  const getWinAverages = averages => {
    return averages
      .map(a => {
        return { playerId: a.playerId, num: a.winAvg };
      })
      .sort((a, b) => (a.num > b.num ? -1 : a.num < b.num ? 1 : 0));
  };

  const getLossAverages = averages => {
    return averages
      .map(a => {
        return { playerId: a.playerId, num: a.lossAvg };
      })
      .sort((a, b) => (a.num > b.num ? -1 : a.num < b.num ? 1 : 0));
  };

  const getMostWins = roundsWon => {
    const mostWinTotal = roundsWon[0].num;
    return roundsWon.filter(r => r.num === mostWinTotal);
  };

  const getMostLosses = roundsLost => {
    const mostLossTotal = roundsLost[0].num;
    return roundsLost.filter(r => r.num === mostLossTotal);
  };

  const getHighestWinAvg = winAverages => {
    const highestWinAvg = winAverages[0].num;
    return winAverages.filter(r => r.num === highestWinAvg);
  };

  const getHighestLossAvg = lossAverages => {
    const highestLossAvg = lossAverages[0].num;
    return lossAverages.filter(r => r.num === highestLossAvg);
  };

  const copyInviteToken = () => {
    Clipboard.setString(tournament.id);
    return Alert.alert(
      'Invite Token',
      `An invite token (${tournament.id}) has been copied to your clipboard! Paste this into a message or email to your friends and they can use it to join your new tournament.`,
      [{ text: 'OK' }]
    );
  };

  if (loading) return <Loading size="large" />;

  return (
    <ScrollContainer>
      <View
        style={{
          backgroundColor: golfGreen,
          height: 125,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
          margin: -10
        }}
      />
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('DateFilter')}>
        <View
          style={{
            zIndex: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 10
          }}>
          <Icon
            name="date-range"
            color="white"
            containerStyle={{ marginRight: 25 }}
          />
          <Body white>
            {moment(filterDates.from).format('MMM Do YYYY')} to{' '}
            {moment(filterDates.to).format('MMM Do YYYY')}
          </Body>
        </View>
      </TouchableWithoutFeedback>
      {!stats.mostWins ? (
        <View>
          <Spacer size={12} />
          <Body style={{ textAlign: 'center' }}>
            Looks like you haven't played any rounds yet!
          </Body>
        </View>
      ) : (
        <React.Fragment>
          <StatCard title="Current Champion" player={players[currentChampId]} />
          <StatCard title="Weekly Worst" player={players[currentLoserId]} />
          <StatCard
            title="Most Wins"
            stats={stats.mostWins}
            totals={stats.roundsWon}
            number={stats.mostWins && stats.mostWins[0].num}
            players={players}
          />
          <StatCard
            title="Win Averages"
            stats={stats.highestWinAvg}
            totals={stats.winAverages}
            number={
              stats.highestWinAvg &&
              numeral(stats.highestWinAvg[0].num).format('0%')
            }
            players={players}
          />
          <StatCard
            title="Most Losses"
            stats={stats.mostLosses}
            totals={stats.roundsLost}
            number={stats.mostLosses && stats.mostLosses[0].num}
            players={players}
          />
          <StatCard
            title="Loss Averages"
            stats={stats.highestLossAvg}
            totals={stats.lossAverages}
            number={stats.highestLossAvg && stats.highestLossAvg[0].num}
            players={players}
          />
        </React.Fragment>
      )}
      <Spacer size={2} />
      <Button onPress={copyInviteToken}>Copy Invite Token</Button>
      <Spacer size={2} />
    </ScrollContainer>
  );
}

export default TournamentDashboardScreen;
