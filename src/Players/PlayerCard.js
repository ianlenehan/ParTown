import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Text,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import { Colors, Card, Emoji } from "../common";

function PlayerCard({ player }) {
  const onPress = () => {
    if (props.allData) {
      setShowingStats(!showingStats);
    }
  };

  return (
    <Card>
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.cardTitle}>
              {player.nickName.toUpperCase()}
            </Text>
            <Emoji symbol={player.emoji || "⛳️"} size="small" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Card>
  );
}

export default PlayerCard;

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
    textAlign: "left"
  },
  subTitle: {
    fontSize: 16,
    color: Colors.greySolitude
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
    fontSize: 14,
    color: "white",
    fontWeight: "bold"
  }
});
