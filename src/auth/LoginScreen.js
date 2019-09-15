import React, { useState } from 'react';
import { Text, View, KeyboardAvoidingView, Image } from 'react-native';
import { auth, firestore } from 'react-native-firebase';

import {
  Container,
  Card,
  H1,
  Body,
  Input,
  Button,
  Spacer,
  Colors
} from '../common';
import { TouchableOpacity } from 'react-native-gesture-handler';

function LoginScreen() {
  const initialUserValues = {
    fullName: '',
    nickName: '',
    emailAddress: '',
    password: '',
    passwordConfirmation: ''
  };
  const [userValues, setUserValues] = useState(initialUserValues);
  const {
    fullName,
    nickName,
    emailAddress,
    password,
    passwordConfirmation
  } = userValues;

  const [authType, setAuthType] = useState('login');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = ({ nativeEvent }, fieldName) => {
    setUserValues(userValues => ({
      ...userValues,
      [fieldName]: nativeEvent.text
    }));
  };

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleLogin = async () => {
    if (!validateEmail(emailAddress)) {
      return setErrorMessage('FORE! Email address is invalid!');
    }
    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(emailAddress, password);
      setLoading(false);
    } catch (error) {
      setErrorMessage(
        'FORE! The email address or password you entered is incorrect.'
      );
      setLoading(false);
    }
  };

  const runValidations = () => {
    if (!fullName || fullName === '') {
      setErrorMessage('FORE! Name can not be blank.');
      return false;
    }
    if (!nickName || nickName === '') {
      const nn = fullName.split(' ')[0];
      setUserValues(userValues => ({ ...userValues, nickName: nn }));
    }
    if (password !== passwordConfirmation) {
      setErrorMessage(
        'FORE! Password and Password Confirmation must be the same.'
      );
      return false;
    }
    if (!validateEmail(emailAddress)) {
      setErrorMessage('FORE! Email address is invalid!');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    setLoading(true);
    const isValid = runValidations();
    if (isValid) {
      try {
        const authUser = await auth().createUserWithEmailAndPassword(
          emailAddress,
          password
        );

        await firestore()
          .collection('users')
          .doc(authUser.user.uid)
          .set({
            fullName,
            nickName,
            emailAddress,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        setLoading(false);
      } catch (error) {
        setErrorMessage(
          'FORE! There was an error signing you up! Please try again.'
        );
        console.error(error);
        setLoading(false);
      }
    }
  };

  const changeAuthType = type => {
    setAuthType(type);
    setErrorMessage(null);
  };

  return (
    <Container solid>
      <Spacer size={2} />

      <Card flex={2} clear>
        {authType === 'signup' && (
          <React.Fragment>
            <Input
              white
              label={'Full name'}
              placeholder="Jack Nicklaus"
              onChange={e => handleChange(e, 'fullName')}
              value={fullName}
              error={validationError}
            />
            <Spacer size={2} />
            <Input
              white
              label={'Nickname'}
              placeholder="Golden Bear"
              onChange={e => handleChange(e, 'nickName')}
              value={nickName}
              error={validationError}
            />
            <Spacer size={2} />
          </React.Fragment>
        )}
        <Input
          white
          label={'Email Address'}
          placeholder="fore@example.com"
          onChange={e => handleChange(e, 'emailAddress')}
          value={emailAddress}
          error={validationError}
        />
        <Spacer size={2} />
        <Input
          white
          secureTextEntry
          label={'Password'}
          placeholder="s0m3thingS3cur3!"
          onChange={e => handleChange(e, 'password')}
          value={password}
        />
        <Spacer size={2} />
        {authType === 'signup' ? (
          <React.Fragment>
            <Input
              white
              secureTextEntry
              label={'Password Confirmation'}
              placeholder="Same as the password..."
              onChange={e => handleChange(e, 'passwordConfirmation')}
              value={passwordConfirmation}
            />
            <Spacer size={2} />
            <TouchableOpacity onPress={() => changeAuthType('login')}>
              <Body white style={{ textAlign: 'center' }}>
                Already have an account? Click here to login.
              </Body>
            </TouchableOpacity>
          </React.Fragment>
        ) : (
          <TouchableOpacity onPress={() => changeAuthType('signup')}>
            <Body white style={{ textAlign: 'center' }}>
              No Account? Click here to create one.
            </Body>
          </TouchableOpacity>
        )}
        {errorMessage && (
          <View
            style={{
              backgroundColor: Colors.greyWhiteSmoke,
              padding: 5,
              borderRadius: 5,
              marginTop: 10
            }}>
            <Text style={{ color: 'red', textAlign: 'center' }}>
              {errorMessage}
            </Text>
          </View>
        )}
        {authType === 'signup' ? (
          <Button loading={loading} onPress={handleSignup}>
            SIGN UP
          </Button>
        ) : (
          <Button loading={loading} onPress={handleLogin}>
            LOGIN
          </Button>
        )}
      </Card>
      <Spacer size={3} />
      <View style={{ display: 'flex', alignItems: 'center', marginBottom: 50 }}>
        <Image
          source={require('../images/ParTownLogoWhite.png')}
          style={{ width: 125, height: 50 }}
        />
      </View>
    </Container>
  );
}

export default LoginScreen;
