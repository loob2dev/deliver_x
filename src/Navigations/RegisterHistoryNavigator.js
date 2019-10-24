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

const RegisterHistoryNavigator = createStackNavigator(
  {
    RegistoryHistory: RegisterHistoryScreen,
    RegisterDetail: RegisterDetailScreen,
  },
  {
    initialRouteName: 'RegistoryHistory',
    headerMode: 'none',
  }
);

export default RegisterHistoryNavigator;
