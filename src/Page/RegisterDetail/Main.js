import React, { Component } from 'react';
import { View, StyleSheet, PixelRatio, Platform } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import { Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import colors from '../../config/colors';
import Sender from './Sender';
import Parcels from './Parcels';
import WholeRoute from './WholeRoute';
import TransporterInfo from './TransporterInfo';
import DeliveryStatus from './DeliveryStatus';

class Main extends Component {
  componentDidMount() {
    if (this.props.navigation.state.params.scrollToDown) {
      setTimeout(() => {
        this.scroll.props.scrollToEnd(true);
      }, 500);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Request Detail', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
            </View>
          }
        />
        <KeyboardAwareScrollView
          enabledOnAndroid
          enableResetScrollToCoords={false}
          innerRef={ref => {
            this.scroll = ref;
          }}>
          <Sender {...this.props} onRef={ref => (this.sender = ref)} />
          <Divider style={styles.divider} />
          <Parcels {...this.props} onRef={ref => (this.parcels = ref)} />
          <Divider style={styles.divider} />
          {this.props.transport_request_dto.status >= 10 && <WholeRoute {...this.props} onRef={ref => (this.wholeRoute = ref)} />}
          <Divider style={styles.divider} />
          {this.props.transport_request_dto.status >= 40 && <TransporterInfo {...this.props} onRef={ref => (this.transporterInfo = ref)} />}
          <Divider style={styles.divider} />
          {this.props.transport_request_dto.status >= 50 && <DeliveryStatus {...this.props} onRef={ref => (this.deliverStatus = ref)} />}
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
  container: {
    flex: 1,
  },
  map: {
    height: 300,
  },
  borderContainer: {
    paddingBottom: 30,
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
  textfield: {
    height: 28,
    marginTop: 32,
  },
  textfieldWithFloatingLabel: {
    height: 48,
    marginTop: 10,
  },
  subTitle: {
    margin: 10,
    color: '#6a737d',
    fontSize: 25,
    fontWeight: 'bold',
  },
  labelStyle: {
    color: '#8f9396',
    fontSize: 15,
    fontWeight: 'normal',
  },
  inputStyle: {
    color: '#495057',
    fontSize: 17,
    fontWeight: 'normal',
  },
  label_data: {
    color: '#7d8690',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 18,
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
  mapButton_show: {
    backgroundColor: '#007bff',
  },
  mapButton_hide: {
    backgroundColor: '#6c757d',
  },
  addressButton: {
    backgroundColor: '#007bff',
  },
  save_addressContainer: {
    height: 38,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 20,
  },
  lable_button: {
    color: 'white',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
  container_geo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
  },
  deleteButtonContainer: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  divider: {
    marginBottom: 10,
    marginTop: 20,
  },
});

const mapStatetoProps = ({ register_parcel: { transport_request_dto } }) => ({
  transport_request_dto,
});
export default connect(mapStatetoProps)(Main);
