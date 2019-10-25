/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import Home_TransporterScreen from '../Page/Home_Transporter';

const HomeTransporterNavigator = createStackNavigator(
  {
    HomeTransporter: Home_TransporterScreen,
  },
  {
    initialRouteName: 'HomeTransporter',
    headerMode: 'none',
  }
);

export default HomeTransporterNavigator;
