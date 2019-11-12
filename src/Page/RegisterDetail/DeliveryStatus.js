import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { Input } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import { getDeliveryStatus } from '../../utils/deliveryStatus';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class DeliveryStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: [],
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  render() {
    const items = this.props.transport_request_dto.items;
    return (
      <View style={styles.container}>
        <Text style={styles.subTitle}>Delivery Status</Text>
        {items.map((item, index) => {
          console.log(item, index);
          return (
            <Container key={index}>
              <MapView
                provider={this.props.provider}
                style={styles.map}
                initialRegion={{
                  latitude: item.receiverLatitude,
                  longitude: item.receiverLongitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}>
                <Marker
                  coordinate={{
                    latitude: item.receiverLatitude,
                    longitude: item.receiverLongitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}
                />
              </MapView>
              <View style={styles.row}>
                <Input label="Parcel#" disabled={true} value={(index + 1).toString()} />
              </View>
              <View style={styles.row}>
                <Input label="E-mail" disabled={true} value={item.receiverEmail} />
              </View>
              <View style={styles.row}>
                <Input label="Address" disabled={true} value={item.receiverAddressID} />
              </View>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Input label="Status" disabled={true} value={getDeliveryStatus(item.deliveryStatus)} />
                </View>
                <View style={styles.col}>
                  <Input label="Delivery Code" disabled={true} value={item.secretDeliveryCode} />
                </View>
              </View>
            </Container>
          );
        })}
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
    padding: 10,
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
export default connect(mapStatetoProps)(DeliveryStatus);
