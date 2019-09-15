import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Clipboard, Alert } from "react-native";
import { firestore } from "react-native-firebase";
import { Button, Container, Card, H1, Input, Spacer } from "../common";
import { greenMineral, greySolitude } from "../constants/Colours";
import AppContext from "../utils/AppContext";

function NewTournamentScreen({ navigation }) {
  const [details, setDetails] = useState({
    title: "",
    winningReward: "Trophy",
    losingReward: "Red Flag"
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AppContext);

  const handleChange = (label, text) => {
    setDetails(details => ({ ...details, [label]: text }));
  };

  const showClipboardAlert = id => {
    return Alert.alert(
      "Invite Token",
      `An invite token (${id}) has been copied to your clipboard! Paste this into a message or email to your friends and they can use it to join your new tournament.`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  const handleSaveTournament = async () => {
    try {
      setLoading(true);
      const db = firestore();
      const tournamentDetails = {
        ...details,
        admin: currentUser.fullName,
        players: { [currentUser.id]: { ...currentUser, admin: true } }
      };
      const tournamentRef = await db
        .collection("tournaments")
        .add(tournamentDetails);
      await db
        .collection("tournament_player")
        .doc(`${tournamentRef.id}_${currentUser.id}`)
        .set({ userId: currentUser.id, tournamentId: tournamentRef.id });

      Clipboard.setString(tournamentRef.id);
      const { refetch } = navigation.state.params;
      refetch();
      setLoading(false);
      showClipboardAlert(tournamentRef.id);
    } catch (error) {
      console.error("Error creating tournament", error);
    }
  };

  return (
    <Container solid>
      <Card flex={1}>
        <H1>New Tournament</H1>
        <Spacer size={3} />
        <View style={styles.form}>
          <Input
            label={"Tournament Name"}
            placeholder="Hacker's Classic"
            onChangeText={text => handleChange("title", text)}
            value={details.title}
          />
          <Spacer size={2} />
          <Text>Optional customisations below:</Text>
          <Spacer size={2} />
          <Input
            label={"Winning Reward"}
            onChangeText={text => handleChange("winningReward", text)}
            value={details.winningReward}
          />
          <Input
            label={"Losing Reward"}
            onChangeText={text => handleChange("losingReward", text)}
            value={details.losingReward}
          />
        </View>

        <Button white loading={loading} onPress={handleSaveTournament}>
          CREATE TOURNAMENT
        </Button>
      </Card>
    </Container>
  );
}

NewTournamentScreen.navigationOptions = {
  title: "New Tournament"
};

export default NewTournamentScreen;

const styles = StyleSheet.create({
  form: {
    flex: 1
  },
  invitee: {
    backgroundColor: greySolitude,
    borderRadius: 15,
    height: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  inviteeText: {
    color: greenMineral
  }
});
