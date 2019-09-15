import React, { useState } from "react";
import { View, Text } from "react-native";
import { firestore } from "react-native-firebase";
import useAppContext from "../hooks/useAppContext";
import {
  H1,
  H3,
  Body,
  Button,
  Card,
  Container,
  Spacer,
  Input
} from "../common";

function FindTournamentScreen({ navigation }) {
  const [id, setId] = useState(null);
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useAppContext();

  const handleSearch = async () => {
    if (!id) return null;

    const tournamentSnap = await firestore()
      .collection("tournaments")
      .doc(id)
      .get();
    if (tournamentSnap.exists) {
      const tournament = tournamentSnap.data();
      setSearchResult(tournament);
    }
  };

  const handleJoinTournament = async () => {
    if (searchResult.players[currentUser.id]) {
      return setErrorMessage("You're already a member of this tournament!");
    }
    try {
      setLoading(true);
      let tournamentDocRef = firestore()
        .collection("tournaments")
        .doc(id);
      let tournamentPlayerDocRef = firestore()
        .collection("tournament_player")
        .doc(`${id}_${currentUser.id}`);

      await firestore().runTransaction(async transaction => {
        await transaction.get(tournamentDocRef);
        await transaction.update(tournamentDocRef, {
          [`players.${currentUser.id}`]: { ...currentUser, admin: false }
        });
        await transaction.set(tournamentPlayerDocRef, {
          userId: currentUser.id,
          tournamentId: id
        });
      });
      const { refetch } = navigation.state.params;
      refetch();
      exitModal();
    } catch (error) {
      console.error("Error adding you to the tournament", error);
    }
  };

  const clearState = () => {
    setErrorMessage(null);
    setId(null);
    setSearchResult(null);
    setLoading(false);
  };

  const exitModal = () => {
    clearState();
    return navigation.goBack();
  };

  return (
    <Container solid>
      <View style={{ marginTop: 50 }}>
        <H1 white style={{ textAlign: "center" }}>
          Join A Tournament
        </H1>
        <Spacer size={2} />
        <Input
          white
          label="Enter token ID"
          placeholder="Token Id"
          onChangeText={text => setId(text)}
          value={id}
        />
        <Spacer size={2} />
        <Button onPress={handleSearch}>Search</Button>
        <Spacer size={4} />
        {searchResult && (
          <Card>
            <H3>{searchResult.title}</H3>
            <Body>Admin: {searchResult.admin}</Body>
            <Spacer size={2} />
            <Button loading={loading} onPress={handleJoinTournament}>
              Join Tournament
            </Button>
            <Text style={{ color: "red", textAlign: "center" }}>
              {errorMessage}
            </Text>
          </Card>
        )}
      </View>
      <Button warning onPress={exitModal}>
        Cancel
      </Button>
    </Container>
  );
}

export default FindTournamentScreen;
