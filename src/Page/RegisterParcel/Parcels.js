import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Picker, Image, PixelRatio, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import RNGeocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-easy-toast';
import { connect } from 'react-redux';

import colors from '../../config/colors';
import key from '../../config/api_keys';
import { add_address } from '../../redux/actions/CallApiAction';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const error_msg = 'It is required.';
const mail_error_msg = 'Email is Not Correct';

class Main extends Component {
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  constructor(props) {
    super(props);

    this.state = {
      parcels: [
        {
          parcel_address_name: this.props.geo_code.address_name,
          parcel_email: null,
          parcel_phone: null,
          parcel_street: this.props.geo_code.street,
          parcel_street_nr: this.props.geo_code.street_nr,
          parcel_city: this.props.geo_code.city,
          parcel_postal_code: this.props.geo_code.postal_code,
          parcel_country: this.props.geo_code.country,
          avatarSource: null,
          parcel_date: new Date(),
          coords: {
            latitude: this.props.coords.latitude,
            longitude: this.props.coords.longitude,
            LATITUDE: this.props.coords.latitude + SPACE,
            LONGITUDE: this.props.coords.longitude + SPACE,
          },

          isParcelLoading: false,
          listViewDisplayed: false,
          isShowParcelMapContainer: false,
          isShowParcelMap: true,
          isLoadingImage: false,
          savingParcelAddress: false,
          sendingNewRequest: false,
          selectedCountry: 0,
          selectedCurrency: 0,
          selectedParcelType: 0,
          insurance: true,
          parcel_price: '0',
        },
      ],
    };
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    console.log('state', this.state);
  }

  format() {
    this.setState({
      parcels: [
        {
          parcel_address_name: this.props.geo_code.address_name,
          parcel_email: null,
          parcel_phone: null,
          parcel_street: this.props.geo_code.street,
          parcel_street_nr: this.props.geo_code.street_nr,
          parcel_city: this.props.geo_code.city,
          parcel_postal_code: this.props.geo_code.postal_code,
          parcel_country: this.props.geo_code.country,
          avatarSource: null,
          parcel_date: new Date(),
          coords: {
            latitude: this.props.coords.latitude,
            longitude: this.props.coords.longitude,
            LATITUDE: this.props.coords.latitude + SPACE,
            LONGITUDE: this.props.coords.longitude + SPACE,
          },

          isParcelLoading: false,
          listViewDisplayed: false,
          isShowParcelMapContainer: false,
          isShowParcelMap: true,
          isLoadingImage: false,
          savingParcelAddress: false,
          sendingNewRequest: false,
          selectedCountry: 0,
          selectedCurrency: 0,
          selectedParcelType: 0,
          insurance: true,
          parcel_price: '0',
        },
      ],
    });
  }

  updateData = (data, info) => {
    this.setState(state => {
      var parcels = state.parcels;
      parcels[info.index].isParcelLoading = true;
      console.log(this.state);

      return parcels;
    });
    setTimeout(() => {
      this.setState(state => {
        var parcels = state.parcels;
        parcels[info.index] = {
          isParcelLoading: false,
          parcel_address_name: data.addressID,
          parcel_country: data.country,
          parcel_city: data.city,
          parcel_email: data.email,
          parcel_street_nr: data.houseNr,

          coords: {
            latitude: data.latitude,
            longitude: data.longitude,
            LATITUDE: data.latitude + SPACE,
            LONGITUDE: data.longitude,
          },
          parcel_phone: data.phone,
          parcel_street: data.street,
          parcel_postal_code: data.zip,

          listViewDisplayed: false,
          avatarSource: null,
          parcel_date: new Date(),
          isShowParcelMapContainer: false,
          isShowParcelMap: true,
          savingParcelAddress: false,
          sendingNewRequest: false,
          selectedCountry: 0,
          selectedCurrency: 0,
          selectedParcelType: 0,
          insurance: true,
          parcel_price: '0',
        };

        return parcels;
      });
    }, 50);
  };

