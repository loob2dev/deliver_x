/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import TaxiParcelScreen from '../Page/TaxiParcel';

const TaxiParcelNavigator = createStackNavigator(
  {
    TaxiParcel: TaxiParcelScreen,
  },
  {
    initialRouteName: 'TaxiParcel',
    headerMode: 'none',
  }
);

export default TaxiParcelNavigator;
