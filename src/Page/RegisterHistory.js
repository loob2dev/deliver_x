import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Header, Card } from 'react-native-elements';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import colors from '../config/colors';
import { getDeliveryStatus } from '../utils/requestStatus';

import { get_request } from '../redux/actions/CallApiAction';
import ProgressScreen from './ProgressScreen';

class RegisterHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  openDetail = async item => {
    this.setState({ isLoading: true });
    const dispatch = this.props.dispatch;
    await dispatch(get_request(item.id));
    this.props.navigation.navigate('RegisterDetail', { scrollToDown: false, id: item.id });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  };
  Item = ({ item }) => {
    return (
      <Card>
        <View style={styles.item_container}>
          <Text style={styles.label}>Created: </Text>
          <TouchableOpacity onPress={() => this.openDetail(item)}>
            <Text style={[styles.value, styles.detail_button]}>{new Date(item.created).toLocaleString()}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item_container}>
          <Text style={styles.label}>Address: </Text>
          <Text style={styles.value}>{item.senderStreet + item.senderHouseNr + ', ' + item.senderCity}</Text>
        </View>
        <View style={styles.item_container}>
          <Text style={styles.label}>E-mail: </Text>
          <Text style={styles.value}>{item.senderEmail}</Text>
        </View>
        <View style={styles.item_container}>
          <Text style={styles.label}>Status: </Text>
          <Text style={styles.value}>{getDeliveryStatus(item.status)}</Text>
        </View>
      </Card>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Header
            backgroundColor={colors.headerColor}
            containerStyle={styles.header_container}
            centerComponent={{ text: 'Request History', style: { color: '#fff' } }}
            leftComponent={
              <View style={styles.icon_container}>
                <Icon name="menu" style={styles.icon} onPress={() => this.props.navigation.openDrawer()} />
              </View>
            }
          />
          <ProgressScreen />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Request History', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="menu" style={styles.icon} onPress={() => this.props.navigation.openDrawer()} />
            </View>
          }
        />
        <SafeAreaView style={styles.container}>
          <FlatList data={this.props.requests} renderItem={({ item }) => <this.Item item={item} />} keyExtractor={item => item.id} />
        </SafeAreaView>
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
  item_container: {
    flexGrow: 1,
    margin: 5,
  },
  title: {
    fontSize: 32,
  },
  label: {
    width: 120,
    fontSize: 12,
  },
  value: {
    marginTop: 5,
    marginLeft: 35,
    fontSize: 15,
  },
  detail_button: {
    color: 'blue',
  },
});

const mapStatetoProps = ({ register_parcel: { requests } }) => ({
  requests,
});
export default connect(mapStatetoProps)(RegisterHistory);
