/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import RegisterParcelScreen from '../Page/RegisterParcel';
import AddressScreen from '../Page/Address';
import AddAddressScreen from '../Page/AddAddress';
import WholeRouteScreen from '../Page/WholeRoute';

const RegisterParcelNavigator = createStackNavigator(
  {
    RegisterParcel: RegisterParcelScreen,
    Address: AddressScreen,
    AddAddress: AddAddressScreen,
    WholeRoute: WholeRouteScreen,
  },
  {
    initialRouteName: 'RegisterParcel',
    headerMode: 'none',
  }
);

export default RegisterParcelNavigator;
