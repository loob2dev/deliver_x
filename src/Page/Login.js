import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Input } from 'react-native-elements';
import { Icon } from 'native-base';
import { getUniqueId } from 'react-native-device-info';
import { connect } from 'react-redux';

import api from '../config/api';
import { set_person_info } from '../redux/actions/MainActions';
import { post } from '../utils/httpRequest';
import colors from '../config/colors';

const NO_EMAIL = 'NO_EMAIL';
const NO_TOKEN = 'NO_TOKEN';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isConnecting: false,
      email: 'test@email.cz',
      password: 'heslo123',
      deviceID: null,
      email_error: false,
      password_error: false,
    };
  }

  componentDidMount() {
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    try {
      const person_info = await this.ger_persion_info_from_storage();
      console.log(person_info);
      const { dispatch } = this.props;
      await dispatch(set_person_info(person_info));
      this.props.navigation.navigate('Loading');
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  ger_persion_info_from_storage = async () => {
    try {
      const email = await AsyncStorage.getItem('@email');
      if (email == null) {
        throw { message: NO_EMAIL };
      }

      const mobilePhoneNr = await AsyncStorage.getItem('@mobilePhoneNr');

      const token = await AsyncStorage.getItem('@token');
      if (token == null) {
        throw { status: NO_TOKEN };
      }

      const deviceID = await AsyncStorage.getItem('@deviceID');

      const transporter = await AsyncStorage.getItem('@transporter');

      return {
        email: email,
        mobilePhoneNr: mobilePhoneNr,
        token: token,
        deviceID: deviceID,
        transporter: transporter,
      };
    } catch (error) {
      throw error;
    }
  };

  onClickListener = viewId => {
    Alert.alert('Alert', 'Button pressed ' + viewId);
  };

  login = async () => {
    let deviceId = null;
    try {
      deviceId = await getUniqueId();
    } catch (e) {
      console.log('Trouble getting device info ', e);
    }

    console.log('deviceId', deviceId);

    const { dispatch } = this.props;
    if (this.state.email === '') {
      this.setState({ email_error: true });
    }
    if (this.state.password === '') {
      this.setState({ password_error: true });
    }
    if (this.state.email === '' || this.state.password === '') {
      return;
    }

    this.setState({ isConnecting: true });
    const param = {
      email: this.state.email,
      password: this.state.password,
      mobilePhoneNr: null,
      token: null,
      deviceID: deviceId,
    };

    try {
      const response = await post(api.authenticate, param);
      this.setState({ isConnecting: false });

      const persion_info = {
        email: response.email,
        mobilePhoneNr: response.mobilePhoneNr,
        token: response.token,
        deviceID: response.deviceID,
        transporter: response.transporter,
      };
      dispatch(set_person_info(persion_info));
      this.set_persion_info_to_storage(persion_info);
      this.props.navigation.navigate('Loading');
    } catch (error) {
      this.setState({ isConnecting: false }, () => {
        Alert.alert('Failed', error.status);
      });
    }
  };

  set_persion_info_to_storage = async persion_info => {
    if (persion_info.email) {
      await AsyncStorage.setItem('@email', persion_info.email);
    }
    if (persion_info.mobilePhoneNr) {
      await AsyncStorage.setItem('@mobilePhoneNr', persion_info.mobilePhoneNr);
    }
    if (persion_info.token) {
      await AsyncStorage.setItem('@token', persion_info.token);
    }
    if (persion_info.deviceID) {
      await AsyncStorage.setItem('@deviceID', persion_info.deviceID);
    }
    if (persion_info.transporter) {
      await AsyncStorage.setItem('@transporter', persion_info.transporter);
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.indecatorContainer}>
          <ActivityIndicator size="large" color={colors.progress} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Input
            keyboardType="email-address"
            leftIcon={<Icon name="mail" size={24} color="#82847c" />}
            value={this.state.email}
            onChangeText={email => this.setState({ email, email_error: false })}
          />
        </View>
        {this.state.email_error && <Text style={styles.error}>Email is required!</Text>}
        <View style={styles.inputContainer}>
          <Input
            secureTextEntry={true}
            leftIcon={<Icon name="key" size={24} color="#82847c" />}
            value={this.state.password}
            onChangeText={password => this.setState({ password, password_error: false })}
          />
        </View>
        {this.state.password_error && <Text style={styles.error}>Password is required!</Text>}
        <TouchableOpacity disabled={this.state.isConnecting} style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.login()}>
          {this.state.isConnecting && <ActivityIndicator size="small" color={'#fff'} />}
          {!this.state.isConnecting && <Text style={styles.loginText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
          <Text>Forgot your password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Login.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  indecatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    height: 45,
    marginBottom: 20,
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: '#00b5ec',
  },
  loginText: {
    color: 'white',
  },
  error: {
    color: '#b00020',
    marginBottom: 20,
  },
});

export default connect()(Login);
