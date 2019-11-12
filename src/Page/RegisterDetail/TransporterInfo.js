import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class TransporterInfo extends Component {
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
    // this.setState({ isConfirming: true }, async () => {
    //   const dispatch = this.props.dispatch;
    //   try {
    //     await dispatch(accept_transport_request_by_client(id));
    //     const url = this.props.transport_request_dto.paymentUrl;
    //     Toast.show({ text: 'Success' });
    //     console.log('payment url', url);
    //     Linking.openURL(url);
    //   } catch (error) {
    //     console.log('confirm order', error);
    //     Toast.show({ text: 'Failure' });
    //   }
    //   this.setState({ isConfirming: false });
    // });
  };
  render() {
    const transporter = this.props.transport_request_dto.transporter;
    return (
      <View style={styles.container}>
        <Text style={styles.subTitle}>Transporter Information</Text>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: transporter.latitude,
            longitude: transporter.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker
            coordinate={{
              latitude: transporter.latitude,
              longitude: transporter.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          />
        </MapView>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="License plate" disabled={true} value={transporter.licencePlate} />
          </View>
          <View style={styles.col}>
            <Input label="Phone number" disabled={true} value={transporter.mobilePhoneNr} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="First name" disabled={true} value={transporter.firstName} />
          </View>
          <View style={styles.col}>
            <Input label="Last name" disabled={true} value={transporter.lastName} />
          </View>
        </View>
        {/* <View style={styles.confirmButtonContainer}>
          <TouchableOpacity
            disabled={this.state.isConfirming}
            style={styles.confirmButton}
            onPress={() => {
              this.confirmOrder(transporter.id);
            }}>
            {this.state.isConfirming && <ActivityIndicator size="small" color={'#fff'} />}
            {!this.state.isConfirming && <Text style={styles.button_text}>Confirm Pachages Hardover</Text>}
          </TouchableOpacity>
        </View> */}
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
export default connect(mapStatetoProps)(TransporterInfo);
