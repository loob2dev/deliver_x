/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createSwitchNavigator } from 'react-navigation';
import DrawerNavigator from './DrawerNavigator';
import AuthoNavigator from './AuthNavigator';

const AppNavigator = createSwitchNavigator(
  {
    Auth: AuthoNavigator,
    Drawer: DrawerNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
);

export default AppNavigator;
