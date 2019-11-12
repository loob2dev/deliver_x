import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Alert, Linking, TouchableOpacity, NativeModules, ActivityIndicator } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import firebase from 'react-native-firebase';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import colors from '../../config/colors';

import RequestedRoute from './RequestedRoute';
// import { get_all_unaccepted_by_transporter } from '../../redux/actions/CallApiAction';

class Main extends Component {
  async componentDidMount() {
    this.createNotificationListeners();
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = event => {
    this.navigate(event.url);
  };

  navigate = url => {
    // E
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    const routeName = route.split('/')[0];

    if (routeName === 'DelX') {
      navigate('Login');
    }
  };

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase.notifications().onNotification(async notification => {
      const { title, body } = notification;
      console.log(title, body);
      console.log('onNotification', notification);
      this.showAlert(title, body);
      // await this.props.dispatch(get_all_unaccepted_by_transporter());
      this.props.navigation.navigate('HomeTransporter');
    });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async notificationOpen => {
      const { title, body } = notificationOpen.notification;
      console.log(title, body);
      console.log('onNotificationOpened');
      this.showAlert(title, body);
      // await this.props.dispatch(get_all_unaccepted_by_transporter());
      this.props.navigation.navigate('HomeTransporter');
    });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log(title, body);
      console.log('getInitialNotification');
      this.showAlert(title, body);
      // this.props.dispatch(get_all_unaccepted_by_transporter());
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
        {this.props.all_unaccepted.length === 0 && (
          <View style={styles.homepage}>
            <Text style={styles.title}>Transporter home</Text>
            <Text>Wait for transport requests!</Text>
            <ActivityIndicator size="small" style={styles.indecator} />
          </View>
        )}
        {this.props.all_unaccepted.length > 0 && (
          <KeyboardAwareScrollView
            enabledOnAndroid
            enableResetScrollToCoords={false}
            innerRef={ref => {
              this.scroll = ref;
            }}>
            <Text style={styles.title}>Transporter home</Text>
            {this.props.all_unaccepted.map((item, index) => {
              return (
                <View key={index} style={styles.route}>
                  <Divider />
                  <Text style={styles.subTitle}>Requested route #{index + 1}</Text>
                  <RequestedRoute {...this.props} onRef={ref => (this.request = ref)} dataFromParent={item} />
                </View>
              );
            })}
          </KeyboardAwareScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header_container: {
    marginTop: Platform.OS === 'ios' ? 0 : -24,
  },
  icon_container: {
    width: 50,
  },
  icon: {
    color: '#fff',
  },
  homepage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'black',
    fontSize: 30,
    margin: 10,
  },
  subTitle: {
    margin: 10,
    color: '#6a737d',
    fontSize: 20,
    fontWeight: 'bold',
  },
  route: {
    marginBottom: 20,
  },
  indecator: {
    marginTop: 20,
  },
});

const mapStatetoProps = ({ transporter: { all_unaccepted } }) => ({
  all_unaccepted,
});
export default connect(mapStatetoProps)(Main);
