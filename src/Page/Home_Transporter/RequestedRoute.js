import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import { Toast } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import keys from '../../config/api_keys';

import { accept_request, reject_request } from '../../redux/actions/CallApiAction';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class RequestedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirming: false,
      isDeclining: false,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  confirmOrder = id => {
    this.setState({ isConfirming: true }, async () => {
      const dispatch = this.props.dispatch;
      try {
        await dispatch(accept_request(id));
        Toast.show({ text: 'Success' });
        this.props.navigation.navigate('RequestDetail');
      } catch (error) {
        console.log('confirm order', error);
        Toast.show({ text: 'Failure' });
      }
      this.setState({ isConfirming: false });
    });
  };
  declineOrder = id => {
    this.setState({ isDeclining: true }, async () => {
      const dispatch = this.props.dispatch;
      try {
        await dispatch(reject_request(id));
        Toast.show({ text: 'Success' });
      } catch (error) {
        console.log('confirm order', error);
        Toast.show({ text: 'Failure' });
      }
      this.setState({ isDeclining: false });
    });
  };
  render() {
    const data = this.props.dataFromParent;
    const origin = { latitude: data.senderLatitude, longitude: data.senderLongitude };
    const destinations = [];
    data.items.forEach(element => {
      destinations.push({
        latitude: element.receiverLatitude,
        longitude: element.receiverLongitude,
      });
    });
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: data.senderLatitude,
            longitude: data.senderLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker
            coordinate={{
              latitude: data.senderLatitude,
              longitude: data.senderLongitude,
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
            <Input label="Total distance" disabled={true} value={data.totalDistance.toString()} />
          </View>
          <View style={styles.col}>
            <Input label="Total price" disabled={true} value={data.totalPrice.toString()} />
          </View>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            disabled={this.state.isDeclining}
            style={[styles.declineButton, styles.col]}
            onPress={() => {
              this.declineOrder(data.id);
            }}>
            {this.state.isDeclining && <ActivityIndicator size="small" color={'#fff'} />}
            {!this.state.isDeclining && <Text style={styles.button_text}>Decline Order</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.isConfirming}
            style={[styles.confirmButton, styles.col]}
            onPress={() => {
              this.confirmOrder(data.id);
            }}>
            {this.state.isConfirming && <ActivityIndicator size="small" color={'#fff'} />}
            {!this.state.isConfirming && <Text style={styles.button_text}>Confirm Order</Text>}
          </TouchableOpacity>
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
  declineButton: {
    height: 38,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 20,
    backgroundColor: '#dc3545',
  },
  button_text: {
    color: 'white',
  },
});

export default RequestedRoute;
