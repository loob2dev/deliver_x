import React, {Component} from 'react';
import {Platform, StyleSheet, View, ActivityIndicator} from 'react-native';
import colors from '../../config/colors';

const instructions = Platform.select({
 ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
 android:
   'Double tap R on your keyboard to reload,\n' +
   'Shake or press menu button for dev menu',
});

export default class ProgressScreen extends Component {
 render() {
   return (
     <View style={styles.container}>
       <ActivityIndicator 
        size="large"
        color={colors.progress}/>
     </View>
   );
 }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: colors.subScreen,
 }
});