import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PixelRatio, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import RNGeocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Content, Toast } from 'native-base';
import { connect } from 'react-redux';

import colors from '../../config/colors';
import key from '../../config/api_keys';
import { getDeviceType } from '../../utils/deviceType';
import { add_address } from '../../redux/actions/CallApiAction';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const error_msg = 'It is required.';
const error_email_msg = 'Email is Not Correct';

class Sender extends Component {
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  constructor(props) {
    super(props);

    this.state = {
      sender_coords: {
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude,
        LATITUDE: this.props.coords.latitude + SPACE,
        LONGITUDE: this.props.coords.longitude + SPACE,
      },
      sender_address_name: this.props.geo_code.address_name,
      sender_email: null,
      sender_phone: null,
      sender_street: this.props.geo_code.street,
      sender_street_nr: this.props.geo_code.street_nr,
      sender_city: this.props.geo_code.city,
      sender_postal_code: this.props.geo_code.postal_code,
      sender_country: this.props.geo_code.country,
      sender_date: new Date(),

      isSenderLoading: false,
      listViewDisplayed_sender: false,
      savingSenderAddress: false,
      isShowSenderMapContainer: false,
      isShowSenderMap: true,
      loading: false,
      updatesEnabled: false,
    };
  }

  format() {
    this.setState({
      sender_coords: {
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude,
        LATITUDE: this.props.coords.latitude + SPACE,
        LONGITUDE: this.props.coords.longitude + SPACE,
      },
      sender_address_name: this.props.geo_code.address_name,
      sender_email: null,
      sender_phone: null,
      sender_street: this.props.geo_code.street,
      sender_street_nr: this.props.geo_code.street_nr,
      sender_city: this.props.geo_code.city,
      sender_postal_code: this.props.geo_code.postal_code,
      sender_country: this.props.geo_code.country,
      sender_date: new Date(),

      isSenderLoading: false,
      listViewDisplayed_sender: false,
      savingSenderAddress: false,
      isShowSenderMapContainer: false,
      isShowSenderMap: true,
      loading: false,
      updatesEnabled: false,
    });
  }

  updateData = data => {
    this.setState({ isSenderLoading: true });
    setTimeout(() => {
      this.setState({
        sender_address_name: data.addressID,
        sender_country: data.country,
        sender_city: data.city,
        sender_email: data.email,
        sender_street_nr: data.houseNr,
        sender_coords: {
          latitude: data.latitude,
          longitude: data.longitude,
          LATITUDE: data.latitude + SPACE,
          LONGITUDE: data.longitude,
        },
        sender_phone: data.phone,
        sender_street: data.street,
        sender_postal_code: data.zip,

        isSenderLoading: false,
        listViewDisplayed_sender: false,
        isShowSenderMapContainer: false,
        isShowSenderMap: true,
        loading: false,
        updatesEnabled: false,
        sender_date: new Date(),
      });
    }, 1000);
  };

  map_sender_log(eventName, e) {
    if (eventName === 'onDragEnd') {
      this.setState(
        {
          sender_coords: {
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude,
          },
          isSenderLoading: true,
        },
        () => {
          this.getGeoCode_sender(() => {
            this.setState({ isSenderLoading: false });
          });
        }
      );
    }
  }

