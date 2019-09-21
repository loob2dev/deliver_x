import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Picker, 
  Image, 
  PixelRatio, 
  Dimensions,
  Button,
  PermissionsAndroid,
  Platform,
  ToastAndroid
} from 'react-native';
import { Header, CheckBox, Input, Divider, Card } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker'
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGeocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import publicIP from 'react-native-public-ip';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import colors from '../../config/colors';
import key from '../../config/api_keys';
import api from '../../config/api';
import ProgressScreen from '../Refer/ProgressScreen';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;


class RegisterParcel extends Component {
    watchId = null;

    constructor(props){
        super(props)
        this.state = {
          isLoading: true,
          date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
          avatarSource: null,
          sender_coords: {
            latitude: 37.78825 + SPACE,
            longitude: -122.4324 + SPACE,
            LATITUDE: 37.78825,
            LONGITUDE: -122.4324
          },
          parcel_coords: {
            latitude: 37.78825 + SPACE,
            longitude: -122.4324 + SPACE,
            LATITUDE: 37.78825,
            LONGITUDE: -122.4324
          },
          isShowSenderMap: false,
          isShowParcelMap: false,
          loading: false,
          updatesEnabled: false,
          location: {},
          sender_address_name: null,
          sender_email: null,
          sender_phone: null,
          sender_street: null,
          sender_street_nr: null,
          sender_city: null,
          sender_postal_code: null,
          sender_country: null,

          parcel_address_name: null,
          parcel_email: null,
          parcel_phone: null,
          parcel_street: null,
          parcel_street_nr: null,
          parcel_city: null,
          parcel_postal_code: null,
          parcel_country: null,
        }
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
      }

      componentDidMount() {
        this.getLocation(() => {
          this.setState({
            isLoading: false
          }, () => {
            this.getLocationUpdates()
          })
        });
      }

      map_sender_log(eventName, e) {
        console.log(eventName, e.nativeEvent);
        if (eventName == "onSelect") {
          this.setState({
          sender_coords: {
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude
          }
          }, () => {
            console.log(eventName, this.state.sender_coords);
            this.getGeoCode_sender(() => {
              this.getGeoCode_parcel();
            });
          })
        }
      }

      map_parcel_log(eventName, e) {
        console.log(eventName, e.nativeEvent);
        if (eventName == "onSelect") {
          this.setState({
          parcel_coords: {
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude
          }
          }, () => {
            console.log(eventName, this.state.sender_coords);
            this.getGeoCode_sender(() => {
              this.getGeoCode_parcel();
            });
          })
        }
      }

