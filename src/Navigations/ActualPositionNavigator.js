/**
 * React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { createStackNavigator } from 'react-navigation-stack';
import ActualPositionScreen from '../Page/ActualPosition';

const ActualPositionNavigator = createStackNavigator(
  {
    ActualPosition: ActualPositionScreen,
  },
  {
    ActualPosition: ActualPositionScreen,
    headerMode: 'none',
  }
);

export default ActualPositionNavigator;
