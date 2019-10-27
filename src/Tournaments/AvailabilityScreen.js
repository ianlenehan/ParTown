import React, { useState, useEffect } from 'react';
import {
  DatePickerIOS,
  ScrollView,
  View,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements';
import { firestore } from 'react-native-firebase';
import moment from 'moment';
import useAppContext from '../hooks/useAppContext';
import {
  H3,
  Colors,
  Body,
  Card,
  ScrollContainer,
  Button,
  Spacer
} from '../common';

const AvailabilityScreen = () => {
  const { tournament, currentUser } = useAppContext();
  const [date, setDate] = useState(new Date(Date.now() + 604800000));
  const [players, setPlayers] = useState();
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getScheduledRounds();
    getPlayers();
  }, []);

  const getPlayers = () => {
    const playerIds = Object.keys(tournament.players);
    const tournamentPlayers = playerIds
      .map(id => tournament.players[id])
      .sort((a, b) =>
        a.nickName > b.nickName ? -1 : a.nickName < b.nickName ? 1 : 0
      );
    setPlayers(tournamentPlayers);
  };

  const getScheduledRounds = async () => {
    try {
      setLoading(true);
      const db = firestore();
      const query = db
        .collection('scheduledRounds')
        .where('tournamentId', '==', tournament.id)
        .where('date', '>=', new Date());
      const res = await query.get();
      const tournamentRounds = res.docs
        .map(doc => {
          return { ...doc.data(), id: doc.id };
        })
        .sort((a, b) => a.date.toDate() - b.date.toDate());
      setRounds(tournamentRounds);
      setLoading(false);
    } catch (error) {
      console.warn('Error getting scheduled rounds', error);
    }
  };

  const toggleAvailability = async item => {
    let newAvailability = true;
    if (item.playing === false) newAvailability = null;
    if (item.playing === true) newAvailability = false;

    const round = rounds.find(r => r.id === item.id);
    const otherRounds = rounds.filter(r => r.id !== item.id);

    const otherPlayers = round.players.filter(
      rp => rp.player.id !== item.player.id
    );
    const newPlayers = [
      { playing: newAvailability, player: item.player },
      ...otherPlayers
    ];

    const newRound = { ...round, players: newPlayers };
    const newRounds = [...otherRounds, newRound].sort(
      (a, b) => a.date.toDate() - b.date.toDate()
    );
    setRounds(newRounds);

    try {
      setLoading(true);
      const db = firestore();
      await db
        .collection('scheduledRounds')
        .doc(item.id)
        .update({ players: newPlayers });

      getScheduledRounds();
    } catch (error) {
      console.error(error, 'There was an error updating your availability');
    }
  };

  const renderPlayersColumn = () => {
    return (
      <View>
        <View style={styles.dateCellView} />
        {players &&
          players.map(player => {
            return (
              <View key={player.id} style={styles.playersCellView}>
                <H3 style={{ textTransform: 'uppercase' }}>
                  {player.nickName}
                </H3>
              </View>
            );
          })}
      </View>
    );
  };

  const renderTableHead = () => {
    if (rounds.length > 0) {
      return rounds.map(rd => {
        return (
          <View style={styles.dateCellView} key={rd.id}>
            <Body bold>{moment(rd.date.toDate()).format('D MMM')}</Body>
            <Body bold>{moment(rd.date.toDate()).format('YYYY')}</Body>
          </View>
        );
      });
    }
  };
  const renderRow = playerData => {
    return playerData.map((item, i) => {
      const style = [styles.cellView];
      let icon = 'question';
      if (item && item.playing) {
        style.push(styles.playingCellView);
        icon = 'check';
      }
      if (item && item.playing === false) {
        style.push(styles.notPlayingCellView);
        icon = 'times';
      }
      return (
        <TouchableOpacity
          style={style}
          key={i}
          onPress={() => toggleAvailability(item)}>
          <Icon name={icon} type="font-awesome" color="white" />
        </TouchableOpacity>
      );
    });
  };

  const renderAvailability = () => {
    if (players && rounds.length > 0) {
      const data = players.map(player => {
        return rounds.map(round => {
          const res = round.players.find(rp => {
            return rp.player.id === player.id;
          });
          return { date: round.date, id: round.id, ...res };
        });
      });

      return data.map((playerData, i) => {
        return (
          <View style={styles.tableView} key={i}>
            {renderRow(playerData)}
          </View>
        );
      });
    }
  };

  const scheduleAndNotify = async () => {
    const roundPlayers = players.map(player => {
      return { player, playing: null };
    });

    try {
      setLoading(true);
      const db = firestore();
      const newRound = {
        date,
        tournamentId: tournament.id,
        players: roundPlayers,
        createdBy: currentUser.fullName
      };
      await db.collection('scheduledRounds').add(newRound);
      await getScheduledRounds();
    } catch (error) {
      console.error(error, 'There was an error schedling a new round');
    }
  };

  return (
    <ScrollContainer style={{ backgroundColor: '#fff' }}>
      {!loading && rounds && rounds.length < 1 ? (
        <Body style={{ textAlign: 'center', marginTop: 30 }}>
          There are no scheduled rounds.
        </Body>
      ) : (
        <View style={styles.tableView}>
          {renderPlayersColumn()}
          <ScrollView
            horizontal
            contentContainerStyle={{ flexDirection: 'column' }}>
            <View style={styles.tableView}>{renderTableHead()}</View>
            <View style={styles.tableColumn}>{renderAvailability()}</View>
          </ScrollView>
        </View>
      )}
      <Spacer size={4} />
      <Card>
        <H3 style={{ textAlign: 'center' }}>Schedule Future Round</H3>
        <Spacer size={2} />
        <DatePickerIOS
          style={styles.pickerStyle}
          date={date}
          onDateChange={value => setDate(value)}
          minimumDate={new Date()}
          mode="date"
        />
        <Spacer size={2} />
        <Button loading={loading} onPress={scheduleAndNotify}>
          {'Save & Notify'}
        </Button>
      </Card>
    </ScrollContainer>
  );
};

export default AvailabilityScreen;

const styles = {
  pickerStyle: {
    height: 80,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  tableView: {
    flexDirection: 'row'
  },
  cellView: {
    padding: 15,
    margin: 3,
    width: 80,
    height: 80,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playersCellView: {
    padding: 15,
    margin: 3,
    height: 80,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  dateCellView: {
    height: 60,
    width: 80,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playingCellView: {
    backgroundColor: Colors.golfGreen
  },
  notPlayingCellView: {
    backgroundColor: Colors.redBurgundy
  },
  tableColumn: {
    flexDirection: 'column'
  }
};
