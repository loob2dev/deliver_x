import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PixelRatio,
  Platform,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Input } from 'react-native-elements';
import { Icon } from 'native-base';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import colors from '../config/colors';
import keys from '../config/api_keys';
import ProgressScreen from './ProgressScreen';
import { accept_transport_request_by_client } from '../redux/actions/CallApiAction';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class WholeRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirming: false,
    };
  }
  confirmOrder = id => {
    this.setState({ isConfirming: true }, async () => {
      const dispatch = this.props.dispatch;
      try {
        await dispatch(accept_transport_request_by_client(id));
        this.refs.toast.show('Success.', 3500);
      } catch (error) {
        this.refs.toast.show('Failed.', 3500);
      }
      this.setState({ isConfirming: false });
    });
  };
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
            {destinations.map((item, index) => {
              return (
                <View>
                  <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    initialRegion={{
                      latitude: this.props.transport_request_dto.senderLatitude,
                      longitude: this.props.transport_request_dto.senderLongitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}>
                    <MapViewDirections
                      origin={origin}
                      destination={item}
                      apikey={Platform.OS === 'ios' ? keys.google_map_ios : keys.google_map_android}
                    />
                  </MapView>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Input label="Total distance" disabled={true} value={this.props.transport_request_dto.totalDistance.toString()} />
                    </View>
                    <View style={styles.col}>
                      <Input label="Total price" disabled={true} value={this.props.transport_request_dto.totalPrice.toString()} />
                    </View>
                  </View>
                  <View style={styles.confirmButtonContainer}>
                    <TouchableOpacity
                      disabled={this.state.isConfirming}
                      style={styles.confirmButton}
                      onPress={() => {
                        this.confirmOrder(this.props.transport_request_dto.items[index].id);
                      }}>
                      {this.state.isConfirming && <ActivityIndicator size="small" color={'#fff'} />}
                      {!this.state.isConfirming && <Text style={styles.button_text}>Confirm Order</Text>}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
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
  row: {
    flexDirection: 'row',
    marginTop: 10,
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 7,
    marginRight: 7,
  },
  confirmButtonContainer: {
    alignItems: 'flex-end',
  },
  confirmButton: {
    height: 38,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 20,
    backgroundColor: '#007bff',
  },
  button_text: {
    color: 'white',
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
