/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import RegisterParcelScreen from '../Page/RegisterParcel/Main';
import AddressScreen from '../Page/Address';
import AddAddressScreen from '../Page/AddAddress';

const RegisterParcelNavigator = createStackNavigator(
  {
    RegisterParcel: RegisterParcelScreen,
    Address: AddressScreen,
    AddAddress: AddAddressScreen,
  },
  {
    initialRouteName: 'RegisterParcel',
    headerMode: 'none',
  }
);

export default RegisterParcelNavigator;
