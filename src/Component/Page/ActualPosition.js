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
            latitude: 37.78825 + SPACE,
            longitude: -122.4324 + SPACE,
            LATITUDE: 37.78825,
            LONGITUDE: -122.4324
          }
        }
      }

      componentDidMount() {
        this.getLocation();
      }

      hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
          return true;
        }

        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
      }
      getLocation = async () => {
        const hasLocationPermission = await this.hasLocationPermission();

        if (!hasLocationPermission) return;

        this.setState({ loading: true }, () => {
          Geolocation.getCurrentPosition(
            (position) => {
              this.setState({ location: position, loading: false });
              this.setState({
                coords: {
                  latitude : position.coords.latitude,
                  longitude : position.coords.longitude,
                  LATITUDE : position.coords.latitude,
                  LONGITUDE : position.coords.longitude
                }
              }, () => {
                this.setState({isLoading: false})
              })
            },
            (error) => {
              this.setState({ location: error, loading: false });
              console.log(error);
              this.setState({isLoading: false})
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
          );
        });
      }

    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="pin" style={{ fontSize: 24, color: tintColor }} />
        )
    }

    render() {
        if (this.state.isLoading) {
          return <ProgressScreen/>
        }
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
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
      height: 600,
    },
});

export default ActualPosition;
