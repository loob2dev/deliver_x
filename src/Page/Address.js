import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, PixelRatio, Platform, SafeAreaView } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Toast } from 'native-base';

import colors from '../config/colors';
import { delete_address } from '../redux/actions/CallApiAction';

class Address extends Component {
  deleteItem = async item => {
    const dispatch = this.props.dispatch;
    this.setState({ isLoading: true });
    try {
      await dispatch(delete_address([item.id]));
      Toast.show({ text: 'Success' });
    } catch (error) {
      Toast.show({ text: 'Failure' });
    }
    this.setState({ isLoading: false });
  };

  Item = ({ item }) => {
    return (
      <Card>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.pop();
            this.props.navigation.state.params.updateData(item, this.props.navigation.state.params.info);
          }}>
          <View style={styles.item_container}>
            <Text style={styles.label}>Address ID: </Text>
            <Text style={styles.value}>{item.addressID}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Street: </Text>
            <Text style={styles.value}>{item.street}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Nr.: </Text>
            <Text style={styles.value}>{item.houseNr}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>City: </Text>
            <Text style={styles.value}>{item.city}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Postal code: </Text>
            <Text style={styles.value}>{item.zip}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Phone: </Text>
            <Text style={styles.value}>{item.phone}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Latitude: </Text>
            <Text style={styles.value}>{item.latitude}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Longitude: </Text>
            <Text style={styles.value}>{item.longitude}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.deleteButtonContainer, styles.deleteButton]} onPress={() => this.deleteItem(item)}>
          <Text style={styles.lable_button}>Delete</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Address Book', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
            </View>
          }
        />
        <TouchableOpacity
          style={[styles.save_addressContainer, styles.addressButton]}
          onPress={() => this.props.navigation.navigate('AddAddress')}>
          <Text style={styles.lable_button}>Add address</Text>
        </TouchableOpacity>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={this.props.addresses}
            numColumns={1}
            renderItem={({ item }) => <this.Item item={item} />}
            keyExtractor={item => item.id}
          />
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
    padding: 2,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 20,
    marginLeft: 20,
  },
  lable_button: {
    color: 'white',
  },
  addressButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
  },
  deleteButtonContainer: {
    height: 38,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 20,
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
    margin: 20,
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
  save_addressContainer: {
    height: 38,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 20,
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
  toast: {
    backgroundColor: '#000',
  },
  toastText: {
    color: 'white',
    fontSize: 15,
  },
});

const mapStatetoProps = ({
  login: { person_info },
  geolocation: { coords, geo_code },
  countries,
  parcels,
  currencies,
  register_parcel: { addresses },
}) => ({
  person_info,
  coords,
  geo_code,
  countries,
  parcels,
  currencies,
  addresses,
});
export default connect(mapStatetoProps)(Address);
