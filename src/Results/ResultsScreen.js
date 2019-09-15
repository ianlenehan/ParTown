import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  DatePickerIOS,
  Alert
} from "react-native";
import { List, ListItem, Button } from "react-native-elements";
// import { players } from "../players";
import Layout from "../constants/Layout";
import Colours from "../constants/Colours";

const players = [
  {
    avatar_url:
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/198/face-with-tears-of-joy_1f602.png",
    nick_name: "Spud",
    full_name: "Ian Lenehan"
  }
];

export default class ResultsScreen extends React.Component {
  static navigationOptions = {
    title: "New Result",
    tabBarLabel: "Results"
  };

  constructor(props) {
    super(props);
    this.state = {
      roundDate: new Date(),
      LurchScore: "",
      SpudScore: "",
      TurtleScore: "",
      HeffScore: "",
      FrostyScore: "",
      hatHolder: "",
      winner: "",
      selectedHat: "",
      selectedTrophy: "",
      loading: false
    };
  }

  viewPlayerScreen = player => {
    this.props.navigation.navigate("Player", { player });
  };

  _setDate = newDate => {
    this.setState({ roundDate: newDate });
  };

  _renderHatImage(player, key) {
    let style = styles.hat;
    if (this.state.selectedHat === key) {
      style = styles.selectedHat;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            hatHolder: player.nick_name,
            selectedHat: key
          })
        }
      >
        <Image
          source={{
            uri:
              "https://emojipedia-us.s3.amazonaws.com/thumbs/240/apple/129/trophy_1f3c6.png"
          }}
          style={style}
        />
      </TouchableOpacity>
    );
  }

  _renderTrophyImage(player, key) {
    let style = styles.trophy;
    if (this.state.selectedTrophy === key) {
      style = styles.selectedTrophy;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            winner: player.nick_name,
            selectedTrophy: key
          })
        }
      >
        <Image
          source={{
            uri:
              "https://emojipedia-us.s3.amazonaws.com/thumbs/240/apple/129/trophy_1f3c6.png"
          }}
          style={style}
        />
      </TouchableOpacity>
    );
  }

  _renderPlayers() {
    return players.map((player, i) => {
      return (
        <View key={i} style={styles.playerView}>
          <Image source={{ uri: player.avatar_url }} style={styles.image} />
          <Text style={styles.playerName}>{player.full_name}</Text>
          <View style={styles.inputView}>
            {this._renderTrophyImage(player, i)}
            {this._renderHatImage(player, i)}
            <TextInput
              style={styles.inputStyle}
              keyboardType="numeric"
              onChangeText={text =>
                this.setState({ [`${player.nick_name}Score`]: text })
              }
              value={this.state[`${player.nick_name}Score`]}
            />
          </View>
        </View>
      );
    });
  }

  _resetState = () => {
    this.setState({
      roundDate: new Date(),
      LurchScore: "",
      SpudScore: "",
      TurtleScore: "",
      HeffScore: "",
      FrostyScore: "",
      hatHolder: null,
      winner: null,
      selectedHat: "",
      selectedTrophy: "",
      loading: false
    });
  };

  _submitScores = async () => {
    if (this.state.hatHolder && this.state.winner) {
      if (this.state.loading) {
        Alert.alert("Fucking relax", "I'm working on it");
      } else {
        this.setState({ loading: true });
        const {
          roundDate,
          hatHolder,
          winner,
          LurchScore,
          SpudScore,
          TurtleScore,
          HeffScore,
          FrostyScore
        } = this.state;
        // await axios.post("https://chairmans-api.herokuapp.com/results", {
        //   roundDate,
        //   hatHolder,
        //   winner,
        //   scores: {
        //     Lurch: { score: LurchScore },
        //     Spud: { score: SpudScore },
        //     Turtle: { score: TurtleScore },
        //     Heff: { score: HeffScore },
        //     Frosty: { score: FrostyScore }
        //   }
        // });
        this._resetState();
        this.props.navigation.navigate("Home");
      }
    } else {
      Alert.alert("Hang on", "You must select a winner and a loser");
    }
  };

  render() {
    const _submitScores = this._submitScores;
    const { loading } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <DatePickerIOS
          style={styles.pickerStyle}
          date={this.state.roundDate}
          onDateChange={this._setDate}
          mode={"date"}
        />
        {this._renderPlayers()}
        <View style={styles.buttonView}>
          <Button
            buttonStyle={{ backgroundColor: Colours.chairmansPink }}
            title={loading ? "...wait for it" : "SUBMIT"}
            onPress={() => this._submitScores()}
          />
          <Button
            buttonStyle={{
              backgroundColor: Colours.chairmansPink,
              marginTop: 10
            }}
            title="RESET"
            onPress={() => this._resetState()}
          />
        </View>
      </ScrollView>
    );
  }
}

const small = Layout.isSmallDevice;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  playerView: {
    flexDirection: "row",
    alignItems: "center",
    height: small ? 35 : 50,
    padding: 5,
    margin: 10
  },
  image: {
    height: small ? 35 : 40,
    width: small ? 35 : 40
  },
  playerName: {
    fontSize: small ? 18 : 24,
    marginLeft: small ? 5 : 10
  },
  inputView: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  inputStyle: {
    height: small ? 35 : 40,
    width: small ? 35 : 40,
    backgroundColor: "#ecf0f1",
    fontSize: small ? 16 : 18,
    textAlign: "center",
    marginLeft: small ? 5 : 10
  },
  hat: {
    height: small ? 25 : 30,
    width: small ? 25 : 30,
    margin: 5,
    marginRight: small ? 5 : 12,
    opacity: 0.2
  },
  selectedHat: {
    height: small ? 25 : 30,
    width: small ? 25 : 30,
    margin: 5,
    marginRight: small ? 5 : 12,
    opacity: 1
  },
  trophy: {
    height: small ? 25 : 30,
    width: small ? 25 : 30,
    margin: 5,
    marginRight: small ? 5 : 12,
    opacity: 0.2
  },
  selectedTrophy: {
    height: small ? 25 : 30,
    width: small ? 25 : 30,
    margin: 5,
    marginRight: small ? 5 : 12,
    opacity: 1
  },
  buttonView: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10
  },
  pickerStyle: {
    height: 80,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 10
  }
});
