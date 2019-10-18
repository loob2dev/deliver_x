/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Alert, Platform , PermissionsAndroid } from 'react-native';
import { createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import AppNavigator from './src/router/AppNavigator';
import firebase from 'react-native-firebase';
import Geolocation from 'react-native-geolocation-service';
import api from './src/config/api';

const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
		    coords: {
		    	latitude : 49.8175,
		    	longitude: 15.4730
		    }
	    }
	 }


	watchId = null;

	async componentDidMount() {
	  this.checkPermission();
	  this.createNotificationListeners();
	  this.getLocationUpdates();
	}

	componentWillUnmount() {
	  	this.notificationListener();
	  	this.notificationOpenedListener();
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
	  console.log("fcmToken", fcmToken);
	  	if (!fcmToken) {
			  fcmToken = await firebase.messaging().getToken();
			  console.log("fcmToken", fcmToken);
	      	if (fcmToken) {
	          	// user has a device token
				await AsyncStorage.setItem('fcmToken', fcmToken);				
	      	}
    	}
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

	async createNotificationListeners() {
	  /*
	  * Triggered when a particular notification has been received in foreground
	  * */
	  this.notificationListener = firebase.notifications().onNotification((notification) => {
		  const { title, body } = notification;
		  console.log(title, body);
	      this.showAlert(title, body);
	  });

	  /*
	  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
	  * */
	  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
		  const { title, body } = notificationOpen.notification;
		  console.log(title, body);
	      this.showAlert(title, body);
	  });

	  /*
	  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
	  * */
	  const notificationOpen = await firebase.notifications().getInitialNotification();
	  if (notificationOpen) {
		  const { title, body } = notificationOpen.notification;
		  console.log(title, body);
	      this.showAlert(title, body);
	  }
	  /*
	  * Triggered for data only payload in foreground
	  * */
	  this.messageListener = firebase.messaging().onMessage((message) => {
		//process data message
		console.log("fcm", message);
	    console.log(JSON.stringify(message));
	  });
	}

	showAlert(title, body) {
	  Alert.alert(
	    title, body,
	    [
	        { text: 'OK', onPress: () => console.log('OK Pressed') },
	    ],
	    { cancelable: false },
	  );
	}

	hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
          return true;
        }

        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
     }

	getLocationUpdates = async () => {
        const hasLocationPermission = await this.hasLocationPermission();

        if (!hasLocationPermission) return;

        this.watchId = Geolocation.watchPosition(
            (position) => {
                this.setState({
                	coords: {
                		latitude: position.coords.latitude,
                		longitude: position.coords.longitude
                	}
                })
                console.log("upldate_location", position);
                return fetch(api.update_last_Location + position.coords.latitude + "/" + position.coords.longitude);
            },
              (error) => {
                // this.setState({ location: error });
                console.log(error);
            },
            { enableHighAccuracy: true, distanceFilter: 0, interval: 30000, fastestInterval: 2000 }
         );
    }

    removeLocationUpdates = () => {
         if (this.watchId !== null) {
              Geolocation.clearWatch(this.watchId);
              this.setState({ updatesEnabled: false })
         }
     }

	render() {
		return <AppContainer screenProps = {this.state.coords}/>
	}
}