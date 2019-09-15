/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import {
  golfGreen,
  greenMineral,
  greySolitude,
  greyWhiteSmoke
} from './constants/Colours';

export const Colors = {
  golfGreen: '#008763',
  greyWhiteSmoke: '#F8F8F8',
  greySolitude: '#E9ECEE',
  greenMineral: '#5a665c',
  redBurgundy: '#870024',
  championGold: '#FFDF00'
};

export const Loading = ({ size, invert }) => {
  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <ActivityIndicator
        size={size}
        color={invert ? 'white' : Colors.golfGreen}
      />
    </View>
  );
};

export const H1 = props => {
  let color = greenMineral;
  if (props.white) color = 'white';
  if (props.green) color = golfGreen;
  return (
    <Text
      style={{
        fontFamily: 'Dosis-Light',
        fontSize: 42,
        color,
        ...props.style
      }}>
      {props.children}
    </Text>
  );
};

export const H3 = props => {
  let fontFamily = 'Dosis-Regular';
  if (props.light) fontFamily = 'Dosis-Light';
  if (props.bold) fontFamily = 'Dosis-Bold';
  return (
    <React.Fragment>
      <Text
        style={{
          fontFamily,
          fontSize: 24,
          color: props.white ? 'white' : greenMineral,
          ...props.style
        }}>
        {props.children}
      </Text>
      {props.underline && (
        <View
          style={{
            borderBottomColor: props.white ? 'white' : greenMineral,
            borderBottomWidth: 1,
            marginBottom: 10
          }}
        />
      )}
    </React.Fragment>
  );
};

export const Body = props => {
  const fontFamily = props.bold ? 'Dosis-SemiBold' : 'Dosis-Regular';
  return (
    <Text
      style={{
        fontFamily,
        fontSize: 18,
        color: props.white ? 'white' : greenMineral,
        ...props.style
      }}>
      {props.children}
    </Text>
  );
};

export const Container = props => {
  const backgroundColor = props.solid ? golfGreen : greyWhiteSmoke;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor,
        display: 'flex',
        padding: 10,
        paddingBottom: 30,
        ...props.style
      }}>
      {props.children}
    </View>
  );
};

export const ScrollContainer = props => {
  const backgroundColor = props.solid ? golfGreen : greyWhiteSmoke;
  return (
    <ScrollView
      style={{
        flexGrow: 1,
        backgroundColor,
        display: 'flex',
        padding: 10,
        paddingBottom: 50,
        ...props.style
      }}>
      {props.children}
    </ScrollView>
  );
};

export const Button = props => {
  let primaryColor = golfGreen;
  let secondaryColor = 'white';
  let invert = true;
  if (props.white) {
    primaryColor = 'white';
    secondaryColor = golfGreen;
    invert = false;
  }
  if (props.warning) {
    primaryColor = Colors.redBurgundy;
    secondaryColor = 'white';
  }
  let onClick = props.onClick;
  if (props.loading) onClick = null;

  return (
    <TouchableOpacity
      style={{
        padding: 10,
        margin: 5,
        borderColor: secondaryColor,
        backgroundColor: primaryColor,
        borderRadius: 5,
        borderWidth: 1,
        ...props.style
      }}
      onClick={onClick}
      {...props}>
      {props.loading ? (
        <Loading size="small" invert={invert} />
      ) : (
        <Text
          style={{
            fontFamily: 'Dosis-SemiBold',
            color: secondaryColor,
            fontSize: 18,
            textAlign: 'center',
            textTransform: 'uppercase',
            ...props.textStyle
          }}>
          {props.children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const Card = props => {
  let style = {
    backgroundColor: props.clear ? 'transparent' : 'white',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    borderColor: props.clear ? 'transparent' : greySolitude,
    borderWidth: 1,
    shadowColor: props.clear ? 'transparent' : greenMineral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 2,
    ...props.style
  };

  if (props.flex) style = { ...style, flex: props.flex };
  return <View style={style}>{props.children}</View>;
};

export const Spacer = props => {
  const size = props.size || 1;
  const height = size * 10;
  return <View style={{ height }} />;
};

export const HR = props => {
  return (
    <View
      style={{
        borderBottomColor: props.white ? 'white' : greySolitude,
        borderBottomWidth: 1,
        marginBottom: 10
      }}
    />
  );
};

export const Input = props => {
  return (
    <View style={{ margin: 5 }}>
      {props.label && (
        <Text
          style={{
            color: props.white ? 'white' : greenMineral,
            opacity: 0.6,
            fontSize: 18,
            fontFamily: 'Dosis-Regular'
          }}>
          {props.label}
        </Text>
      )}
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TextInput
          {...props}
          placeholder={props.placeholder}
          autoCapitalize={props.autoCapitalize || 'none'}
          style={{
            height: 50,
            flex: 1,
            borderColor: props.white ? 'white' : greySolitude,
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            borderTopRightRadius: props.buttonText ? 0 : 5,
            borderBottomRightRadius: props.buttonText ? 0 : 5,
            fontSize: 24,
            color: greenMineral,
            fontFamily: 'Dosis-Regular',
            backgroundColor: props.white ? 'white' : 'transparent'
          }}
        />
        {props.buttonText && (
          <TouchableOpacity
            style={{
              padding: 10,
              height: 50,
              backgroundColor: golfGreen,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              display: 'flex',
              justifyContent: 'center'
            }}
            onPress={props.onButtonPress}>
            <Text
              style={{
                fontFamily: 'Dosis-SemiBold',
                color: 'white',
                fontSize: 18,
                textAlign: 'center',
                ...props.textStyle
              }}>
              {props.buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {props.error && (
        <Text style={{ fontSize: 14, color: 'red' }}>{props.error}</Text>
      )}
    </View>
  );
};

export const Emoji = ({ symbol, size, inactive, ...props }) => {
  let fontSize = 34; // small
  if (size === 'large') fontSize = 64;
  if (size === 'medium') fontSize = 48;
  return (
    <Text
      className="emoji"
      role="img"
      style={{
        fontSize,
        opacity: inactive ? 0.2 : 1,
        ...props.style
      }}>
      {symbol}
    </Text>
  );
};
