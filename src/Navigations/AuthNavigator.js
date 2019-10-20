/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createSwitchNavigator } from 'react-navigation';
import LoginScreen from '../Page/Login';
import LoadingScreen from '../Page/Loading';

const AuthoStackNavigator = createSwitchNavigator(
  {
    Login: LoginScreen,
    Loading: LoadingScreen,
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
  }
);

export default AuthoStackNavigator;
