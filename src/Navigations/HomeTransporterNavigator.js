/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import Home_TransporterScreen from '../Page/Home_Transporter/Main';
import RequestDetailScreen from '../Page/RequestDetail';

const HomeTransporterNavigator = createStackNavigator(
  {
    HomeTransporter: Home_TransporterScreen,
    RequestDetail: RequestDetailScreen,
  },
  {
    initialRouteName: 'HomeTransporter',
    headerMode: 'none',
  }
);

export default HomeTransporterNavigator;
