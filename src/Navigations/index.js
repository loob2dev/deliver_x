/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createSwitchNavigator } from 'react-navigation';
import OrderDrawerNavigator from './OrderDrawerNavigator';
import TransporterDrawerNavigator from './TransporterDrawNavigator';
import AuthoNavigator from './AuthNavigator';

const AppNavigator = createSwitchNavigator(
  {
    Auth: AuthoNavigator,
    OrderDrawer: OrderDrawerNavigator,
    TransporterDrawer: TransporterDrawerNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
);

export default AppNavigator;
