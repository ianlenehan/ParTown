import React from "react";
import { View, Text } from "react-native";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import useAppContext from "../hooks/useAppContext";
import { Spacer, Button } from "../common";

export default function EmojiPickerScreen({ navigation }) {
  const { setAppState } = useAppContext();

  const goBack = () => navigation.goBack();

  const setEmoji = emoji => {
    setAppState("emoji", emoji);
    goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <Spacer size={6} />
      <View style={{ alignItems: "flex-end" }}>
        <Button warning onPress={goBack}>
          CANCEL
        </Button>
      </View>
      <EmojiSelector onEmojiSelected={emoji => setEmoji(emoji)} />
    </View>
  );
}

// use context to record saved emoji!
