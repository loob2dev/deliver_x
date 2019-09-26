/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from '../Component/Page/Login';
import Drawer from './DrawerNavigator';
import Address from '../Component/Page/Address';
import RequestDetail from '../Component/Page/RequestDetail'

const AppNavigator = createStackNavigator(
		{
			Login: LoginScreen,
			Drawer: Drawer,
			Address: Address,
			RequestDetail, RequestDetail
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