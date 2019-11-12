import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import { Toast } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';

import keys from '../../config/api_keys';
import api from '../../config/api';
import { auth_get } from '../../utils/httpRequest';
import { accept_transport_request_by_client, get_request } from '../../redux/actions/CallApiAction';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TIME = 30 * 1000;
let timer = null;

class WholeRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirming: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    timer = setInterval(async () => {
      await this.props.dispatch(get_request(this.props.transport_request_dto.id));
    }, TIME);
    console.log('wholeroute');
  }

  componentWillUnmount() {
    this.props.onRef(null);
    clearImmediate(timer);
  }

  confirmOrder = async id => {
    this.setState({ isConfirming: true });
    const token = this.props.person_info.token;
    try {
      const response = await auth_get(api.accept_transport_request_by_client + id, token);
      const url = response.paymentUrl;
      this.props.navigation.navigate('GoPay', { url: url, id: id });
    } catch (error) {
      Toast.show({ text: 'Failure' });
    }
    this.setState({ isConfirming: false });
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
        <Text style={styles.subTitle}>Whole Route</Text>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: this.props.transport_request_dto.senderLatitude,
            longitude: this.props.transport_request_dto.senderLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker
            coordinate={{
              latitude: this.props.transport_request_dto.senderLatitude,
              longitude: this.props.transport_request_dto.senderLongitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          />
          {destinations.map((item, index) => {
            return (
              <MapViewDirections
                origin={origin}
                destination={item}
                key={index}
                strokeWidth={2}
                strokeColor="blue"
                optimizeWaypoints={true}
                apikey={Platform.OS === 'ios' ? keys.google_map_ios : keys.google_map_android}
              />
            );
          })}
          {destinations.map((item, index) => {
            return (
              <Marker
                key={index}
                pinColor="blue"
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
              />
            );
          })}
        </MapView>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="Total distance" disabled={true} value={this.props.transport_request_dto.totalDistance.toString()} />
          </View>
          <View style={styles.col}>
            <Input label="Total price" disabled={true} value={this.props.transport_request_dto.totalPrice.toString()} />
          </View>
        </View>
        {this.props.transport_request_dto.status < 20 && (
          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity
              disabled={this.state.isConfirming}
              style={styles.confirmButton}
              onPress={() => {
                this.confirmOrder(this.props.transport_request_dto.id);
              }}>
              {this.state.isConfirming && <ActivityIndicator size="small" color={'#fff'} />}
              {!this.state.isConfirming && <Text style={styles.button_text}>Confirm Order</Text>}
            </TouchableOpacity>
          </View>
        )}
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
    marginTop: 10,
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
  subTitle: {
    margin: 10,
    color: '#6a737d',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

const mapStatetoProps = ({ register_parcel: { transport_request_dto }, login: { person_info } }) => ({
  transport_request_dto,
  person_info,
});
export default connect(mapStatetoProps)(WholeRoute);
