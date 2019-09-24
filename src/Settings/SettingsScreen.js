import React, { useState, useEffect } from 'react';
import { auth, firestore } from 'react-native-firebase';
import useAppContext from '../hooks/useAppContext';
import { View, TouchableOpacity } from 'react-native';
import {
  H1,
  H3,
  Body,
  Button,
  Card,
  ScrollContainer,
  Spacer,
  Input,
  Emoji
} from '../common';

function SettingsScreen({ navigation }) {
  const { currentUser, emoji, setAppState } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: currentUser && currentUser.fullName && '',
    nickName: currentUser && currentUser.nickName && '',
    emoji: currentUser && currentUser.emoji && '⛳️'
  });

  useEffect(() => {
    if (currentUser) {
      setUserDetails(currentUser);
    }
    if (emoji) {
      setUserDetails(userDetails => ({ ...userDetails, emoji }));
    }
  }, [emoji, currentUser]);

  updatePlayerSettings = async () => {
    setLoading(true);
    setAppState('currentUser', userDetails);
    try {
      await firestore()
        .collection('users')
        .doc(currentUser.id)
        .set(userDetails);
      setLoading(false);
      await updateSettingsInTournament(userDetails);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  updateSettingsInTournament = async userDetails => {
    const { refetch } = navigation.state.params;
    const db = firestore();

    const tpSnap = await db
      .collection('tournament_player')
      .where('userId', '==', userDetails.id)
      .get();

    for (let i = 0; i < tpSnap.docs.length; i++) {
      await db
        .collection('tournaments')
        .doc(tpSnap.docs[i].data().tournamentId)
        .update({ [`players.${userDetails.id}`]: userDetails });
    }
    refetch();
  };

  handleNameChange = text => {
    setUserDetails(userDetails => ({ ...userDetails, fullName: text }));
  };

  handleNicknameChange = text => {
    setUserDetails(userDetails => ({ ...userDetails, nickName: text }));
  };

  handleEmojiChange = text => {
    setUserDetails(userDetails => ({ ...userDetails, emoji: text }));
  };

  const handleSignOut = async () => {
    await auth().signOut();
  };

  return (
    <ScrollContainer>
      <Card flex={1}>
        <H1>Settings</H1>
        <Spacer size={3} />
        <Input
          label="Full name"
          value={userDetails.fullName}
          onChangeText={handleNameChange}
        />
        <Spacer size={2} />
        <Input
          label="Nickname"
          value={userDetails.nickName}
          onChangeText={handleNicknameChange}
        />
        <TouchableOpacity onPress={() => navigation.navigate('EmojiPicker')}>
          <Emoji symbol={userDetails.emoji} size="large" />
          <Body>Choose your emoji</Body>
        </TouchableOpacity>
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
          <Button onPress={updatePlayerSettings} loading={loading}>
            SAVE CHANGES
          </Button>
        </View>
      </Card>
      <Button warning onPress={handleSignOut}>
        SIGN OUT
      </Button>
    </ScrollContainer>
  );
}

export default SettingsScreen;
