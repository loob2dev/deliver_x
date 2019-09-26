import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Header } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import colors from '../../config/colors'
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import ProgressScreen from '../Refer/ProgressScreen';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;


class ActualPosition extends Component {

    constructor(props){
        super(props)
        this.state = {
          isLoading: true,
          coords: {
            latitude: this.props.screenProps.latitude,
            longitude: this.props.screenProps.longitude,
            LATITUDE: this.props.screenProps.latitude,
            LONGITUDE: this.props.screenProps.longitude
          }
        }
      }

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="pin" style={{ fontSize: 24, color: tintColor }} />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
                    containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}
                    centerComponent={{ text: 'Actual Position', style: { color: '#fff' } }}
                    leftComponent={<Icon name="menu" style={{ color: '#fff' }} onPress={() => this.props.navigation.openDrawer()} />}
                />
                <MapView
                          provider={this.props.provider}
                          style={styles.map}
                          initialRegion={{
                            latitude: this.state.coords.LATITUDE,
                            longitude: this.state.coords.LONGITUDE,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                          }}
                        >
                          <Marker
                            coordinate={this.state.coords}
                          />
                        </MapView>
            </View>
        );
    }
}
ActualPosition.propTypes = {
  provider: ProviderPropType,
};
const styles = StyleSheet.create({
  container: {
        flex: 1,
    },
    map: {
      height: height,
    },
});

export default ActualPosition;
