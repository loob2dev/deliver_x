import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PixelRatio, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MapView, { Marker } from 'react-native-maps';
import RNGeocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Toast } from 'native-base';
import { connect } from 'react-redux';

import colors from '../config/colors';
import key from '../config/api_keys';
import ProgressScreen from './ProgressScreen';
import { add_address } from '../redux/actions/CallApiAction';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const error_message = 'It is required.';
const error_mail = 'Email is Not Correct.';

class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      coords: {
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude,
        LATITUDE: this.props.coords.latitude + SPACE,
        LONGITUDE: this.props.coords.longitude + SPACE,
      },
      isShowMap: true,
      loading: false,
      address_name: this.props.geo_code.address_name,
      email: null,
      phone: null,
      street: this.props.geo_code.street,
      street_nr: this.props.geo_code.street_nr,
      city: this.props.geo_code.city,
      postal_code: this.props.geo_code.postal_code,
      country: this.props.geo_code.country,
    };
  }

  map_log(eventName, e) {
    if (eventName === 'onDragEnd') {
      this.setState(
        {
          coords: {
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude,
          },
          isLoading: true,
        },
        () => {
          this.getGeoCode(() => {
            this.setState({ isLoading: false });
          });
        }
      );
    }
  }

  getGeoCode = async callback => {
    Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios) : RNGeocoder.fallbackToGoogle(key.google_map_android);
    RNGeocoder.geocodePosition({ lat: this.state.coords.latitude, lng: this.state.coords.longitude }).then(res => {
      res.forEach((item, index) => {
        this.setState({
          address_name: item.formattedAddress != null ? item.formattedAddress : null,
          email: null,
          phone: null,
          street: item.streetName != null ? item.streetName : null,
          street_nr: item.streetNumber != null ? item.streetNumber : null,
          city: item.locality != null ? item.locality : null,
          postal_code: item.postalCode != null ? item.postalCode : null,
          country: item.country != null ? item.country : null,
        });
        if (index + 1 === res.length) {
          Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios) : Geocoder.init(key.google_map_android);
          Geocoder.from(this.state.coords.latitude, this.state.coords.longitude)
            .then(json => {
              json.results.forEach(array_component => {
                array_component.types.forEach(type => {
                  if (type === 'country') {
                    this.setState({
                      country: array_component.formatted_address,
                    });
                  }
                  if (type === 'street_address') {
                    array_component.address_components.forEach(item_address => {
                      item_address.types.forEach(type_address => {
                        if (type_address === 'postal_code') {
                          this.setState({
                            postal_code: item_address.long_name,
                          });
                        }
                      });
                    });
                  }
                });
              });
            })
            .catch(error => console.warn(error));
        }
      });
      callback();
    });
  };

  autocompleteAddrrss = (data, details) => {
    this.setState(
      {
        coords: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          LATITUDE: details.geometry.location.lat + SPACE,
          LONGITUDE: details.geometry.location.lng + SPACE,
        },
        isShowMap: false,
      },
      () => {
        this.getGeoCode(() => {
          this.setState({ isShowMap: true });
        });
      }
    );
  };

  saveAddress = () => {
    console.log('saveAddress', this.state);
    this.setState({ savingAddress: true }, async () => {
      let error_cnt = 0;
      if (this.state.address_name == null || this.state.address_name === '') {
        error_cnt++;
      }
      if (this.state.city == null || this.state.city === '') {
        error_cnt++;
      }
      if (this.state.street == null || this.state.street === '') {
        error_cnt++;
      }
      if (this.state.street_nr == null || this.state.street_nr === '') {
        error_cnt++;
      }
      if (this.state.postal_code == null || this.state.postal_code === '') {
        error_cnt++;
      }
      if (this.state.phone == null || this.state.phone === '') {
        error_cnt++;
      }
      if (this.state.email == null || this.state.error_mail === true) {
        error_cnt++;
      }
      if (error_cnt > 0) {
        this.setState({ savingAddress: false });
        Toast.show({ text: 'Please insert all fields of this parcel.', duration: 3000 });

        return;
      }

      const dispatch = this.props.dispatch;
      try {
        await dispatch(
          add_address([
            {
              addressID: this.state.address_name,
              city: this.state.city,
              street: this.state.street,
              houseNr: this.state.street_nr,
              zip: this.state.postal_code,
              latitude: this.state.coords.latitude,
              longitude: this.state.coords.longitude,
              phone: this.state.phone,
              email: this.state.email,
            },
          ])
        );
        Toast.show({ text: 'Success' });
        this.setState({ savingAddress: false });
      } catch (error) {
        this.setState({ savingAddress: false });
        Toast.show({ text: 'Failure' });
      }
    });
  };

  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState(state => {
      state.error_mail = reg.test(text) ? false : true;

      return state;
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Header
            backgroundColor={colors.headerColor}
            containerStyle={styles.header_container}
            centerComponent={{ text: 'Add Address', style: { color: '#fff' } }}
            leftComponent={
              <View style={styles.icon_container}>
                <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
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
          centerComponent={{ text: 'Add Address', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
            </View>
          }
        />
        <KeyboardAwareScrollView enabledOnAndroid enableResetScrollToCoords={false}>
          <View style={styles.borderContainer}>
            <View>
              <GooglePlacesAutocomplete
                placeholder="Search"
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed="false" // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  this.autocompleteAddrrss(data, details);
                }}
                getDefaultValue={() => ''}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: Platform.OS === 'ios' ? key.google_map_ios : key.google_map_android,
                  language: 'en', // language of the results
                }}
                styles={{
                  textInputContainer: {
                    width: '100%',
                  },
                  description: {
                    fontWeight: 'bold',
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={
                  {
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  }
                }
                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  type: 'cafe',
                }}
                GooglePlacesDetailsQuery={{
                  // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                  fields: 'formatted_address',
                }}
                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              />
              {this.state.isShowMap && (
                <MapView
                  provider={this.props.provider}
                  style={styles.map}
                  initialRegion={{
                    latitude: this.state.coords.latitude,
                    longitude: this.state.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                  }}>
                  <Marker
                    coordinate={this.state.coords}
                    onSelect={e => this.map_log('onSelect', e)}
                    onDrag={e => this.map_log('onDrag', e)}
                    onDragStart={e => this.map_log('onDragStart', e)}
                    onDragEnd={e => this.map_log('onDragEnd', e)}
                    onPress={e => this.map_log('onPress', e)}
                    draggable
                  />
                </MapView>
              )}
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Address Name/ID"
                  value={this.state.address_name}
                  errorStyle={styles.error}
                  errorMessage={this.state.address_name == null || this.state.address_name === '' ? error_message : ''}
                  onChangeText={address_name => this.setState({ address_name })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="E-mail"
                  keyboardType="email-address"
                  value={this.state.email}
                  errorStyle={styles.error}
                  errorMessage={this.state.email == null || this.state.email === '' || this.state.error_mail ? error_mail : ''}
                  onChangeText={email => {
                    this.setState({ email });
                    this.validateEmail(email);
                  }}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Phone"
                  keyboardType="numeric"
                  value={this.state.phone}
                  errorStyle={styles.error}
                  errorMessage={this.state.phone == null || this.state.phone === '' ? error_message : ''}
                  onChangeText={phone => this.setState({ phone })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Street"
                  value={this.state.street}
                  errorStyle={styles.error}
                  errorMessage={this.state.street == null || this.state.street === '' ? error_message : ''}
                  onChangeText={street => this.setState({ street })}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Nr."
                  keyboardType="numeric"
                  value={this.state.street_nr}
                  errorStyle={styles.error}
                  errorMessage={this.state.street_nr == null || this.state.street_nr === '' ? error_message : ''}
                  onChangeText={street_nr => this.setState({ street_nr })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="City"
                  value={this.state.city}
                  errorStyle={styles.error}
                  errorMessage={this.state.city == null || this.state.city === '' ? error_message : ''}
                  onChangeText={city => this.setState({ city })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Postal Code"
                  keyboardType="numeric"
                  value={this.state.postal_code}
                  errorStyle={styles.error}
                  errorMessage={this.state.postal_code == null || this.state.postal_code === '' ? error_message : ''}
                  onChangeText={postal_code => this.setState({ postal_code })}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Country"
                  value={this.state.country}
                  errorStyle={styles.error}
                  errorMessage={this.state.country == null || this.state.country === '' ? error_message : ''}
                  onChangeText={country => this.setState({ country })}
                />
              </View>
            </View>
            <Text style={styles.subTitle}>GPS</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Longitude"
                  keyboardType="numeric"
                  disabled={true}
                  value={this.state.coords.longitude.toString()}
                  onChangeText={longitude =>
                    parseFloat(longitude) > 0 &&
                    this.setState(
                      {
                        coords: {
                          longitude: parseFloat(longitude),
                          latitude: this.state.coords.latitude,
                          LATITUDE: parseFloat(longitude) - SPACE,
                          LONGITUDE: this.state.coords.LONGITUDE,
                        },
                        isShowMap: false,
                      },
                      () => {
                        this.setState({ isShowMap: true });
                      }
                    )
                  }
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Latitude"
                  keyboardType="numeric"
                  disabled={true}
                  value={this.state.coords.latitude.toString()}
                  onChangeText={latitude =>
                    parseFloat(latitude) > 0 &&
                    this.setState({
                      coords: {
                        longitude: this.state.coords.longitude,
                        latitude: parseFloat(latitude),
                        LATITUDE: this.state.coords.LATITUDE + SPACE,
                        LONGITUDE: parseFloat(latitude) + SPACE,
                      },
                    })
                  }
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <TouchableOpacity
                  disabled={this.state.savingAddress}
                  style={[styles.buttonContainer, styles.addressButton]}
                  onPress={() => {
                    this.saveAddress();
                  }}>
                  {this.state.savingAddress && <ActivityIndicator size="small" color={'#fff'} />}
                  {!this.state.savingAddress && <Text style={styles.lable_button}>Save address</Text>}
                </TouchableOpacity>
              </View>
            </View>
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
  error: {
    color: 'red',
  },
  toast: {
    backgroundColor: '#000',
  },
  toastText: {
    color: 'white',
    fontSize: 15,
  },
});

const mapStatetoProps = ({ geolocation: { coords, geo_code }, countries, parcels, currencies, register_parcel: { addresses } }) => ({
  coords,
  geo_code,
  countries,
  parcels,
  currencies,
  addresses,
});
export default connect(mapStatetoProps)(AddAddress);
