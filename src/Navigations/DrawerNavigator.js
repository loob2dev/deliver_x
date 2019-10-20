/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions, Image, Button, StatusBar } from 'react-native';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import colors from '../config/colors';
import TaxiParcelNavigator from './TaxiParcelNavigator';
import RegisterParcelNavigator from './RegisterParcelNavigator';
import RegisterHistoryNavigator from './RegisterHistoryNavigator';
import ActualPositionNavigator from './ActualPositionNavigator';
import { set_person_info } from '../redux/actions/MainActions';

const { width } = Dimensions.get('window');

const CustomDrawerNavigation = props => {
  return (
    <SafeAreaView style={style.sidebarContainer}>
      <StatusBar backgroundColor={colors.headerColor} barStyle="light-content" />
      <View style={style.headerContainer}>
        <View style={style.headerImageContainer}>
          <Image source={require('../assets/no-image.png')} style={style.headerImage} />
        </View>
        <View style={style.headerEmailContainer}>
          <Text>{props.person_info != null && props.person_info.email}</Text>
        </View>
      </View>
      <ScrollView>
        <DrawerNavigatorItems {...props} />
      </ScrollView>
      <View style={style.logoutButton}>
        <Button
          title="Logout"
          onPress={() => {
            logOut(props);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const logOut = async props => {
  try {
    await AsyncStorage.clear();
    const dispatch = props.dispatch;
    await dispatch(set_person_info(null));
    props.navigation.navigate('Auth');
  } catch (error) {}
};

const mapStatetoProps = ({ login: { person_info } }) => ({ person_info });
const ContentComponent = connect(mapStatetoProps)(CustomDrawerNavigation);

const Drawer = createDrawerNavigator(
  {
    TaxiParcel: {
      screen: TaxiParcelNavigator,
      navigationOptions: {
        title: 'Taxi Parcel',
        drawerIcon: ({ tintColor }) => <Icon name="home" style={getColorSheet(tintColor).icon} />,
      },
    },
    RegisterParcel: {
      screen: RegisterParcelNavigator,
      navigationOptions: {
        title: 'Register Parcel',
        drawerIcon: ({ tintColor }) => <Icon name="settings" style={getColorSheet(tintColor).icon} />,
      },
    },
    RegisterHistory: {
      screen: RegisterHistoryNavigator,
      navigationOptions: {
        title: 'Request history',
        drawerIcon: ({ tintColor }) => <Icon name="list" style={getColorSheet(tintColor).icon} />,
      },
    },
    ActualPosition: {
      screen: ActualPositionNavigator,
      navigationOptions: {
        title: 'Actual Position',
        drawerIcon: ({ tintColor }) => <Icon name="pin" style={getColorSheet(tintColor).icon} />,
      },
    },
  },
  {
    initialRoutName: TaxiParcelNavigator,
    navigationOptions: {
      gesturesEnabled: false,
    },
    drawerPosition: 'left',
    contentComponent: ContentComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: (width / 3) * 2,
  }
);

const getColorSheet = tintColor => {
  return StyleSheet.create({
    icon: {
      fontSize: 24,
      color: tintColor,
    },
  });
};

const style = StyleSheet.create({
  sidebarContainer: {
    flex: 1,
  },
  headerContainer: {
    height: 250,
    opacity: 0.9,
  },
  headerImageContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    height: 150,
    width: 150,
    borderRadius: 60,
  },
  headerEmailContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    alignItems: 'center',
    bottom: 20,
  },
});

export default Drawer;