  getGeoCode_sender = async callback => {
    Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios) : RNGeocoder.fallbackToGoogle(key.google_map_android);
    RNGeocoder.geocodePosition({ lat: this.state.sender_coords.latitude, lng: this.state.sender_coords.longitude }).then(res => {
      console.log(res);
      res.forEach((item, index) => {
        this.setState({
          sender_address_name: item.formattedAddress != null ? item.formattedAddress : this.state.sender_address_name,
          sender_email: this.state.sender_email,
          sender_phone: this.state.sender_phone,
          sender_street: item.streetName != null ? item.streetName : this.state.sender_street,
          sender_street_nr: item.streetNumber != null ? item.streetNumber : this.state.sender_street_nr,
          sender_city: item.locality != null ? item.locality : this.state.sender_city,
          sender_postal_code: item.postalCode != null ? item.postalCode : this.state.sender_postal_code,
          sender_country: item.country != null ? item.country : this.state.sender_country,
        });
        if (index + 1 === res.length) {
          Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios) : Geocoder.init(key.google_map_android);
          Geocoder.from(this.state.sender_coords.latitude, this.state.sender_coords.longitude).then(json => {
            json.results.forEach(array_component => {
              array_component.types.forEach(type => {
                if (type === 'country') {
                  this.setState({
                    sender_country: array_component.formatted_address,
                  });
                }
                if (type === 'street_address') {
                  array_component.address_components.forEach(item_address => {
                    item_address.types.forEach(type_address => {
                      if (type_address === 'postal_code') {
                        this.setState({
                          sender_postal_code: item_address.long_name,
                        });
                      }
                    });
                  });
                }
              });
            });
          });
        }
      });
      callback();
    });
  };

  showSenderMap = () => {
    this.setState({ isShowSenderMapContainer: !this.state.isShowSenderMapContainer });
  };

  showAdderss = info => {
    this.props.navigation.navigate('Address', {
      info: info,
      updateData: this.updateData,
    });
  };

  saveSenderAddress = () => {
    this.setState({ savingSenderAddress: true }, async () => {
      let error_cnt = 0;
      if (this.state.sender_address_name == null || this.state.sender_address_name === '') {
        error_cnt++;
      }
      if (this.state.sender_city == null || this.state.sender_city === '') {
        error_cnt++;
      }
      if (this.state.sender_street == null || this.state.sender_street === '') {
        error_cnt++;
      }
      if (this.state.sender_street_nr == null || this.state.sender_street_nr === '') {
        error_cnt++;
      }
      if (this.state.sender_postal_code == null || this.state.sender_postal_code === '') {
        error_cnt++;
      }
      if (this.state.sender_phone == null || this.state.sender_phone === '') {
        error_cnt++;
      }
      if (this.state.sender_email == null || this.state.sender_email === '' || this.state.error_email) {
        error_cnt++;
      }
      if (error_cnt > 0) {
        this.setState({ savingSenderAddress: false });
        Toast.show({ text: 'Please insert all fields of a sender.', duration: 3000 });
        console.log(this.state);

        return;
      }
      try {
        const dispatch = this.props.dispatch;
        await dispatch(
          add_address([
            {
              addressID: this.state.sender_address_name,
              city: this.state.sender_city,
              street: this.state.sender_street,
              houseNr: this.state.sender_street_nr,
              zip: this.state.sender_postal_code,
              latitude: this.state.sender_coords.latitude,
              longitude: this.state.sender_coords.longitude,
              phone: this.state.sender_phone,
              email: this.state.sender_email,
            },
          ])
        );
        Toast.show({ text: 'Success' });
        this.setState({ savingAddress: false });
      } catch (error) {
        this.setState({ savingAddress: false });
        Toast.show({ text: 'Failure' });
        console.log(error);
      }
      this.setState({ savingSenderAddress: false });
    });
  };

  autocompleteSenderAddrrss = (data, details) => {
    this.setState(
      {
        isSenderLoading: true,
        sender_coords: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          LATITUDE: details.geometry.location.lat + SPACE,
          LONGITUDE: details.geometry.location.lng + SPACE,
        },
        isShowSenderMap: false,
      },
      () => {
        this.getGeoCode_sender(() => {
          this.setState({ isSenderLoading: false, isShowSenderMap: true });
        });
      }
    );
  };

  validateEmail = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState(state => {
      state.error_email = reg.test(text) ? false : true;

      return state;
    });
  };

  collectFields = () => {
    let error_cnt = 0;

    if (this.state.sender_address_name == null || this.state.sender_address_name === '') {
      error_cnt++;
    }
    if (this.state.sender_city == null || this.state.sender_city === '') {
      error_cnt++;
    }
    if (this.state.sender_street == null || this.state.sender_street === '') {
      error_cnt++;
    }
    if (this.state.sender_street_nr == null || this.state.sender_street_nr === '') {
      error_cnt++;
    }
    if (this.state.sender_postal_code == null || this.state.sender_postal_code === '') {
      error_cnt++;
    }
    if (this.state.sender_country == null || this.state.sender_country === '') {
      error_cnt++;
    }
    if (this.state.sender_email == null || this.state.sender_email === '' || this.state.error_email) {
      error_cnt++;
    }
    if (this.state.sender_phone == null || this.state.sender_phone === '') {
      error_cnt++;
    }

    if (error_cnt > 0) {
      return null;
    }

    var body = {
      // "id": "string",
      senderAddressID: this.state.sender_address_name,
      senderCity: this.state.sender_city,
      senderStreet: this.state.sender_street,
      senderHouseNr: this.state.sender_street_nr,
      senderZip: this.state.sender_postal_code,
      senderCountry: this.state.sender_country,
      senderLatitude: this.state.sender_coords.latitude,
      senderLongitude: this.state.sender_coords.longitude,
      requestedLoadingTime: this.state.sender_date,
      senderEmail: this.state.sender_email,
      senderPhone: this.state.sender_phone,
      deviceID: this.props.person_info.deviceID,
      deviceType: getDeviceType(Platform.OS),
      // paymentUrl: "",
      // totalDistance: "",
      // totalPrice: "",
      // currency: {
      //   code: this.state.currencies[this.state.selectedCurrency].code,
      //   id: this.state.currencies[this.state.selectedCurrency].id,
      //   creator: this.state.currencies[this.state.selectedCurrency].creator,
      //   created: this.state.currencies[this.state.selectedCurrency].created,
      //   owner: this.state.currencies[this.state.selectedCurrency].owner
      // },
      // transporter: {
      //   id: "string",
      //   firstName: "",
      //   lastName: "",
      //   mobilePhoneNr: "",
      //   licencePlate: "",
      //   latitude: 0,
      //   longitude: 0
      // },
      // routePolyline: "",
      // loadAcceptedByOwner: "",
      // loadAcceptedByTransporter: "",
      // status: 0,
      // loadConfirmedByOwner: true,
      // navigationRouteLink: "string",
      // created: "2019-09-25T11:24:35.514Z"
    };

    return body;
  };

  render() {
    return (
      <Content padder style={styles.borderContainer}>
        <Text style={styles.subTitle}>Sender</Text>
        {this.state.isSenderLoading && (
          <View style={styles.container_progress}>
            <ActivityIndicator size="large" color={colors.progress} />
          </View>
        )}
        {!this.state.isSenderLoading && (
          <View>
            <View style={styles.row}>
              <View style={styles.col}>
                <TouchableOpacity
                  style={[styles.buttonContainer, this.state.isShowSenderMapContainer ? styles.mapButton_hide : styles.mapButton_show]}
                  onPress={() => this.showSenderMap()}>
                  {this.state.isShowSenderMapContainer && <Text style={styles.lable_button}>Hide map</Text>}
                  {!this.state.isShowSenderMapContainer && <Text style={styles.lable_button}>Show map</Text>}
                </TouchableOpacity>
              </View>
              <View style={styles.col}>
                <TouchableOpacity
                  style={[styles.buttonContainer, styles.addressButton]}
                  onPress={() => this.showAdderss({ isParcel: false, index: null })}>
                  <Text style={styles.lable_button}>Address book</Text>
                </TouchableOpacity>
              </View>
            </View>
            {this.state.isShowSenderMapContainer && (
              <View>
                <GooglePlacesAutocomplete
                  placeholder="Search"
                  minLength={2} // minimum length of text to search
                  autoFocus={false}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                  listViewDisplayed={this.state.listViewDisplayed_sender} // true/false/undefined
                  fetchDetails={true}
                  renderDescription={row => row.description} // custom description render
                  textInputProps={{
                    onFocus: () => this.setState({ listViewDisplayed_sender: true }),
                  }}
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    this.setState({ listViewDisplayed_sender: false });
                    this.autocompleteSenderAddrrss(data, details);
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
                {this.state.isShowSenderMap && (
                  <MapView
                    provider={this.props.provider}
                    style={styles.map}
                    initialRegion={{
                      latitude: this.state.sender_coords.latitude,
                      longitude: this.state.sender_coords.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}>
                    <Marker
                      coordinate={this.state.sender_coords}
                      onSelect={e => this.map_sender_log('onSelect', e)}
                      onDrag={e => this.map_sender_log('onDrag', e)}
                      onDragStart={e => this.map_sender_log('onDragStart', e)}
                      onDragEnd={e => this.map_sender_log('onDragEnd', e)}
                      onPress={e => this.map_sender_log('onPress', e)}
                      draggable
                    />
                  </MapView>
                )}
              </View>
            )}
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Address Name/ID"
                  value={this.state.sender_address_name}
                  errorStyle={styles.error}
                  errorMessage={this.state.sender_address_name == null || this.state.sender_address_name === '' ? error_msg : ''}
                  onChangeText={sender_address_name => this.setState({ sender_address_name })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="E-mail"
                  keyboardType="email-address"
                  value={this.state.sender_email}
                  errorStyle={styles.error}
                  errorMessage={
                    this.state.sender_email == null || this.state.sender_email === '' || this.state.error_email ? error_email_msg : ''
                  }
                  onChangeText={sender_email => {
                    this.setState({ sender_email });
                    this.validateEmail(sender_email);
                  }}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Phone"
                  keyboardType="numeric"
                  value={this.state.sender_phone}
                  errorStyle={styles.error}
                  errorMessage={this.state.sender_phone == null || this.state.sender_phone === '' ? error_msg : ''}
                  onChangeText={sender_phone => this.setState({ sender_phone })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Street"
                  value={this.state.sender_street}
                  errorMessage={this.state.sender_street == null || this.state.sender_street === '' ? error_msg : ''}
                  onChangeText={sender_street => this.setState({ sender_street })}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Nr."
                  keyboardType="numeric"
                  value={this.state.sender_street_nr}
                  errorStyle={styles.error}
                  errorMessage={this.state.sender_street_nr == null || this.state.sender_street_nr === '' ? error_msg : ''}
                  onChangeText={sender_street_nr => this.setState({ sender_street_nr })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="City"
                  value={this.state.sender_city}
                  errorStyle={styles.error}
                  errorMessage={this.state.sender_city == null || this.state.sender_city === '' ? error_msg : ''}
                  onChangeText={sender_city => this.setState({ sender_city })}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Postal Code"
                  keyboardType="numeric"
                  value={this.state.sender_postal_code}
                  errorStyle={styles.error}
                  errorMessage={this.state.sender_postal_code == null || this.state.sender_postal_code === '' ? error_msg : ''}
                  onChangeText={sender_postal_code => this.setState({ sender_postal_code })}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Country"
                  value={this.state.sender_country}
                  errorStyle={styles.error}
                  errorMessage={this.state.sender_country == null || this.state.sender_country === '' ? error_msg : ''}
                  onChangeText={sender_country => this.setState({ sender_country })}
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
                  value={this.state.sender_coords.longitude.toString()}
                  onChangeText={longitude =>
                    this.setState(
                      {
                        sender_coords: {
                          longitude: parseFloat(longitude),
                          latitude: this.state.sender_coords.latitude,
                          LATITUDE: parseFloat(longitude) - SPACE,
                          LONGITUDE: this.state.sender_coords.LONGITUDE,
                        },
                        isShowSenderMap: false,
                      },
                      () => {
                        this.setState({ isShowSenderMap: true });
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
                  value={this.state.sender_coords.latitude.toString()}
                  onChangeText={latitude =>
                    this.setState({
                      sender_coords: {
                        longitude: this.state.sender_coords.longitude,
                        latitude: parseFloat(latitude),
                        LATITUDE: this.state.sender_coords.LATITUDE + SPACE,
                        LONGITUDE: parseFloat(latitude) + SPACE,
                      },
                    })
                  }
                />
              </View>
            </View>
            <Text style={styles.label_data}>Loading Time</Text>
            <DateTimePicker
              value={this.state.sender_date}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                this.setState({ sender_date: date });
              }}
            />
            <View style={styles.savebutton_row}>
              <TouchableOpacity
                disabled={this.state.savingSenderAddress}
                style={[styles.save_addressContainer, styles.addressButton]}
                onPress={() => {
                  this.saveSenderAddress();
                }}>
                {this.state.savingSenderAddress && <ActivityIndicator size="small" color={'#fff'} />}
                {!this.state.savingSenderAddress && <Text style={styles.lable_button}>Save address</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Content>
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
  savebutton_row: {
    alignItems: 'flex-end',
  },
  save_addressContainer: {
    alignItems: 'center',
    height: 38,
    width: 150,
    justifyContent: 'center',
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
    marginBottom: 20,
    marginTop: 20,
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
  container_progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.subScreen,
    height: 300,
  },
  error: {
    color: 'red',
  },
  picker: {
    height: 50,
    width: 100,
    margin: 10,
  },
  instrunce: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 120,
  },
  dataPicker: {
    width: 200,
  },
  picker_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avata: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  avata_text: {
    color: 'red',
    fontSize: 12,
  },
  avata_button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginTop: { marginTop: 20 },
  marginBottom: { marginBottom: 20 },
});

const mapStatetoProps = ({ login: { person_info }, geolocation: { coords, geo_code }, countries, parcels, currencies }) => ({
  person_info,
  coords,
  geo_code,
  countries,
  parcels,
  currencies,
});
export default connect(mapStatetoProps)(Sender);
