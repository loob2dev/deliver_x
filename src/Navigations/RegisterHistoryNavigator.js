/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import RegisterHistoryScreen from '../Page/RegisterHistory';
import RequestDetailScreen from '../Page/RequestDetail';

const RegisterHistoryNavigator = createStackNavigator(
  {
    RegistoryHistory: RegisterHistoryScreen,
    RequestDetail: RequestDetailScreen,
  },
  {
    initialRouteName: 'RegistoryHistory',
    headerMode: 'none',
  }
);

export default RegisterHistoryNavigator;
