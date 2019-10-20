import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Header, Card } from 'react-native-elements';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import colors from '../config/colors';
import { getDeliveryStatus } from '../utils/requestStatus';

class RegisterHistory extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => <Icon name="list" style={{ fontSize: 24, color: tintColor }} />,
  };

  Item = ({ item }) => {
    return (
      <Card>
        <View style={styles.item_container}>
          <Text style={styles.label}>Created: </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('RequestDetail', { data: item })}>
            <Text style={[styles.value, { color: 'blue' }]}>{new Date(item.created).toLocaleString()}</Text>
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
});

const mapStatetoProps = ({ register_parcel: { requests } }) => ({
  requests,
});
export default connect(mapStatetoProps)(RegisterHistory);
