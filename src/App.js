/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { Root } from 'native-base';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

import AppNavigator from './Navigations/index';
import { update_last_location } from './redux/actions/CallApiAction';

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: {
        latitude: 49.8175,
        longitude: 15.473,
      },
    };
  }

  watchId = null;

  async componentDidMount() {
    this.checkPermission();
    this.getLocationUpdates();
  }

  componentWillUnmount() {
    this.removeLocationUpdates();
  }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('fcmToken', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log('fcmToken', fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    this.setState({ fcmToken });
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  getLocationUpdates = async () => {
    const { dispatch } = this.props;

    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.watchId = Geolocation.watchPosition(
      position => {
        dispatch(update_last_location(position.coords));
      },
      error => {
        // this.setState({ location: error });
        console.log(error);
      },
      { enableHighAccuracy: true, distanceFilter: 0, interval: 30000, fastestInterval: 2000 }
    );
  };

  removeLocationUpdates = () => {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.setState({ updatesEnabled: false });
    }
  };

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  };

  render() {
    return (
      <Root>
        <AppContainer screenProps={this.state.fcmToken} uriPrefix="delX://" enableURLHandling />
      </Root>
    );
  }
}

export default connect()(App);
