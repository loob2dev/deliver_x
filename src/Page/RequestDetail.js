import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator, NativeModules } from 'react-native';
import { Header, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'native-base';
import { Toast } from 'native-base';

import colors from '../config/colors';
import { connect } from 'react-redux';

import { load_pachages, deliveried_pachage } from '../redux/actions/CallApiAction';

const error_msg = 'It is required.';

class RequestedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpening: false,
      isLoading: false,
      isDelivery: false,
      code: null,
    };
  }
  openNavigation = () => {
     let NavDelX = NativeModules.NavDelX;
            NavDelX.renderNaviDelX(
              (originLat = -37.8182668),
              (originLon = 144.9648731),
              (originName = 'Flinder Station'),
              (destinationLat = -37.8165647),
              (destinationLon = 144.9475055),
              (destinationName = 'Marvel Stadium')
            );
  };
  loadPachage = () => {
    if (this.props.transport_request_dto.transporter == null) {
      return;
    }
    this.setState({ isLoading: true }, async () => {
      const dispatch = this.props.dispatch;
      try {
        await dispatch(load_pachages(this.props.transport_request_dto.transporter.id));
        Toast.show({ text: 'Success' });
        this.setState({ isDelivery: false });
      } catch (error) {
        console.log('load_pachages', error);
        Toast.show({ text: 'Failure' });
        this.setState({ isDelivery: false });
      }
    });
    this.setState({ isLoading: false });
  };
  openRoute = () => {};
  deliveriedParcel = () => {
    const { code } = this.state;
    console.log(code);
    if (code == null || code === '') {
      Toast.show({ text: 'Please insert code', duration: 3000 });
      return;
    }
    this.setState({ isDelivery: true }, async () => {
      const dispatch = this.props.dispatch;
      try {
        await dispatch(deliveried_pachage(code));
        Toast.show({ text: 'Success' });
        this.setState({ isDelivery: false });
      } catch (error) {
        console.log('load_pachages', error);
        Toast.show({ text: 'Failure.', duration: 3000 });
        this.setState({ isDelivery: false });
      }
    });
  };
  render() {
    const { status } = this.props.transport_request_dto;
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Transport Request Detail', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
            </View>
          }
        />
        <KeyboardAwareScrollView enabledOnAndroid enableResetScrollToCoords={false}>
          <View>
            {status === 40 && (
              <View>
                <TouchableOpacity
                  disabled={this.state.isOpening}
                  style={styles.button}
                  onPress={() => {
                    this.openNavigation();
                  }}>
                  {this.state.isOpening && <ActivityIndicator size="small" color={'#fff'} />}
                  {!this.state.isOpening && <Text style={styles.button_text}>Open navigation to sender</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={this.state.isLoading}
                  style={styles.button}
                  onPress={() => {
                    this.loadPachage();
                  }}>
                  {this.state.isLoading && <ActivityIndicator size="small" color={'#fff'} />}
                  {!this.state.isLoading && <Text style={styles.button_text}>Parcels has been loaded</Text>}
                </TouchableOpacity>
              </View>
            )}
            {status === 50 && (
              <View>
                <Input
                  label="Delivery code from reciever"
                  value={this.state.code}
                  errorStyle={styles.error}
                  errorMessage={this.state.code == null || this.state.code === '' ? error_msg : ''}
                  onChangeText={code => this.setState({ code })}
                />
                <TouchableOpacity
                  disabled={this.state.isDelivery}
                  style={styles.button}
                  onPress={() => {
                    this.deliveriedParcel();
                  }}>
                  {this.state.isDelivery && <ActivityIndicator size="small" color={'#fff'} />}
                  {!this.state.isDelivery && <Text style={styles.button_text}>Parcel delivered</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={this.state.isLoading}
                  style={styles.button}
                  onPress={() => {
                    this.openRoute();
                  }}>
                  {this.state.isLoading && <ActivityIndicator size="small" color={'#fff'} />}
                  {!this.state.isLoading && <Text style={styles.button_text}>Open route</Text>}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
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
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
    padding: 10,
    backgroundColor: '#007bff',
  },
  button_text: {
    color: 'white',
  },
  error: {
    color: 'red',
  },
});

const mapStatetoProps = ({ register_parcel: { transport_request_dto } }) => ({
  transport_request_dto,
});
export default connect(mapStatetoProps)(RequestedRoute);
