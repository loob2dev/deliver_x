/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import RegisterHistoryScreen from '../Page/RegisterHistory';
import RegisterDetailScreen from '../Page/RegisterDetail/Main';
import GoPayScreen from '../Page/RegisterDetail/GoPay';

const RegisterHistoryNavigator = createStackNavigator(
  {
    RegistoryHistory: RegisterHistoryScreen,
    RegisterDetail: RegisterDetailScreen,
    GoPay: GoPayScreen,
  },
  {
    initialRouteName: 'RegistoryHistory',
    headerMode: 'none',
  }
);

export default RegisterHistoryNavigator;
