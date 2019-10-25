/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import MyWorkScreen from '../Page/MyWork';

const MyWorkNavigator = createStackNavigator(
  {
    MyWork: MyWorkScreen,
  },
  {
    initialRouteName: 'MyWork',
    headerMode: 'none',
  }
);

export default MyWorkNavigator;