      hasLocationPermission = async () => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
          return true;
        }

        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
      }

      getLocation = async (callback) => {
        const hasLocationPermission = await this.hasLocationPermission();

        if (!hasLocationPermission) return;

        this.setState({ loading: true }, () => {
          Geolocation.getCurrentPosition(
            (position) => {
              this.setState({ location: position, loading: false });
              this.setState({
                sender_coords: {
                  latitude : position.coords.latitude,
                  longitude : position.coords.longitude,
                  LATITUDE : position.coords.latitude,
                  LONGITUDE : position.coords.longitude
                },
                parcel_coords: {
                  latitude : position.coords.latitude,
                  longitude : position.coords.longitude,
                  LATITUDE : position.coords.latitude,
                  LONGITUDE : position.coords.longitude
                }
              })
              this.getGeoCode_sender(() => {
                this.getGeoCode_parcel(() => {
                  callback();
                });
              });              
            },
            (error) => {
              this.setState({ location: error, loading: false });
              console.log(error);
              publicIP()
              .then(ip => {
                console.log(ip);
                Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios):
                                      Geocoder.init(key.google_map_android);
                fetch(api.ipStack + ip + "?access_key=" + key.ip_stack)
                .then((response) => response.json())
                .then((responseJson) => {                  
                  this.setState({
                    sender_coords: {
                      latitude : responseJson.latitude,
                      longitude : responseJson.longitude,
                      LATITUDE : responseJson.latitude,
                      LONGITUDE : responseJson.longitude
                    },
                    parcel_coords: {
                      latitude : responseJson.latitude,
                      longitude : responseJson.longitude,
                      LATITUDE : responseJson.latitude,
                      LONGITUDE : responseJson.longitude
                    }
                  }, () => {
                    this.getGeoCode_sender(() => {
                      this.getGeoCode_parcel(() => {
                        callback();
                      });
                    });   
                  })
                })
                .catch((error) => {
                  console.error(error);
                });
              });
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, distanceFilter: 50, forceRequestLocation: true }
          );
        });
      }

      getGeoCode_sender = async (callback) => {
        console.log(this.state.sender_coords);
        Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios):
                                RNGeocoder.fallbackToGoogle(key.google_map_android);
        RNGeocoder.geocodePosition({lat: this.state.sender_coords.latitude, lng: this.state.sender_coords.longitude}).then(res => {
          console.log("geocoding", res);
          res.forEach((item, index) => {
            this.setState({
              sender_address_name : item.formattedAddress != null ? item.formattedAddress : null,
              sender_email: null,
              sender_phone: null,
              sender_street: item.streetName != null ? item.streetName : null,
              sender_street_nr: item.streetNumber != null ? item.streetNumber: null,
              sender_city: item.locality != null ? item.locality : null,
              sender_postal_code: item.postalCode != null ? item.postalCode : null,
              sender_country: item.country != null ? item.country : null,
              })
            if (index + 1 === res.length){
                Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios):
                                        Geocoder.init(key.google_map_android);
                Geocoder.from(this.state.sender_coords.latitude, this.state.sender_coords.longitude)
                .then(json => {
                  console.log(json)
                  json.results.forEach((array_component) => {
                    array_component.types.forEach((type, index) => {
                      if (type == 'country') {
                        this.setState({
                          sender_country: array_component.formatted_address
                        })
                      }
                      if (type == 'street_address') {
                        array_component.address_components.forEach((item_address) => {
                          item_address.types.forEach((type) => {
                            if (type == "postal_code") {
                              this.setState({
                                sender_postal_code: item_address.long_name
                              })
                            }
                          })
                        })
                      }
                  })
                });
              })
              .catch(error => console.warn(error));
            }
          })
          callback();
        })        
      }

      getGeoCode_parcel = async (callback) => {
        console.log(this.state.parcel_coords);
        Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios):
                                RNGeocoder.fallbackToGoogle(key.google_map_android);
        RNGeocoder.geocodePosition({lat: this.state.parcel_coords.latitude, lng: this.state.parcel_coords.longitude}).then(res => {
          console.log("geocoding_parcel", res);
          res.forEach((item, index) => {
            this.setState({
              parcel_address_name : item.formattedAddress != null ? item.formattedAddress : null,
              parcel_email: null,
              parcel_phone: null,
              parcel_street: item.streetName != null ? item.streetName : null,
              parcel_street_nr: item.streetNumber != null ? item.streetNumber: null,
              parcel_city: item.locality != null ? item.locality : null,
              parcel_postal_code: item.postalCode != null ? item.postalCode : null,
              parcel_country: item.country != null ? item.country : null,
              })
            if (index + 1 === res.length){
                Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios):
                                        Geocoder.init(key.google_map_android);
                Geocoder.from(this.state.parcel_coords.latitude, this.state.parcel_coords.longitude)
                .then(json => {
                  console.log(json)
                  json.results.forEach((array_component) => {
                    array_component.types.forEach((type, index) => {
                      if (type == 'country') {
                        this.setState({
                          parcel_country: array_component.formatted_address
                        })
                      }
                      if (type == 'street_address') {
                        array_component.address_components.forEach((item_address) => {
                          item_address.types.forEach((type) => {
                            if (type == "postal_code") {
                              this.setState({
                                parcel_postal_code: item_address.long_name
                              })
                            }
                          })
                        })
                      }
                  })
                });
              })
              .catch(error => console.warn(error));
            }
          })
          callback();
        })        
      }

      getLocationUpdates = async () => {
        const hasLocationPermission = await this.hasLocationPermission();

        if (!hasLocationPermission) return;

        this.setState({ updatesEnabled: true }, () => {
          this.watchId = Geolocation.watchPosition(
              (position) => {
                // this.setState({ location: position });
                console.log("upldate_location", position);
                return fetch(api.update_last_Location + position.coords.latitude + "/" + position.coords.longitude);
              },
              (error) => {
                // this.setState({ location: error });
                console.log(error);
              },
              { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000 }
          );
        });
      }

      removeLocationUpdates = () => {
          if (this.watchId !== null) {
              Geolocation.clearWatch(this.watchId);
              this.setState({ updatesEnabled: false })
          }
      }


    selectPhotoTapped() {
      const options = {
        quality: 1.0,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
        },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    });
  }


    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="settings" style={{ fontSize: 24, color: tintColor }} />
        )
    }


    showSenderMap = () => {
        this.setState({isShowSenderMap: !this.state.isShowSenderMap})
      }

    showParcelMap = () => {
        this.setState({isShowParcelMap: !this.state.isShowParcelMap})
      }

    render () {
        if (this.state.isLoading) {
          return <ProgressScreen/>
        }
        let countries = [{
          value: 'Czech',
        }, {
          value: 'Slovak',
        }];
        let parcel_types = [{
            value: 'Large'
        },{
            value: 'Normal'
        }];
        let currencies = [{
            value: 'CZK'
        },{
            value: 'EUR'
        }];
        const { loading, location, updatesEnabled } = this.state;
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
                    centerComponent={{ text: 'Register transport request', style: { color: '#fff' } }}
                    leftComponent={<Icon name="menu" style={{ color: '#fff' }} onPress={() => this.props.navigation.openDrawer()} />}
                />
               <KeyboardAwareScrollView enabledOnAndroid>
                <View style={styles.borderContainer}>                
                    <Text style={styles.subTitle}>
                        Sender
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <TouchableOpacity style={[styles.buttonContainer, this.state.isShowSenderMap ? styles.mapButton_hide : styles.mapButton_show]} onPress={() => this.showSenderMap()}>
                          {
                            this.state.isShowSenderMap &&
                            <Text style={styles.lable_button}>Hide map</Text>
                          }
                          {
                            !this.state.isShowSenderMap &&
                            <Text style={styles.lable_button}>Show map</Text>
                          }
                        </TouchableOpacity>
                      </View>
                      <View style={styles.col}>
                        <TouchableOpacity style={[styles.buttonContainer, styles.addressButton]}>
                          <Text style={styles.lable_button}>Address book</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {
                      this.state.isShowSenderMap &&
                      <Card containerStyle={{padding: 0}}>
                        <GooglePlacesAutocomplete
                          placeholder='Search'
                          minLength={2} // minimum length of text to search
                          autoFocus={false}
                          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                          listViewDisplayed='auto'    // true/false/undefined
                          fetchDetails={true}
                          renderDescription={row => row.description} // custom description render
                          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            this.setState({                              
                              sender_coords: {
                                latitude : details.geometry.location.lat,
                                longitude : details.geometry.location.lng,
                                LATITUDE : details.geometry.location.lat,
                                LONGITUDE : details.geometry.location.lng
                              },
                            }, () => {this.getGeoCode_sender()})
                          }}

                          getDefaultValue={() => ''}

                          query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: Platform.OS === 'ios' ? key.google_map_ios: key.google_map_android,
                            language: 'en', // language of the results
                            types: '(cities)' // default: 'geocode'
                          }}

                          styles={{
                            textInputContainer: {
                              width: '100%'
                            },
                            description: {
                              fontWeight: 'bold'
                            },
                            predefinedPlacesDescription: {
                              color: '#1faadb'
                            }
                          }}
                          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                          GoogleReverseGeocodingQuery={{
                            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                          }}
                          GooglePlacesSearchQuery={{
                            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            rankby: 'distance',
                            type: 'cafe'
                          }}
                          
                          GooglePlacesDetailsQuery={{
                            // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                            fields: 'formatted_address',
                          }}

                          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          

                          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                          
                        />
                        <MapView
                          provider={this.props.provider}
                          style={styles.map}
                          initialRegion={{
                            latitude: this.state.sender_coords.latitude,
                            longitude: this.state.sender_coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                          }}
                        >
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
                        </Card>
                      }
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='Address Name/ID'
                            value={this.state.sender_address_name}
                            onChangeText={(sender_address_name) => this.setState({sender_address_name})}
                         />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='E-mail'
                            keyboardType="email-address"
                            value={this.state.sender_email}
                            onChangeText={(sender_email) => this.setState({sender_email})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Phone'
                            keyboardType="numeric"
                            value={this.state.sender_phone}
                            onChangeText={(sender_phone) => this.setState({sender_phone})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='Street'
                            value={this.state.sender_street}
                            onChangeText={(sender_street) => this.setState({sender_street})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Nr.'
                            keyboardType="numeric"
                            value={this.state.sender_street_nr}
                            onChangeText={(sender_street_nr) => this.setState({sender_street_nr})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='City'
                            value={this.state.sender_city}
                            onChangeText={(sender_city) => this.setState({sender_city})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='Postal Code'
                            keyboardType="numeric"
                            value={this.state.sender_postal_code}
                            onChangeText={(sender_postal_code) => this.setState({sender_postal_code})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Country'
                            value={this.state.sender_country}
                            onChangeText={(sender_country) => this.setState({sender_country})}
                        />
                      </View>
                    </View>
                    <Text style={styles.subTitle}>
                        GPS
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.col}>
                         <Input
                            placeholder='Longitude'
                            keyboardType="numeric"
                            value={this.state.sender_coords.longitude.toString()}
                            onChangeText={(longitude) => parseFloat(longitude) > 0 && 
                              this.setState({
                                sender_coords : {
                                  longitude: parseFloat(longitude),
                                  latitude: this.state.sender_coords.latitude,
                                  LATITUDE: parseFloat(longitude) - SPACE,
                                  LONGITUDE: this.state.sender_coords.LONGITUDE
                                }
                              })}
                        />
                      </View>
                      <View style={styles.col}>
                         <Input
                            placeholder='Latitude'
                            keyboardType="numeric"
                            value={this.state.sender_coords.latitude.toString()}
                            onChangeText={(latitude) => parseFloat(latitude) > 0 && this.setState({
                              sender_coords : {
                                longitude: this.state.sender_coords.longitude,
                                latitude:  parseFloat(latitude),
                                LATITUDE: this.state.sender_coords.LATITUDE,
                                LONGITUDE: parseFloat(latitude) - SPACE
                              }
                            })}
                        />
                      </View>
                    </View>
                    <Text style={styles.label_data}>
                        Loading Time
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.col}>
                         <DatePicker
                            style={{width: 200}}
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate="2016-01-01"
                            maxDate="2050-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0,
                              },
                              dateInput: {
                                marginLeft: 36,
                                borderLeftWidth: 0,
                                borderRightWidth: 0,
                                borderTopWidth: 0,
                                borderHight: 2
                              }
                              // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                          />
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]}>
                            <Text style={styles.lable_button}>Save address</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                  <Divider style={{ backgroundColor: '#000' }} />
                  <View style={styles.borderContainer}>                
                    <Text style={styles.subTitle}>
                        Parcel #1
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <TouchableOpacity style={[styles.buttonContainer, this.state.isShowParcelMap ? styles.mapButton_hide : styles.mapButton_show]} onPress={() => this.showParcelMap()}>
                          {
                            this.state.isShowParcelMap &&
                            <Text style={styles.lable_button}>Hide map</Text>
                          }
                          {
                            !this.state.isShowParcelMap &&
                            <Text style={styles.lable_button}>Show map</Text>
                          }
                        </TouchableOpacity>
                      </View>
                      <View style={styles.col}>
                        <TouchableOpacity style={[styles.buttonContainer, styles.addressButton]}>
                          <Text style={styles.lable_button}>Address book</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {
                      this.state.isShowParcelMap &&
                      <Card containerStyle={{padding: 0}}>
                        <MapView
                          provider={this.props.provider}
                          style={styles.map}
                          initialRegion={{
                            latitude: this.state.parcel_coords.LATITUDE,
                            longitude: this.state.parcel_coords.LONGITUDE,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                          }}
                        >
                          <Marker
                            coordinate={this.state.sender_coords}
                            onSelect={e => this.map_parcel_log('onSelect', e)}
                            onDrag={e => this.map_parcel_log('onDrag', e)}
                            onDragStart={e => this.map_parcel_log('onDragStart', e)}
                            onDragEnd={e => this.map_parcel_log('onDragEnd', e)}
                            onPress={e => this.map_parcel_log('onPress', e)}
                            draggable
                          />
                        </MapView>
                        </Card>
                      }
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='Address Name/ID'
                            value={this.state.parcel_address_name}
                            onChangeText={(parcel_address_name) => this.setState({parcel_address_name})}
                         />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='E-mail'
                            keyboardType="email-address"
                            value={this.state.parcel_email}
                            onChangeText={(parcel_email) => this.setState({parcel_email})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Phone'
                            keyboardType="numeric"
                            value={this.state.parcel_phone}
                            onChangeText={(parcel_phone) => this.setState({parcel_phone})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='Street'
                            value={this.state.parcel_street}
                            onChangeText={(parcel_street) => this.setState({parcel_street})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Nr.'
                            keyboardType="numeric"
                            value={this.state.parcel_street_nr}
                            onChangeText={(parcel_street_nr) => this.setState({parcel_street_nr})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='City'
                            value={this.state.parcel_city}
                            onChangeText={(parcel_city) => this.setState({parcel_city})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='Postal Code'
                            keyboardType="numeric"
                            value={this.state.parcel_postal_code}
                            onChangeText={(parcel_postal_code) => this.setState({parcel_postal_code})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Country'
                            value={this.state.parcel_country}
                            onChangeText={(parcel_country) => this.setState({parcel_country})}
                        />
                      </View>
                    </View>
                    <Text style={styles.subTitle}>
                        GPS
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.col}>
                         <Input
                            placeholder='Longitude'
                            keyboardType="numeric"
                            value={this.state.parcel_coords.longitude.toString()}
                            onChangeText={(longitude) => parseFloat(longitude) > 0 && 
                              this.setState({
                                parcel_coords : {
                                  longitude: parseFloat(longitude),
                                  latitude: this.state.parcel_coords.latitude,
                                  LATITUDE: parseFloat(longitude) - SPACE,
                                  LONGITUDE: this.state.parcel_coords.LONGITUDE
                                }
                              })}
                        />
                      </View>
                      <View style={styles.col}>
                         <Input
                            placeholder='Latitude'
                            keyboardType="numeric"
                            value={this.state.parcel_coords.latitude.toString()}
                            onChangeText={(latitude) => parseFloat(latitude) > 0 && this.setState({
                              parcel_coords : {
                                longitude: this.state.parcel_coords.longitude,
                                latitude:  parseFloat(latitude),
                                LATITUDE: this.state.parcel_coords.LATITUDE,
                                LONGITUDE: parseFloat(latitude) - SPACE
                              }
                            })}
                        />
                      </View>
                    </View>
                    <Text style={styles.label_data}>
                        Loading Time
                    </Text>
                    <View style={styles.row}>
                      <View style={styles.col}>
                         <DatePicker
                            style={{width: 200}}
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate="2016-01-01"
                            maxDate="2050-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0,
                              },
                              dateInput: {
                                marginLeft: 36,
                                borderLeftWidth: 0,
                                borderRightWidth: 0,
                                borderTopWidth: 0,
                                borderHight: 2
                              }
                              // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                          />
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]}>
                            <Text style={styles.lable_button}>Save address</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                      <Picker
                          selectedValue={this.state.country}
                          style={{height: 50, width: 100, margin: 10}}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({country: itemValue})
                          }>
                          <Picker.Item label="Czech" value="Czech" />
                          <Picker.Item label="Slovak" value="Slovak" />
                      </Picker>
                      <Picker
                          selectedValue={this.state.parcel_type}
                          style={{height: 50, width: 100, margin: 10}}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({parcel_type: itemValue})
                          }>
                          <Picker.Item label="Large" value="Large" />
                          <Picker.Item label="Normal" value="Normal" />
                      </Picker>
                      <Picker
                          selectedValue={this.state.currency}
                          style={{height: 50, width: 100, margin: 10}}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({currency: itemValue})
                          }>
                          <Picker.Item label="CZK" value="CZK" />
                          <Picker.Item label="EUR" value="EUR" />
                      </Picker>
                    </View>
                    <View style={{marginLeft: 20, marginRight: 20, marginTop: 120}}>
                        <CheckBox
                          title='Insurance'
                          checked={this.state.insurance}
                          onPress={() => this.setState({insurance: !this.state.insurance})}
                        />
                    </View>
                  </View>
                  <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <View
                      style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
                      {this.state.avatarSource === null ? (
                        <Text>Select a Photo</Text>
                      ) : (
                        <Image style={styles.avatar} source={this.state.avatarSource} />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.col}>
                     <Input
                     placeholder='ParcelPrice'
                      keyboardType="numeric"/>
                  </View>
                  <View style={styles.row}>
                      <View style={styles.col}>                  
                        <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]}>
                            <Text style={styles.lable_button}>Add parcel</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.col}>
                        <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]}>
                            <Text style={styles.lable_button}>Send transport request</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </KeyboardAwareScrollView>
              </View>
        );
    }
}

RegisterParcel.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
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
        marginTop: 10
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 7, marginRight: 7,
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
        fontSize: 20,
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
        color: '#007bff',
        fontSize: 15,
        fontWeight: 'normal',
        marginTop: 30,
        marginLeft: 25
      },
      buttonContainer: {
        height:38,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
      },
      mapButton_show: {
        backgroundColor: "#007bff",
      },
      mapButton_hide: {
        backgroundColor: "#6c757d",
      },
      addressButton: {
        backgroundColor: "#007bff",
      },
      save_addressContainer: {
        height:38,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        margin: 20,
      },
      lable_button: {
        color: 'white',
      },
      textfield: {
        height: 48,
        marginTop: 10,
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
        paddingHorizontal: 12
      },
      result: {
          borderWidth: 1,
          borderColor: '#666',
          width: '100%',
          paddingHorizontal: 16
      },
      buttons: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginVertical: 12,
          width: '100%'
      }
});

export default RegisterParcel;
