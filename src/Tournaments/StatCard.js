import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import numeral from "numeral";
import { Colors, Card, Emoji, Body } from "../common";
import { greySolitude } from "../constants/Colours";

function StatCard({ title, player, stats, totals, players, number }) {
  const [showingStats, setShowingStats] = useState(false);
  if (!player && !stats) {
    return null;
  }

  let displayName = player && player.nickName;

  if (stats) {
    const displayNames = stats.map(s => {
      const p = players[s.playerId];
      return p.nickName;
    });
    displayName = displayNames.join(", ");
  }

  const renderEmojis = () => {
    if (player) {
      return <Emoji symbol={player.emoji} size="large" />;
    } else if (stats) {
      const size = stats.length === 1 ? "large" : "medium";
      return stats.map(s => {
        const p = players[s.playerId];
        return <Emoji key={s.playerId} symbol={p.emoji} size={size} />;
      });
    }
    return null;
  };

  renderStat = (num, isSubStat = false) => {
    if (player) return null;
    const number = num || 0;
    const showAsPercent = title.toLowerCase().includes("averages");
    const n = showAsPercent ? numeral(number).format("%0") : number;
    const viewStyle = isSubStat ? styles.greyCircle : styles.circle;
    const textStyle = [styles.subtitle];
    if (isSubStat) textStyle.push({ color: Colors.greenMineral });
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{n}</Text>
      </View>
    );
  };

  renderStatsList = () => {
    return (
      <View
        style={{
          marginTop: 20,
          width: "80%",
          borderTopColor: Colors.greySolitude,
          borderTopWidth: 1
        }}
      >
        {totals.map(stat => {
          return (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
                marginLeft: "15%",
                marginRight: "15%"
              }}
              key={stat.playerId}
            >
              <Body>{players[stat.playerId].nickName}</Body>
              {renderStat(stat.num, true)}
            </View>
          );
        })}
      </View>
    );
  };

  const onPress = () => {
    if (totals) {
      setShowingStats(!showingStats);
    }
  };

  return (
    <Card>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.cardTitle}>{title.toUpperCase()}</Text>
          <View style={styles.playerView}>
            <View style={{ flexDirection: "row" }}>{renderEmojis()}</View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Body>{displayName}</Body>
              {renderStat(number)}
            </View>
          </View>
          {showingStats && renderStatsList()}
        </View>
      </TouchableWithoutFeedback>
    </Card>
  );
}

export default StatCard;

const styles = StyleSheet.create({
  container: {
    shadowColor: "black",
    shadowOffset: { height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 32,
    fontFamily: "Dosis-Regular",
    fontWeight: "500",
    color: Colors.golfGreen,
    textAlign: "center"
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginTop: 3
  },
  nickName: {
    fontSize: 24,
    fontFamily: "gamja-flower"
  },
  subtitle: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    backgroundColor: Colors.golfGreen,
    alignItems: "center",
    justifyContent: "center"
  },
  greyCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.greySolitude
  },
  playerView: {
    display: "flex",
    alignItems: "center"
  }
});
