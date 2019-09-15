import React, { useState } from "react";
import useAppContext from "../hooks/useAppContext";
import { DatePickerIOS, View, Text } from "react-native";
import {
  H1,
  H3,
  Body,
  Container,
  HR,
  Button,
  Card,
  ScrollContainer,
  Spacer,
  Input,
  Emoji,
  Colors
} from "../common";

function DateFilterScreen({ navigation }) {
  const { filterDates, setAppState } = useAppContext();
  const [dates, setDates] = useState({
    to: filterDates.to,
    from: filterDates.from
  });

  const exitModal = () => {
    return navigation.goBack();
  };

  const setDate = (key, value) => {
    const newDates = { ...dates, [key]: value };
    setDates(newDates);
  };

  const saveDates = () => {
    setAppState("filterDates", dates);
    exitModal();
  };

  return (
    <Container>
      <View style={{ marginTop: 50, flex: 1 }}>
        <H1 style={{ textAlign: "center" }}>Set Date Filter</H1>
        <Spacer size={2} />
        <Body>From:</Body>
        <Spacer size={2} />
        <DatePickerIOS
          style={styles.pickerStyle}
          date={dates.from}
          onDateChange={value => setDate("from", value)}
          mode={"date"}
        />
        <Spacer size={4} />
        <Body>To:</Body>
        <Spacer size={2} />
        <DatePickerIOS
          style={styles.pickerStyle}
          date={dates.to}
          onDateChange={value => setDate("to", value)}
          mode={"date"}
        />
      </View>
      <Button onPress={saveDates}>Save</Button>
      <Button warning onPress={exitModal}>
        Cancel
      </Button>
    </Container>
  );
}

export default DateFilterScreen;

const styles = {
  pickerStyle: {
    height: 80,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10
  }
};
