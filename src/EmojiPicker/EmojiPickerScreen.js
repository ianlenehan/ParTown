import React from 'react';
import { ScrollView, View, StatusBar } from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import useAppContext from '../hooks/useAppContext';
import { Spacer, Button } from '../common';

export default function EmojiPickerScreen({ navigation }) {
  const { setAppState } = useAppContext();

  const goBack = () => navigation.goBack();

  const setEmoji = emoji => {
    setAppState('emoji', emoji);
    goBack();
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Spacer size={3} />
      <View style={{ alignItems: 'flex-end' }}>
        <Button warning onPress={goBack}>
          CANCEL
        </Button>
      </View>
      <EmojiSelector onEmojiSelected={emoji => setEmoji(emoji)} />
    </ScrollView>
  );
}

// use context to record saved emoji!
