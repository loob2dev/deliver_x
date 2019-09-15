/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions, Image, Button } from 'react-native';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { Icon } from 'native-base';
import TaxiParcel from '../Component/Page/TaxiParcel';
import RegisterParcel from '../Component/Page/RegisterParcel';
import DataList from '../Component/Page/DataList';
import ActualPosition from '../Component/Page/ActualPosition';

const { width } = Dimensions.get("window");

const Logout = () => {
    
    }

const CustomDrawerNavigation = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: 250, opacity: 0.9 }}>
        <View style={{ height: 200, backgroundColor: 'Green', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../assets/no-image.png')} style={{ height: 150, width: 150, borderRadius: 60 }} />
        </View>
        <View style={{ height: 50, backgroundColor: 'Green', alignItems: 'center', justifyContent: 'center' }}>
          <Text>{props.navigation.state.params.email}</Text>
        </View>
      </View>
      <ScrollView>
        <DrawerNavigatorItems {...props} />
      </ScrollView>
      <View style={{ alignItems: "center", bottom: 20 }}>
        <Button title="Logout" onPress={Logout}/>
      </View>
    </SafeAreaView>
  );
}

const Drawer = createDrawerNavigator(
  {  
    TaxiParcel: {
      screen: TaxiParcel,
      navigationOptions: {
        title: 'Taxi Parcel'
      }
    },
    RegisterParcel: {
      screen: RegisterParcel,
      navigationOptions: {
        title: 'Register Parcel'
      }
    },
    DataList: {
      screen: DataList,
      navigationOptions: {
        title: 'Data List'
      }
    },
    ActualPosition: {
      screen: ActualPosition,
      navigationOptions: {
        title: 'Actual Position'
      }
    }
  },
  {
    initialRoutName: TaxiParcel,
    navigationOptions: {
          gesturesEnabled: false
        },
    drawerPosition: 'left',
    contentComponent: CustomDrawerNavigation,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: (width / 3) * 2
  }
  );

export default Drawer;