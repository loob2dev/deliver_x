import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ActivityIndicator, Linking } from 'react-native';
import { Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { connect } from 'react-redux';

import keys from '../../config/api_keys';
import { accept_transport_request_by_client } from '../../redux/actions/CallApiAction';

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
        await dispatch(accept_transport_request_by_client(id));
        const url = this.props.transport_request_dto.paymentUrl;
        this.refs.toast.show('Success.', 3500);
        console.log('payment url', url);
        Linking.openURL(url);
      } catch (error) {
        console.log('confirm order', error);
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
        <Text style={styles.subTitle}>WholeRoute</Text>
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
                strokeWidth={1}
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
        {this.props.transport_request_dto.status === 10 && (
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

const mapStatetoProps = ({ register_parcel: { transport_request_dto } }) => ({
  transport_request_dto,
});
export default connect(mapStatetoProps)(WholeRoute);
