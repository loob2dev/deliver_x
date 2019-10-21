import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, PixelRatio, Platform, SafeAreaView, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import colors from '../config/colors';
import keys from '../config/api_keys';
import ProgressScreen from './ProgressScreen';
import { get_all_address, delete_address } from '../redux/actions/CallApiAction';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class WholeRoute extends Component {
  render() {
    const origin = { latitude: this.props.transport_request_dto.senderLatitude, longitude: this.props.transport_request_dto.senderLongitude };
    const destinations = [];
    this.props.transport_request_dto.items.forEach(element => {
      destinations.push({
        latitude: element.receiverLatitude,
        longitude: element.receiverLongitude,
      });
    });
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Whole Route', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
            </View>
          }
        />
        <Toast
          ref="toast"
          style={styles.toast}
          position="top"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={styles.toast_text}
        />
        <View style={styles.container}>
          <KeyboardAwareScrollView enabledOnAndroid>
            <MapView
              provider={this.props.provider}
              style={styles.map}
              initialRegion={{
                latitude: this.props.transport_request_dto.senderLatitude,
                longitude: this.props.transport_request_dto.senderLongitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}>
              {destinations.map(item => {
                return <MapViewDirections origin={origin} destination={item} apikey={keys.google_map_ios} />;
              })}
            </MapView>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header_container: {
    marginTop: Platform.OS === 'ios' ? 0 : -24,
  },
  icon_container: {
    width: 50,
  },
  icon: {
    color: '#fff',
  },
  toast: {
    backgroundColor: '#000',
  },
  toast_text: {
    color: 'white',
    fontSize: 15,
  },
  container: {
    flex: 1,
  },
  map: {
    height: 300,
  },
});

const mapStatetoProps = ({
  login: { person_info },
  geolocation: { coords, geo_code },
  countries,
  parcels,
  currencies,
  register_parcel: { addresses, transport_request_dto },
}) => ({
  person_info,
  coords,
  geo_code,
  countries,
  parcels,
  currencies,
  addresses,
  transport_request_dto,
});
export default connect(mapStatetoProps)(WholeRoute);
