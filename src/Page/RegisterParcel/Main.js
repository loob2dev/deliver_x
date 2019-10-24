import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import { Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ProviderPropType } from 'react-native-maps';
import Toast from 'react-native-easy-toast';
import { connect } from 'react-redux';

import colors from '../../config/colors';
import { register_new_request, get_request } from '../../redux/actions/CallApiAction';

import Sender from './Sender';
import Parcels from './Parcels';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { sendingNewRequest: false };
  }

  updateData = (data, info) => {
    console.log(info, data);
    if (info.isParcel) {
      this.parcels.updateData(data, info);
    } else {
      this.sender.updateData(data);
    }
  };

  add_parcel = () => {
    this.parcels.add_parcel();
  };

  removeParcel = index => {
    this.parcels.removeParcel();
  };

  sendTransportRequest = () => {
    console.log('new transport request', this.state);
    try {
      this.setState({ sendingNewRequest: true }, async () => {
        let error_cnt = 0;
        const body = await this.sender.collectFields();
        if (body == null) {
          error_cnt++;
        }
        const items = await this.parcels.collectFields();
        if (items.length === 0) {
          error_cnt++;
        }
        if (error_cnt > 0) {
          console.log('toast', this.toast);
          this.refs.toast.show('Please, insert all fields.', 3500);
          this.setState({ sendingNewRequest: false });

          return;
        } else {
          body.items = items;
          console.log('new transport request', body);

          const dispatch = this.props.dispatch;
          try {
            await dispatch(register_new_request(body));
            await dispatch(get_request(this.props.transport_request_dto.id));
            this.refs.toast.show('Success', 3500);
            this.format();
            this.props.navigation.navigate('RegisterDetail', { scrollToDown: true });
          } catch (error) {
            console.log;
            this.refs.toast.show('Failed', 3500);
          }
        }
        this.setState({ sendingNewRequest: false });
      });
    } catch (error) {
      console.error('transport request error', error);
    }
  };

  format() {
    this.sender.format();
    this.parcels.format();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Register transport request', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="menu" style={styles.icon} onPress={() => this.props.navigation.openDrawer()} />
            </View>
          }
        />
        <Toast
          ref="toast"
          style={styles.white}
          position="top"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={styles.toast}
        />
        <KeyboardAwareScrollView enabledOnAndroid enableResetScrollToCoords={false}>
          <Sender {...this.props} onRef={ref => (this.sender = ref)} />
          <Divider />
          <Parcels {...this.props} onRef={ref => (this.parcels = ref)} />
          <View style={styles.row}>
            <View style={styles.col}>
              <TouchableOpacity
                style={[styles.buttonContainer, styles.button]}
                onPress={() => {
                  this.add_parcel();
                }}>
                <Text style={styles.lable_button}>Add parcel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.col}>
              <TouchableOpacity
                disabled={this.state.sendingNewRequest}
                style={[styles.buttonContainer, styles.button]}
                onPress={() => {
                  this.sendTransportRequest();
                }}>
                {this.state.sendingNewRequest && <ActivityIndicator size="small" color={'#fff'} />}
                {!this.state.sendingNewRequest && <Text style={styles.lable_button}>Send transport request</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

Main.propTypes = {
  provider: ProviderPropType,
};

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
  container: {
    flex: 1,
  },
  map: {
    height: 300,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 50,
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 7,
    marginRight: 7,
  },
  buttonContainer: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
  },
  error: {
    color: 'red',
  },
  lable_button: {
    color: 'white',
  },
});

const mapStatetoProps = ({ geolocation: { coords, geo_code }, register_parcel: { transport_request_dto } }) => ({
  coords,
  geo_code,
  transport_request_dto,
});
export default connect(mapStatetoProps)(Main);