  map_parcel_log(eventName, e, index) {
    if (eventName === 'onDragEnd') {
      console.log(index, e.nativeEvent.coordinate);
      var latitude = e.nativeEvent.coordinate.latitude;
      var longitude = e.nativeEvent.coordinate.longitude;
      this.setState(
        state => {
          var parcels = state.parcels;
          parcels[index].coords = {
            longitude: longitude,
            latitude: latitude,
          };
          parcels[index].isParcelLoading = true;

          return parcels;
        },
        () => {
          this.getGeoCode_parcel(index, () => {
            this.setState(state => {
              var parcels = state.parcels;
              parcels[index].isParcelLoading = false;

              return parcels;
            });
          });
        }
      );
    }
  }

  getGeoCode_parcel = async (index, callback) => {
    Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios) : RNGeocoder.fallbackToGoogle(key.google_map_android);
    RNGeocoder.geocodePosition({ lat: this.state.parcels[index].coords.latitude, lng: this.state.parcels[index].coords.longitude }).then(
      res => {
        console.log(index, res);
        res.forEach((item, i) => {
          this.setState(state => {
            var parcels = state.parcels;
            console.log(index, parcels[index]);
            parcels[index].parcel_address_name = item.formattedAddress != null ? item.formattedAddress : parcels[index].parcel_address_name;
            parcels[index].parcel_email = parcels[index].parcel_email;
            parcels[index].parcel_phone = parcels[index].parcel_phone;
            parcels[index].parcel_street = item.streetName != null ? item.streetName : parcels[index].parcel_street;
            parcels[index].parcel_street_nr = item.streetNumber != null ? item.streetNumber : parcels[index].parcel_street_nr;
            parcels[index].parcel_city = item.locality != null ? item.locality : parcels[index].parcel_city;
            parcels[index].parcel_postal_code = item.postalCode != null ? item.postalCode : parcels[index].parcel_postal_code;
            parcels[index].parcel_country = item.country != null ? item.country : parcels[index].parcel_country;

            console.log(parcels);

            return parcels;
          });
          if (i + 1 === res.length) {
            Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios) : Geocoder.init(key.google_map_android);
            Geocoder.from(this.state.parcels[index].coords.latitude, this.state.parcels[index].coords.longitude).then(json => {
              json.results.forEach(array_component => {
                array_component.types.forEach(type => {
                  if (type === 'country') {
                    this.setState(state => {
                      var parcels = this.state.parcels;
                      parcels[index].parcel_country = array_component.formatted_address;

                      return parcels;
                    });
                  }
                  if (type === 'street_address') {
                    array_component.address_components.forEach(item_address => {
                      item_address.types.forEach(type_address => {
                        if (type_address === 'postal_code') {
                          this.setState(state => {
                            var parcels = state.parcels;
                            parcels[index].parcel_postal_code = item_address.long_name;

                            return parcels;
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
      }
    );
  };

  selectPhotoTapped(index) {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
    this.setState(state => {
      var parcels = state.parcels;
      parcels[index].isLoadingImage = true;

      return parcels;
    });

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log('pick image', source);

        this.setState(state => {
          var parcels = state.parcels;
          parcels[index].avatarSource = source;

          return parcels;
        });
      }
      this.setState(state => {
        var parcels = state.parcels;
        parcels[index].isLoadingImage = false;

        return parcels;
      });
    });
  }

  showParcelMap = index => {
    this.setState(state => {
      var parcels = this.state.parcels;
      parcels[index].isShowParcelMapContainer = !parcels[index].isShowParcelMapContainer;

      return parcels;
    });
  };

  showAdderss = info => {
    this.props.navigation.navigate('Address', {
      info: info,
      updateData: this.updateData,
    });
  };

  add_parcel = () => {
    this.setState(state => {
      var parcels = state.parcels;
      parcels.push({
        listViewDisplayed: false,
        parcel_address_name: this.props.geo_code.address_name,
        parcel_email: null,
        parcel_phone: null,
        parcel_street: this.props.geo_code.street,
        parcel_street_nr: this.props.geo_code.street_nr,
        parcel_city: this.props.geo_code.city,
        parcel_postal_code: this.props.geo_code.postal_code,
        parcel_country: this.props.geo_code.country,
        avatarSource: null,
        parcel_date: new Date(),
        coords: {
          latitude: this.props.coords.latitude,
          longitude: this.props.coords.longitude,
          LATITUDE: this.props.coords.latitude + SPACE,
          LONGITUDE: this.props.coords.longitude + SPACE,
        },
        isShowParcelMapContainer: false,
        isShowParcelMap: true,
        isLoadingImage: false,
        savingSenderAddress: false,
        savingParcelAddress: false,
        sendingNewRequest: false,
        selectedCountry: 0,
        selectedCurrency: 0,
        selectedParcelType: 0,
        insurance: true,
        parcel_price: '0',
      });

      return parcels;
    });
  };

  removeParcel = index => {
    this.setState(state => {
      var parcels = this.state.parcels.splice(index, 1);

      return parcels;
    });
  };

  saveParcelAddress = item => {
    console.log('saveParceAddress', item);
    this.setState({ savingParcelAddress: true }, async () => {
      let error_cnt = 0;
      if (item.parcel_address_name == null || item.parcel_address_name === '') {
        error_cnt++;
      }
      if (item.parcel_city == null || item.parcel_city === '') {
        error_cnt++;
      }
      if (item.parcel_street == null || item.parcel_street === '') {
        error_cnt++;
      }
      if (item.parcel_street_nr == null || item.parcel_street_nr === '') {
        error_cnt++;
      }
      if (item.parcel_postal_code == null || item.parcel_postal_code === '') {
        error_cnt++;
      }
      if (item.parcel_phone == null || item.parcel_phone === '') {
        error_cnt++;
      }
      if (item.parcel_email == null || item.parcel_email === '' || item.error_mail) {
        error_cnt++;
      }
      if (error_cnt > 0) {
        this.setState({ savingParcelAddress: false });
        this.refs.toast.show('Please insert all fields of this parcel.', 3500);

        return;
      }
      try {
        const dispatch = this.props.dispatch;
        await dispatch(
          add_address([
            {
              addressID: item.parcel_address_name,
              city: item.parcel_city,
              street: item.parcel_street,
              houseNr: item.parcel_street_nr,
              zip: item.parcel_postal_code,
              latitude: item.coords.latitude,
              longitude: item.coords.longitude,
              phone: item.parcel_phone,
              email: item.parcel_email,
            },
          ])
        );
        this.refs.toast.show('Success', 3500);
        this.setState({ savingParcelAddress: false });
      } catch (error) {
        this.setState({ savingParcelAddress: false });
        this.refs.toast.show('Failed', 3500);
      }
      this.setState({ savingSenderAddress: false });
    });
  };

  autocompleteParcelAddrrss = (data, details, index) => {
    this.setState(
      state => {
        var parcels = state.parcels;
        parcels[index].coords = {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          LATITUDE: details.geometry.location.lat + SPACE,
          LONGITUDE: details.geometry.location.lng + SPACE,
        };
        parcels[index].isShowParcelMap = false;
        parcels[index].isParcelLoading = true;

        return parcels;
      },
      () => {
        this.getGeoCode_parcel(index, () => {
          this.setState(state => {
            var parcels = state.parcels;
            parcels[index].isShowParcelMap = true;
            parcels[index].isParcelLoading = false;

            return parcels;
          });
        });
      }
    );
  };

  validateEmail = (text, index) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    this.setState(state => {
      state[index].error_mail = reg.test(text) ? false : true;

      return state;
    });
  };

  collectFields = async () => {
    const items = [];
    let error_cnt = 0;
    await this.state.parcels.forEach((item, index) => {
      if (item.parcel_address_name == null || item.parcel_address_name === '') {
        error_cnt++;
      }
      if (item.parcel_city == null || item.parcel_city === '') {
        error_cnt++;
      }
      if (item.parcel_city == null || item.parcel_city === '') {
        error_cnt++;
      }
      if (item.parcel_street_nr == null || item.parcel_street_nr === '') {
        error_cnt++;
      }
      if (item.parcel_postal_code == null || item.parcel_postal_code === '') {
        error_cnt++;
      }
      if (item.parcel_phone == null || item.parcel_phone === '') {
        error_cnt++;
      }
      if (item.parcel_email == null || item.parcel_email === '' || item.error_mail) {
        error_cnt++;
      }
      if (item.parcel_price == null || item.parcel_price === '') {
        error_cnt++;
      }
      if (item.avatarSource == null || item.avatarSource === '') {
        error_cnt++;
      }
      if (error_cnt > 0) {
        return;
      }
      items.push({
        // id: null,
        receiverAddressID: item.parcel_address_name,
        receiverCity: item.parcel_city,
        receiverStreet: item.parcel_street,
        receiverHouseNr: item.parcel_street_nr,
        receiverZip: item.parcel_postal_code,
        receiverLatitude: item.coords.latitude,
        receiverLongitude: item.coords.longitude,
        requestedDeliveryTime: item.parcel_date,
        receiverPhone: item.parcel_phone,
        receiverEmail: item.parcel_email,
        parcelType: this.props.parcels[item.selectedParcelType].label,
        parcelValue: item.parcel_price,
        parcelValueCurrency: this.props.currencies[item.selectedCurrency].label,
        insuranceRequested: item.insurance,
        receiverCountry: this.props.countries[item.selectedCountry].label,
        parcelPicture: item.avatarSource.uri,
        // deliveryStatus: "",
        // deliveryOrder: "",
        currentLatitude: this.props.coords.latitude,
        currentLongitude: this.props.coords.longitude,
        // carriedByTransporter: {
        //   id: null,
        //   firstName: null,
        //   lastName: null,
        //   mobilePhoneNr: null,
        //   licencePlate: null,
        //   latitude: 0,
        //   longitude: 0
        // }
      });
    });

    return items;
  };

  render() {
    return (
      <View style={styles.container}>
        <Toast
          ref="toast"
          style={styles.white}
          position="bottom"
          positionValue={100}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={styles.toast}
        />
        {this.state.parcels.map((item, index) => {
          return (
            <View key={index}>
              <Text style={styles.subTitle}>Parcel #{index + 1}</Text>
              {item.isParcelLoading && (
                <View style={styles.container_progress}>
                  <ActivityIndicator size="large" color={colors.progress} />
                </View>
              )}
              {!item.isParcelLoading && (
                <View>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <TouchableOpacity
                        style={[styles.buttonContainer, item.isShowParcelMapContainer ? styles.mapButton_hide : styles.mapButton_show]}
                        onPress={() => this.showParcelMap(index)}>
                        {item.isShowParcelMapContainer && <Text style={styles.lable_button}>Hide map</Text>}
                        {!item.isShowParcelMapContainer && <Text style={styles.lable_button}>Show map</Text>}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.col}>
                      <TouchableOpacity
                        style={[styles.buttonContainer, styles.addressButton]}
                        onPress={() => this.showAdderss({ isParcel: true, index: index })}>
                        <Text style={styles.lable_button}>Address book</Text>
                      </TouchableOpacity>
                    </View>
                    {index > 0 && (
                      <View style={styles.col}>
                        <TouchableOpacity style={[styles.deleteButtonContainer, styles.deleteButton]} onPress={() => this.removeParcel(index)}>
                          <Text style={styles.lable_button}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {item.isShowParcelMapContainer && (
                    <View>
                      <GooglePlacesAutocomplete
                        placeholder="Search"
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                        listViewDisplayed={item.listViewDisplayed} // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        textInputProps={{
                          onFocus: () =>
                            this.setState(state => {
                              var parcels = state.parcels;
                              parcels[index].listViewDisplayed = true;

                              return parcels;
                            }),
                        }}
                        onPress={(data, details = null) => {
                          // 'details' is provided when fetchDetails = true
                          this.setState(state => {
                            var parcels = state.parcels;
                            parcels[index].listViewDisplayed = false;

                            return parcels;
                          });
                          this.autocompleteParcelAddrrss(data, details, index);
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
                      {item.isShowParcelMap && (
                        <MapView
                          provider={this.props.provider}
                          style={styles.map}
                          initialRegion={{
                            latitude: item.coords.latitude,
                            longitude: item.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                          }}>
                          <Marker
                            coordinate={item.coords}
                            onSelect={e => this.map_parcel_log('onSelect', e, index)}
                            onDrag={e => this.map_parcel_log('onDrag', e, index)}
                            onDragStart={e => this.map_parcel_log('onDragStart', e, index)}
                            onDragEnd={e => this.map_parcel_log('onDragEnd', e, index)}
                            onPress={e => this.map_parcel_log('onPress', e, index)}
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
                        value={item.parcel_address_name}
                        errorStyle={styles.error}
                        errorMessage={item.parcel_address_name == null || item.parcel_address_name === '' ? error_msg : ''}
                        onChangeText={parcel_address_name =>
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_address_name = parcel_address_name;

                            return parcels;
                          })
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Input
                        label="E-mail"
                        keyboardType="email-address"
                        value={item.parcel_email}
                        errorStyle={styles.error}
                        errorMessage={item.parcel_email == null || item.parcel_email === '' || item.error_mail ? mail_error_msg : ''}
                        onChangeText={parcel_email => {
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_email = parcel_email;

                            return parcels;
                          });
                          this.validateEmail(parcel_email, index);
                        }}
                      />
                    </View>
                    <View style={styles.col}>
                      <Input
                        label="Phone"
                        keyboardType="numeric"
                        value={item.parcel_phone}
                        errorStyle={styles.error}
                        errorMessage={item.parcel_phone == null || item.parcel_phone === '' ? error_msg : ''}
                        onChangeText={parcel_phone =>
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_phone = parcel_phone;

                            return parcels;
                          })
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Input
                        label="Street"
                        value={item.parcel_street}
                        errorStyle={styles.error}
                        errorMessage={item.parcel_street == null || item.parcel_street === '' ? error_msg : ''}
                        onChangeText={parcel_street =>
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_street = parcel_street;

                            return parcels;
                          })
                        }
                      />
                    </View>
                    <View style={styles.col}>
                      <Input
                        label="Nr."
                        keyboardType="numeric"
                        value={item.parcel_street_nr}
                        errorMessage={item.parcel_street_nr == null || item.parcel_street_nr === '' ? error_msg : ''}
                        onChangeText={parcel_street_nr =>
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_street_nr = parcel_street_nr;

                            return parcels;
                          })
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Input
                        label="City"
                        value={item.parcel_city}
                        errorStyle={styles.error}
                        errorMessage={item.parcel_city == null || item.parcel_city === '' ? error_msg : ''}
                        onChangeText={parcel_city =>
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_city = parcel_city;

                            return parcels;
                          })
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Input
                        label="Postal Code"
                        keyboardType="numeric"
                        value={item.parcel_postal_code}
                        errorStyle={styles.error}
                        errorMessage={item.parcel_postal_code == null || item.parcel_postal_code === '' ? error_msg : ''}
                        onChangeText={parcel_postal_code =>
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_postal_code = parcel_postal_code;

                            return parcels;
                          })
                        }
                      />
                    </View>
                    <View style={styles.col}>
                      <Input
                        label="Country"
                        value={item.parcel_country}
                        errorStyle={styles.error}
                        errorMessage={item.parcel_country == null || item.parcel_country === '' ? error_msg : ''}
                        onChangeText={parcel_country =>
                          this.setState(state => {
                            var parcels = this.state.parcels;
                            parcels[index].parcel_country = parcel_country;

                            return parcels;
                          })
                        }
                      />
                    </View>
                  </View>
                  <Text style={styles.subTitle}>GPS</Text>
                  <View style={styles.row}>
                    <View style={styles.col}>
                      <Input label="Longitude" keyboardType="numeric" disabled={true} value={item.coords.longitude.toString()} />
                    </View>
                    <View style={styles.col}>
                      <Input label="Latitude" keyboardType="numeric" disabled={true} value={item.coords.latitude.toString()} />
                    </View>
                  </View>
                  <Text style={styles.label_data}>Loading Time</Text>
                  <DateTimePicker
                    value={item.parcel_date}
                    mode="datetime"
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                      this.setState(state => {
                        var parcels = this.state.parcels;
                        parcels[index].parcel_date = date;

                        return parcels;
                      });
                    }}
                  />
                  <View style={styles.savebutton_row}>
                    <TouchableOpacity
                      disabled={this.state.savingParcelAddress}
                      style={[styles.save_addressContainer, styles.addressButton]}
                      onPress={() => this.saveParcelAddress(item)}>
                      {this.state.savingParcelAddress && <ActivityIndicator size="small" color={'#fff'} />}
                      {!this.state.savingParcelAddress && <Text style={styles.lable_button}>Save address</Text>}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.picker_container}>
                    <Picker
                      selectedValue={item.selectedParcelType}
                      style={styles.picker}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState(state => {
                          var parcels = this.state.parcels;
                          parcels[index].selectedParcelType = itemIndex;

                          return parcels;
                        })
                      }>
                      {this.props.parcels.map((item_parcel, index_parcel) => {
                        return <Picker.Item label={item_parcel.label} value={index_parcel} key={index_parcel} />;
                      })}
                    </Picker>
                    <Picker
                      selectedValue={item.selectedCurrency}
                      style={styles.picker}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState(state => {
                          var parcels = this.state.parcels;
                          parcels[index].selectedCurrency = itemIndex;

                          return parcels;
                        })
                      }>
                      {this.props.currencies.map((item_currency, index_currency) => {
                        return <Picker.Item label={item_currency.label} value={index_currency} key={index_currency} />;
                      })}
                    </Picker>
                  </View>
                  <View style={styles.instrunce}>
                    <CheckBox
                      title="Insurance"
                      checked={item.insurance}
                      onPress={() =>
                        this.setState(state => {
                          var parcels = state.parcels;
                          parcels[index].insurance = !item.insurance;

                          return parcels;
                        })
                      }
                    />
                  </View>
                  {item.avatarSource == null && (
                    <View style={styles.avata}>
                      <Text style={styles.avata_text}>Please, insert image.</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    disabled={item.isLoadingImage}
                    onPress={() => {
                      this.selectPhotoTapped(index);
                    }}
                    style={styles.avata_button}>
                    <View style={[styles.avatar, styles.avatarContainer]}>
                      {item.avatarSource === null ? <Text>Select a Photo</Text> : <Image style={styles.avatar} source={item.avatarSource} />}
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.col, styles.marginBottom]}>
                    <Input
                      label="ParcelPrice"
                      keyboardType="numeric"
                      value={item.parcel_price}
                      errorStyle={styles.error}
                      errorMessage={item.parcel_price == null || item.parcel_price === '' ? error_msg : ''}
                      onChangeText={parcel_price =>
                        this.setState(state => {
                          var parcels = this.state.parcels;
                          parcels[index].parcel_price = parcel_price;

                          return parcels;
                        })
                      }
                    />
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  }
}

Main.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
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
  subTitle: {
    margin: 10,
    color: '#6a737d',
    fontSize: 25,
    fontWeight: 'bold',
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
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    paddingHorizontal: 16,
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
export default connect(mapStatetoProps)(Main);
