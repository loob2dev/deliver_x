import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import colors from '../config/colors';

class Home_Order extends Component {
  async componentDidMount() {
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase.notifications().onNotification(notification => {
      const { title, body } = notification;
      console.log(title, body);
      this.showAlert(title, body);
    });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(notificationOpen => {
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
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log('fcm', message);
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(title, body, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: false });
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Home', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="menu" style={styles.icon} onPress={() => this.props.navigation.openDrawer()} />
            </View>
          }
        />
        <View style={styles.homepage}>
          <Text style={styles.temp}>Homepage</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header_container: {
    marginTop: Platform.OS === 'ios' ? 0 : -24,
  },
  icon_container: {
    width: 50,
  },
  icon: {
    color: '#fff',
  },
  container: {
    flex: 1,
  },
  homepage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temp: {
    color: 'black',
  },
});

export default Home_Order;
