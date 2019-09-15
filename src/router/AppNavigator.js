/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../Component/Page/Login';
import Drawer from './DrawerNavigator';

const AppNavigator = createStackNavigator(
		{
			Login: LoginScreen,
			Drawer: Drawer
		},
		{
			initialRouteName: 'Login',
		    headerMode: 'none',
		    navigationOptions: {
		      gesturesEnabled: false
		    }
		}
	)

export default AppNavigator;