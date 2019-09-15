import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import moment from "moment";
import { firestore } from "react-native-firebase";
import useAppContext from "../hooks/useAppContext";
import { Body, Colors } from "../common";

const RoundsScreen = () => {
  const { tournament, roundScores, filterDates } = useAppContext();
  const [rounds, setRounds] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [players, setPlayers] = useState();
  useEffect(() => {
    getRounds();
    getPlayers();
  }, []);

  const getPlayers = () => {
    const playerIds = Object.keys(tournament.players);
    const players = playerIds
      .map(id => tournament.players[id])
      .sort((a, b) =>
        a.nickName > b.nickName ? -1 : a.nickName < b.nickName ? 1 : 0
      );
    setPlayers(players);
  };

  const getRounds = async () => {
    const db = firestore();
    const query = db
      .collection("rounds")
      .where([
        ["tournamentId", "==", tournament.id],
        ["date", ">=", filterDates.from],
        ["date", "<=", filterDates.to]
      ]);
    const res = await query.get();
    const rounds = res.docs
      .map(doc => {
        return { ...doc.data(), id: doc.id };
      })
      .sort(function(a, b) {
        a = a.date.toDate();
        b = b.date.toDate();
        return a > b ? -1 : a < b ? 1 : 0;
      });

    setRounds(rounds);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getRounds();
    setRefreshing(false);
  };

  const renderPlayersColumn = () => {
    return (
      <View>
        <View style={styles.dateCellView}>
          <Text></Text>
        </View>
        {players &&
          players.map(player => {
            return (
              <View key={player.id} style={styles.playersCellView}>
                <Body bold style={{ textTransform: "uppercase" }}>
                  {player.nickName}
                </Body>
              </View>
            );
          })}
      </View>
    );
  };

  const renderTableHead = () => {
    if (rounds) {
      return rounds.map(rd => {
        return (
          <View style={styles.dateCellView} key={rd.id}>
            <Body bold>{moment(rd.date.toDate()).format("D MMM")}</Body>
            <Body bold>{moment(rd.date.toDate()).format("YYYY")}</Body>
          </View>
        );
      });
    }
  };

  const renderRow = playerData => {
    return playerData.map((item, i) => {
      const style = [styles.cellView];
      if (item && item.winner) style.push(styles.winnerCellView);
      if (item && item.loser) style.push(styles.loserCellView);
      const isWhite = item && item.loser;
      const isBold = item && (item.winner || item.loser);
      return (
        <View style={style} key={item ? item.date : i}>
          <Body white={isWhite} bold={isBold}>
            {item ? item.score : "-"}
          </Body>
        </View>
      );
    });
  };

  const renderData = () => {
    if (players && rounds && roundScores) {
      const data = players.map(player => {
        return rounds.map(round => {
          return roundScores.find(rs => {
            return rs.roundId === round.id && rs.playerId === player.id;
          });
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

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.playersColumn}
      contentContainerStyle={{ flex: 1 }}
    >
      <View style={styles.tableView}>
        {renderPlayersColumn()}
        <ScrollView
          horizontal
          contentContainerStyle={{ flexDirection: "column" }}
        >
          <View style={styles.tableView}>{renderTableHead()}</View>
          <View style={styles.tableColumn}>{renderData()}</View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default RoundsScreen;

const styles = {
  tableView: {
    flexDirection: "row"
  },
  cellView: {
    padding: 15,
    marginBottom: 3,
    width: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  playersCellView: {
    padding: 15,
    marginBottom: 3,
    backgroundColor: "#fff"
  },
  dateCellView: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  winnerCellView: {
    backgroundColor: Colors.championGold
  },
  loserCellView: {
    backgroundColor: Colors.redBurgundy
  },
  tableColumn: {
    flexDirection: "column"
  }
};
