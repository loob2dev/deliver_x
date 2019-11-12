import React, { Component } from 'react';
import { View, StyleSheet, PixelRatio, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import { connect } from 'react-redux';

import colors from '../../config/colors';
import { WebView } from 'react-native-webview';
import { get_request } from '../../redux/actions/CallApiAction';

const targetUrl = 'https://taxiparcelportalreact.azurewebsites.net/request/';

class GoPay extends Component {
  componentDidMount() {
    if (this.props.navigation.state.params.scrollToDown) {
      setTimeout(() => {
        this.scroll.props.scrollToEnd(true);
      }, 500);
    }
  }

  onNavigationStateChange = async navState => {
    if (navState.url.includes(targetUrl)) {
      console.log('payment done');
      await this.props.dispatch(get_request(this.props.navigation.state.params.id));
      this.props.navigation.pop();
    }
  };

  render() {
    const url = this.props.navigation.state.params.url;
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
            </View>
          }
        />
        <WebView source={{ uri: url }} onNavigationStateChange={this.onNavigationStateChange} />
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

export default connect()(GoPay);
