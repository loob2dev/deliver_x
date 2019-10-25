/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import Home_OrderScreen from '../Page/Home_Order';

const HomeOrderNavigator = createStackNavigator(
  {
    Home: Home_OrderScreen,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  }
);

export default HomeOrderNavigator;
