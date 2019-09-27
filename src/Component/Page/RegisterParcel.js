import React, { Component } from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
  TouchableOpacity,
  Picker, 
  Image,
  Alert,
  PixelRatio, 
  Dimensions,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  ActivityIndicator
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
import Toast, {DURATION} from 'react-native-easy-toast'

import colors from '../../config/colors';
import key from '../../config/api_keys';
import api from '../../config/api';
import ProgressScreen from '../Refer/ProgressScreen';
import { getDeviceType } from "../../utils/deviceType";

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;


class RegisterParcel extends Component {

    constructor(props){
        super(props)

        this.state = {
          isLoading: true,
          isSenderLoading: false,
          listViewDisplayed_sender: false,
          savingSenderAddress: false,
          countries: [],
          parcel_types: [],
          currencies: [],
          sender_coords: {
            latitude: this.props.screenProps.latitude,
            longitude: this.props.screenProps.longitude,
            LATITUDE: this.props.screenProps.latitude + SPACE,
            LONGITUDE: this.props.screenProps.longitude + SPACE
          },
          isShowSenderMapContainer: false,
          isShowSenderMap: true,
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
          sender_date: new Date(),

          parcels: [{
            isParcelLoading: false,
            listViewDisplayed: false,
            parcel_address_name: null,
            parcel_email: null,
            parcel_phone: null,
            parcel_street: null,
            parcel_street_nr: null,
            parcel_city: null,
            parcel_postal_code: null,
            parcel_country: null,
            avatarSource : null,
            parcel_date: new Date(),
            coords: {
              latitude: this.props.screenProps.latitude,
              longitude: this.props.screenProps.longitude,
              LATITUDE: this.props.screenProps.latitude + SPACE,
              LONGITUDE: this.props.screenProps.longitude + SPACE
            },
            isShowParcelMapContainer: false,
            isShowParcelMap: true,            
            savingParcelAddress: false,
            sendingNewRequest: false,
            selectedCountry: 0,
            selectedCurrency: 0,
            selectedParcelType: 0,
            insurance : true,
            parcel_price: "0"
          }],          
        }
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
      }

      componentDidMount() {
        return fetch(api.get_all_countries, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json-patch+json',
            'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
          }})
        .then((response) => response.json(), {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json-patch+json',
            'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
          }})
        .then((responseJson) => {
            this.setState({countries: responseJson})
            console.log("countries", responseJson)

            return fetch(api.get_all_parcel_types, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json-patch+json',
              'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
            }})
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({parcel_types: responseJson})
                console.log("parcel_types", responseJson)

                return fetch(api.get_all_currencies, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json-patch+json',
                  'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
                }})
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({currencies: responseJson})
                    console.log("currencies", responseJson)

                    this.getGeoCode_sender(() => {
                    this.getGeoCode_parcel(0, () => {
                      this.setState({
                        isLoading: false
                      })
                    });
                  });  
                })
                .catch((error) => {
                   console.error(error);
                });
            })
            .catch((error) => {
               console.error(error);
            });
        })
        .catch((error) => {
           console.error(error);
        });
      }

      updateData = (data, info) => {
        console.log(info, data);
        // this.setState({isLoading: true});
        if (info.isParcel){
          this.setState(state => {
            var parcels = state.parcels;
            parcels[info.index].isParcelLoading = true;
            console.log(this.state);
            
            return parcels;
          })
          setTimeout(() => {
            this.setState(state => {
              var parcels = state.parcels;
              parcels[info.index] = {
                isParcelLoading : false,
                parcel_address_name: data.addressID,
                parcel_city: data.city,
                parcel_email: data.email,
                parcel_street_nr: data.houseNr,
                coords:{
                  latitude: data.latitude,
                  longitude: data.longitude,
                  LATITUDE: data.latitude + SPACE,
                  LONGITUDE: data.longitude
                },
                parcel_phone: data.phone,
                parcel_street: data.street,
                parcel_postal_code: data.zip,

                listViewDisplayed: false,
                parcel_country: null,
                avatarSource : null,
                parcel_date: new Date(),
                isShowParcelMapContainer: false,
                isShowParcelMap: true,
                savingParcelAddress: false,
                sendingNewRequest: false,
                selectedCountry: 0,
                selectedCurrency: 0,
                selectedParcelType: 0,
                insurance : true,
                parcel_price: "0"
              }

              return parcels
            })
          }, 50)
        } else{
          this.setState({isSenderLoading: true})
          setTimeout(() => {
            this.setState({
              sender_address_name: data.addressID,
              sender_city: data.city,
              sender_email: data.email,
              sender_street_nr: data.houseNr,
              sender_coords:{
                latitude: data.latitude,
                longitude: data.longitude,
                LATITUDE: data.latitude + SPACE,
                LONGITUDE: data.longitude
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
              location: {},
              sender_country: null,
              sender_date: new Date(),
            }) 
          }, 1000)
        }
      }

      map_sender_log(eventName, e) {
        if (eventName == "onDragEnd") {
          this.setState({
          sender_coords: {
            longitude: e.nativeEvent.coordinate.longitude,
            latitude: e.nativeEvent.coordinate.latitude
          }
          }, () => {
            this.getGeoCode_sender(() => {
            });
          })
        }
      }

      map_parcel_log(eventName, e, index) {
        if (eventName == "onDragEnd") {
          console.log(index, e.nativeEvent.coordinate)
          var latitude = e.nativeEvent.coordinate.latitude;
          var longitude = e.nativeEvent.coordinate.longitude;
          this.setState(state => {
            var parcels = state.parcels;
            parcels[index].coords = {
              longitude: longitude,
              latitude: latitude
            }

            return parcels;
          }, () => {
            this.getGeoCode_parcel(index, () => {});
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

      getGeoCode_sender = async (callback) => {
        Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios):
                                RNGeocoder.fallbackToGoogle(key.google_map_android);
        RNGeocoder.geocodePosition({lat: this.state.sender_coords.latitude, lng: this.state.sender_coords.longitude}).then(res => {
          console.log(res);
          res.forEach((item, index) => {
            this.setState({
              sender_address_name : item.formattedAddress != null ? item.formattedAddress : this.state.sender_address_name,
              sender_email: this.state.sender_email,
              sender_phone: this.state.sender_phone,
              sender_street: item.streetName != null ? item.streetName : this.state.sender_street,
              sender_street_nr: item.streetNumber != null ? item.streetNumber: this.state.sender_street_nr,
              sender_city: item.locality != null ? item.locality : this.state.sender_city,
              sender_postal_code: item.postalCode != null ? item.postalCode : this.state.sender_postal_code,
              sender_country: item.country != null ? item.country : this.state.sender_country,
              })
            if (index + 1 === res.length){
                Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios):
                                        Geocoder.init(key.google_map_android);
                Geocoder.from(this.state.sender_coords.latitude, this.state.sender_coords.longitude)
                .then(json => {
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

      getGeoCode_parcel = async (index, callback) => {
        Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios):
                                RNGeocoder.fallbackToGoogle(key.google_map_android);
        RNGeocoder.geocodePosition({lat: this.state.parcels[index].coords.latitude, lng: this.state.parcels[index].coords.longitude}).then(res => {
          console.log(index, res)
          res.forEach((item, i) => {
            this.setState(state => {
              var parcels = state.parcels;
              console.log(index, parcels[index])
              parcels[index].parcel_address_name = item.formattedAddress != null ? item.formattedAddress : parcels[index].parcel_address_name
              parcels[index].parcel_email = parcels[index].parcel_email
              parcels[index].parcel_phone = parcels[index].parcel_phone
              parcels[index].parcel_street = item.streetName != null ? item.streetName : parcels[index].parcel_street
              parcels[index].parcel_street_nr = item.streetNumber != null ? item.streetNumber: parcels[index].parcel_street_nr
              parcels[index].parcel_city = item.locality != null ? item.locality : parcels[index].parcel_city
              parcels[index].parcel_postal_code = item.postalCode != null ? item.postalCode : parcels[index].parcel_postal_code
              parcels[index].parcel_country = item.country != null ? item.country : parcels[index].parcel_country

              console.log(parcels)

              return parcels
            })
            if (i + 1 === res.length){
                Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios):
                                        Geocoder.init(key.google_map_android);
                Geocoder.from(this.state.parcels[index].coords.latitude, this.state.parcels[index].coords.longitude)
                .then(json => {
                  json.results.forEach((array_component) => {
                    array_component.types.forEach((type, index) => {
                      if (type == 'country') {
                        this.setState(state => {
                          var parcels = this.state.parcels;
                          parcels[index].parcel_country = array_component.formatted_address;

                          return parcels
                        })
                      }
                      if (type == 'street_address') {
                        array_component.address_components.forEach((item_address) => {
                          item_address.types.forEach((type) => {
                            if (type == "postal_code") {
                              this.setState(state => {
                                var parcels = state.parcels;
                                parcels[index].parcel_postal_code = item_address.long_name;

                                return parcels;
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

    selectPhotoTapped(index) {
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

          this.setState(state => {
            var parcels = state.parcels;
            parcels[index].avatarSource = source;

            return parcels;
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
        this.setState({isShowSenderMapContainer: !this.state.isShowSenderMapContainer})
      }

    showParcelMap = (index) => {
      this.setState(state=>{
        var parcels = this.state.parcels;
        parcels[index].isShowParcelMapContainer = !parcels[index].isShowParcelMapContainer;

        return parcels;
      })        
    }

    showAdderss = (info) => {
      this.props.navigation.state.params.parent.navigation.navigate('Address', {person_info: this.props.navigation.state.params.person_info, info: info, updateData: this.updateData});
    }

    add_parcel = () => {
      this.setState(state => {
        var parcels = state.parcels;
        parcels.push({
            listViewDisplayed: false,
            parcel_address_name: null,
            parcel_email: null,
            parcel_phone: null,
            parcel_street: null,
            parcel_street_nr: null,
            parcel_city: null,
            parcel_postal_code: null,
            parcel_country: null,
            avatarSource : null,
            parcel_date: new Date(),
            coords: {
              latitude: this.props.screenProps.latitude,
              longitude: this.props.screenProps.longitude,
              LATITUDE: this.props.screenProps.latitude + SPACE,
              LONGITUDE: this.props.screenProps.longitude + SPACE
            },
            isShowParcelMapContainer: false,
            isShowParcelMap: true,
            savingSenderAddress: false,
            savingParcelAddress: false,
            sendingNewRequest: false,
            selectedCountry: 0,
            selectedCurrency: 0,
            selectedParcelType: 0,
            insurance : true,
            parcel_price: "0"
          });

        return parcels;
      }, () => {
        this.getGeoCode_parcel(this.state.parcels.length - 1, () => {
        })
      })
    }

    removeParcel = (index) =>{
      this.setState(state => {
        var parcels = this.state.parcels.splice(index, 1);

        return parcels
      })
    }

    saveSenderAddress = () => {
      console.log("saveSenderAddress", this.state);
      this.setState({savingSenderAddress: true}, () =>{
        let error_cnt = 0;
        if (this.state.sender_address_name == null || this.state.sender_address_name == "") {
          error_cnt++;
        }
        if (this.state.sender_city == null || this.state.sender_city == "") {
          error_cnt++;
        }
        if (this.state.sender_street == null || this.state.sender_street == "") {
          error_cnt++;
        }
        if (this.state.sender_street_nr == null || this.state.sender_street_nr == "") {
          error_cnt++;
        }
        if (this.state.sender_postal_code == null || this.state.sender_postal_code == "") {
          error_cnt++;
        }
        if (this.state.sender_phone == null || this.state.sender_phone == "") {
          error_cnt++;
        }
        if (this.state.sender_email == null || this.state.sender_email == "") {
          error_cnt++;
        }
        if (error_cnt > 0) {
          this.setState({savingSenderAddress: false});
          this.refs.toast.show('Please insert all fields of a sender.', 3500);
          console.log(this.state)

          return
        }

        return fetch(api.create_address_book_items, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json-patch+json',
          'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
        },
        body: JSON.stringify([
          {
            "addressID": this.state.sender_address_name,
            "city": this.state.sender_city,
            "street": this.state.sender_street,
            "houseNr": this.state.sender_street_nr,
            "zip": this.state.sender_postal_code,
            "latitude": this.state.sender_coords.latitude,
            "longitude": this.state.sender_coords.longitude,
            "phone": this.state.sender_phone,
            "email": this.state.sender_email
          }
        ]),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({savingSenderAddress: false});
            console.log("saveSenderAddress_response", responseJson);
            this.refs.toast.show('Save a sender address is success', 3500);

           return;
        })
        .catch((error) => {
          this.setState({savingSenderAddress: false});
          console.log("saveSenderAddress_response", error)
          this.refs.toast.show('Save a sender address is faild', 3500);
        });
      })      
    }

    saveParcelAddress = (item) => {
      console.log("saveParceAddress", item);
      this.setState({savingParcelAddress: true}, () =>{
        let error_cnt = 0;
        if (item.parcel_address_name == null || item.parcel_address_name == "") {
          error_cnt++;
        }
        if (item.parcel_city == null || item.parcel_city == "") {
          error_cnt++;
        }
        if (item.parcel_street == null || item.parcel_street == "") {
          error_cnt++;
        }
        if (item.parcel_street_nr == null || item.parcel_street_nr == "") {
          error_cnt++;
        }
        if (item.parcel_postal_code == null || item.parcel_postal_code == "") {
          error_cnt++;
        }
        if (item.parcel_phone == null || item.parcel_phone == "") {
          error_cnt++;
        }
        if (item.parcel_email == null || item.parcel_email == "") {
          error_cnt++;
        }
        if (error_cnt > 0) {
          this.setState({savingParcelAddress: false});
          this.refs.toast.show('Please insert all fields of this parcel.', 3500);

          return
        }
        return fetch(api.create_address_book_items, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json-patch+json',
          'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
        },
        body: JSON.stringify([
          {
            "addressID": item.parcel_address_name,
            "city": item.parcel_city,
            "street": item.parcel_street,
            "houseNr": item.parcel_street_nr,
            "zip": item.parcel_postal_code,
            "latitude": item.coords.latitude,
            "longitude": item.coords.longitude,
            "phone": item.parcel_phone,
            "email": item.parcel_email
          }
        ]),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({savingParcelAddress: false});
            console.log("saveParceAddress_response", responseJson);
            this.refs.toast.show('Save a parcel address is success', 3500);

           return;
        })
        .catch((error) => {
          this.setState({savingParcelAddress: false});
          console.log("saveParceAddress_response", error)
          this.refs.toast.show('Save a parcel address is faild', 3500);
        });
      })      
    }

    sendTransportRequest = () => {
      this.setState({sendingNewRequest: true}, () => {
        let error_cnt = 0;

        if(this.state.sender_address_name == null || this.state.sender_address_name == ""){
          error_cnt++;
        }
        if(this.state.sender_city == null || this.state.sender_city == ""){
          error_cnt++;
        }
        if(this.state.sender_street == null || this.state.sender_street == ""){
          error_cnt++;
        }
        if(this.state.sender_street_nr == null || this.state.sender_street_nr == ""){
          error_cnt++;
        }
        if(this.state.sender_postal_code == null || this.state.sender_postal_code == ""){
          error_cnt++;
        }
        if(this.state.sender_country == null || this.state.sender_country == ""){
          error_cnt++;
        }
        if(this.state.sender_email == null || this.state.sender_email == ""){
          error_cnt++;
        }
        if(this.state.sender_phone == null || this.state.sender_phone == ""){
          error_cnt++;
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
        deviceID: this.props.navigation.state.params.person_info.deviceID,
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
        }
        body.items = [];
        this.state.parcels.forEach(item => {
          if(item.parcel_address_name == null || item.parcel_address_name == ""){
            error_cnt++;
          }
          if(item.parcel_city == null || item.parcel_city == ""){
            error_cnt++;
          }
          if(item.parcel_city == null || item.parcel_city == ""){
            error_cnt++;
          }
          if(item.parcel_street_nr == null || item.parcel_street_nr == ""){
            error_cnt++;
          }
          if(item.parcel_postal_code == null || item.parcel_postal_code == ""){
            error_cnt++;
          }          
          if(item.parcel_phone == null || item.parcel_phone == ""){
            error_cnt++;
          }
          if(item.parcel_email == null || item.parcel_email == ""){
            error_cnt++;
          }
          if(item.parcel_price == null || item.parcel_price == ""){
            error_cnt++;
          }
          if(item.avatarSource == null || item.avatarSource == ""){
            error_cnt++;
          }
          body.items.push({
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
            parcelType: this.state.parcel_types[item.selectedParcelType].label,
            parcelValue: item.parcel_price,
            parcelValueCurrency: this.state.currencies[item.selectedCurrency].label,
            insuranceRequested: item.insurance,
            receiverCountry: this.state.countries[item.selectedCountry].label,
            parcelPicture: item.avatarSource,
            // deliveryStatus: "",
            // deliveryOrder: "",
            currentLatitude: this.props.screenProps.latitude,
            currentLongitude: this.props.screenProps.longitude,
            // carriedByTransporter: {
            //   id: null,
            //   firstName: null,
            //   lastName: null,
            //   mobilePhoneNr: null,
            //   licencePlate: null,
            //   latitude: 0,
            //   longitude: 0
            // }
          })
        })
        console.log("new transport request", body)

        if (error_cnt > 0) {
          this.refs.toast.show('Please, insert all fields.', 3500);
          this.setState({sendingNewRequest: false});
          return;
        }

        this.setState({sendingNewRequest: true}, () =>{
          return fetch(api.register_new_request, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json-patch+json',
            'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
          },
          body: JSON.stringify(body),
          })
          .then((response) => response.json())
          .then((responseJson) => {
              this.setState({sendingNewRequest: false});
              console.log(responseJson);
              this.refs.toast.show('Request transer is success', 3500);

              return;
          })
          .catch((error) => {
            console.log(error)
            this.setState({sendingNewRequest: false});
            this.refs.toast.show('Request transer is faild', 3500);
          });
        })
      })
    }

    autocompleteSenderAddrrss = (data, details) => {
      this.setState({                              
        sender_coords: {
          latitude : details.geometry.location.lat,
          longitude : details.geometry.location.lng,
          LATITUDE : details.geometry.location.lat + SPACE,
          LONGITUDE : details.geometry.location.lng + SPACE
        },
        isShowSenderMap: false
      }, () => {
        this.getGeoCode_sender();
        this.setState({isShowSenderMap: true})
      })
    }

    autocompleteParcelAddrrss = (data, details, index) => {
      this.setState(state => {
        var parcels = state.parcels;
          parcels[index].coords = {
          latitude : details.geometry.location.lat,
          longitude : details.geometry.location.lng,
          LATITUDE : details.geometry.location.lat + SPACE,
          LONGITUDE : details.geometry.location.lng + SPACE
        }
        parcels[index].isShowParcelMap = false

        return parcels
      }, () => {
        this.getGeoCode_parcel(index, () => {})
        this.setState(state => {
          var parcels = state.parcels;
          parcels[index].isShowParcelMap = true

          return parcels
        })
      })
    }

    render () {
        if (this.state.isLoading) {
          return (
                <View style={styles.container}>
                     <Header
                      backgroundColor={colors.headerColor}
                      containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}
                      centerComponent={{ text: 'Register transport request', style: { color: '#fff' } }}
                      leftComponent={<Icon name="menu" style={{ color: '#fff' }} onPress={() => this.props.navigation.openDrawer()} />}
                    />
                    <ProgressScreen/>
                </View>            
            )
        }
        const { loading, location, updatesEnabled } = this.state;
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
                    containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}
                    centerComponent={{ text: 'Register transport request', style: { color: '#fff' } }}
                    leftComponent={<Icon name="menu" style={{ color: '#fff' }} onPress={() => this.props.navigation.openDrawer()} />}
                />
                <Toast 
                ref="toast"
                style={{backgroundColor:'#000'}}
                position='top'
                positionValue={100}
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
                textStyle={{color:'white', fontSize: 15}}
                />
               <KeyboardAwareScrollView enabledOnAndroid>
                <View style={styles.borderContainer}>                
                    <Text style={styles.subTitle}>
                        Sender
                    </Text>
                 {
                  this.state.isSenderLoading && 
                  <View style={styles.container_progress}>
                    <ActivityIndicator 
                      size="large"
                      color={colors.progress}/>
                  </View>
                 }                 
                 {
                   !this.state.isSenderLoading && 
                  <View>                   
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <TouchableOpacity style={[styles.buttonContainer, this.state.isShowSenderMapContainer ? styles.mapButton_hide : styles.mapButton_show]} onPress={() => this.showSenderMap()}>
                          {
                            this.state.isShowSenderMapContainer &&
                            <Text style={styles.lable_button}>Hide map</Text>
                          }
                          {
                            !this.state.isShowSenderMapContainer &&
                            <Text style={styles.lable_button}>Show map</Text>
                          }
                        </TouchableOpacity>
                      </View>
                      <View style={styles.col}>
                        <TouchableOpacity style={[styles.buttonContainer, styles.addressButton]} onPress={() => this.showAdderss({isParcel: false, index: null})}>
                          <Text style={styles.lable_button}>Address book</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {
                      this.state.isShowSenderMapContainer &&
                      <Card containerStyle={{padding: 0}}>
                        <GooglePlacesAutocomplete
                          placeholder='Search'
                          minLength={2} // minimum length of text to search
                          autoFocus={false}
                          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                          listViewDisplayed={this.state.listViewDisplayed_sender}    // true/false/undefined
                          fetchDetails={true}
                          renderDescription={row => row.description} // custom description render
                          textInputProps={{
                            onFocus: () => this.setState({listViewDisplayed_sender: true})
                          }}
                          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                          this.setState({listViewDisplayed_sender: false})
                            this.autocompleteSenderAddrrss(data, details)
                          }}

                          getDefaultValue={() => ''}

                          query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: Platform.OS === 'ios' ? key.google_map_ios: key.google_map_android,
                            language: 'en', // language of the results
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
                        {
                          this.state.isShowSenderMap && 
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
                        }                        
                        </Card>
                      }
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            label='Address Name/ID'
                            value={this.state.sender_address_name}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.sender_address_name == null || this.state.sender_address_name == "" ? 'It is necessary.' : ''}
                            onChangeText={(sender_address_name) => this.setState({sender_address_name})}
                         />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            label='E-mail'
                            keyboardType="email-address"
                            value={this.state.sender_email}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.sender_email == null || this.state.sender_email == "" ? 'It is necessary.' : ''}
                            onChangeText={(sender_email) => this.setState({sender_email})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            label='Phone'
                            keyboardType="numeric"
                            value={this.state.sender_phone}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.sender_phone == null || this.state.sender_phone == "" ? 'It is necessary.' : ''}
                            onChangeText={(sender_phone) => this.setState({sender_phone})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            label='Street'
                            value={this.state.sender_street}
                            errorMessage={this.state.sender_street == null || this.state.sender_street == "" ? 'It is necessary.' : ''}
                            onChangeText={(sender_street) => this.setState({sender_street})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            label='Nr.'
                            keyboardType="numeric"
                            value={this.state.sender_street_nr}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.sender_street_nr == null || this.state.sender_street_nr == "" ? 'It is necessary.' : ''}
                            onChangeText={(sender_street_nr) => this.setState({sender_street_nr})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            label='City'
                            value={this.state.sender_city}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.sender_city == null || this.state.sender_city == "" ? 'It is necessary.' : ''}
                            onChangeText={(sender_city) => this.setState({sender_city})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            label='Postal Code'
                            keyboardType="numeric"
                            value={this.state.sender_postal_code}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.sender_postal_code == null || this.state.sender_postal_code == "" ? 'It is necessary.' : ''}
                            onChangeText={(sender_postal_code) => this.setState({sender_postal_code})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            label='Country'
                            value={this.state.sender_country}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.sender_country == null || this.state.sender_country == "" ? 'It is necessary.' : ''}
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
                            label='Longitude'
                            keyboardType="numeric"
                            disabled={true}
                            value={this.state.sender_coords.longitude.toString()}
                            onChangeText={(longitude) =>
                              this.setState({
                                sender_coords : {
                                  longitude: parseFloat(longitude),
                                  latitude: this.state.sender_coords.latitude,
                                  LATITUDE: parseFloat(longitude) - SPACE,
                                  LONGITUDE: this.state.sender_coords.LONGITUDE
                                },
                                isShowSenderMap: false
                              }, () => {
                                this.setState({isShowSenderMap: true})
                              })}
                        />
                      </View>
                      <View style={styles.col}>
                         <Input
                            label='Latitude'
                            keyboardType="numeric"
                            disabled={true}
                            value={this.state.sender_coords.latitude.toString()}
                            onChangeText={(latitude) => 
                              this.setState({
                              sender_coords : {
                                longitude: this.state.sender_coords.longitude,
                                latitude:  parseFloat(latitude),
                                LATITUDE: this.state.sender_coords.LATITUDE + SPACE,
                                LONGITUDE: parseFloat(latitude) + SPACE
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
                            date={this.state.sender_date}
                            mode="datetime"
                            placeholder="select date"
                            format="YYYY/MM/DD hh:mm"
                            minDate="2016-01-01"
                            maxDate="2050-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                              },
                              dateInput: {
                                marginLeft: 36,
                                borderLeftWidth: 0,
                                borderRightWidth: 0,
                                borderTopWidth: 0,
                                borderHight: 2
                              }
                            }}
                            onDateChange={(date) => {this.setState({sender_date: date})}}
                          />
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity disabled={this.state.savingSenderAddress} style={[styles.save_addressContainer, styles.addressButton]} onPress={() => {this.saveSenderAddress()}}>
                            {
                              this.state.savingSenderAddress &&
                                <ActivityIndicator 
                                  size="small"
                                  color={'#fff'}/>
                            }
                            {
                              !this.state.savingSenderAddress &&
                              <Text style={styles.lable_button}>Save address</Text>
                            }    
                        </TouchableOpacity>
                    </View>
                  </View>
                 }
                 </View>             
                  <Divider style={{ backgroundColor: '#000' }} />
                  {
                    this.state.parcels.map((item, index) => {
                      return (
                        <View key={index}>
                            <Text style={styles.subTitle}>
                                Parcel #{index + 1}
                            </Text>
                            {
                              item.isParcelLoading && 
                              <View style={styles.container_progress}>
                                <ActivityIndicator 
                                  size="large"
                                  color={colors.progress}/>
                              </View>
                            }
                            {
                              !item.isParcelLoading &&
                              <View>
                                <View style={styles.row}>
                                  <View style={styles.col}>                  
                                    <TouchableOpacity style={[styles.buttonContainer, item.isShowParcelMapContainer ? styles.mapButton_hide : styles.mapButton_show]} onPress={() => this.showParcelMap(index)}>
                                      {
                                        item.isShowParcelMapContainer &&
                                        <Text style={styles.lable_button}>Hide map</Text>
                                      }
                                      {
                                        !item.isShowParcelMapContainer &&
                                        <Text style={styles.lable_button}>Show map</Text>
                                      }
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.col}>
                                    <TouchableOpacity style={[styles.buttonContainer, styles.addressButton]} onPress={() => this.showAdderss({isParcel: true, index: index})}>
                                      <Text style={styles.lable_button}>Address book</Text>
                                    </TouchableOpacity>
                                  </View>
                                  {
                                    index > 0 &&
                                    <View style={styles.col}>
                                      <TouchableOpacity style={[styles.deleteButtonContainer, styles.deleteButton]} onPress={() => this.removeParcel(index)}>
                                        <Text style={styles.lable_button}>Remove</Text>
                                      </TouchableOpacity>
                                    </View>
                                  }
                                </View>
                                {
                                  item.isShowParcelMapContainer &&
                                  <Card containerStyle={{padding: 0}}>
                                  <GooglePlacesAutocomplete
                                    placeholder='Search'
                                    minLength={2} // minimum length of text to search
                                    autoFocus={false}
                                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                                    listViewDisplayed={item.listViewDisplayed}    // true/false/undefined
                                    fetchDetails={true}
                                    renderDescription={row => row.description} // custom description render
                                    textInputProps={{
                                      onFocus: () => this.setState(state => {
                                        var parcels = state.parcels;
                                        parcels[index].listViewDisplayed = true;

                                        return parcels;
                                      })
                                    }}
                                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                      this.setState(state => {
                                        var parcels = state.parcels;
                                        parcels[index].listViewDisplayed = false;

                                        return parcels;
                                      })
                                      this.autocompleteParcelAddrrss(data, details, index);
                                    }}

                                    getDefaultValue={() => ''}

                                    query={{
                                      // available options: https://developers.google.com/places/web-service/autocomplete
                                      key: Platform.OS === 'ios' ? key.google_map_ios: key.google_map_android,
                                      language: 'en', // language of the results
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
                                  {
                                    item.isShowParcelMap &&
                                    <MapView
                                      provider={this.props.provider}
                                      style={styles.map}
                                      initialRegion={{
                                        latitude: item.coords.latitude,
                                        longitude: item.coords.longitude,
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA,
                                      }}
                                      >
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
                                    }                               
                                    </Card>
                                  }
                                <View style={styles.row}>
                                  <View style={styles.col}>                  
                                    <Input
                                        label='Address Name/ID'
                                        value={item.parcel_address_name}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={item.parcel_address_name == null || item.parcel_address_name == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_address_name) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_address_name = parcel_address_name;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                </View>
                                <View style={styles.row}>
                                  <View style={styles.col}>
                                    <Input
                                        label='E-mail'
                                        keyboardType="email-address"
                                        value={item.parcel_email}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={item.parcel_email == null || item.parcel_email == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_email) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_email = parcel_email;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                  <View style={styles.col}>
                                    <Input
                                        label='Phone'
                                        keyboardType="numeric"
                                        value={item.parcel_phone}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={item.parcel_phone == null || item.parcel_phone == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_phone) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_phone = parcel_phone;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                </View>
                                <View style={styles.row}>
                                  <View style={styles.col}>
                                    <Input
                                        label='Street'
                                        value={item.parcel_street}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={item.parcel_street == null || item.parcel_street == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_street) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_street = parcel_street;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                  <View style={styles.col}>
                                    <Input
                                        label='Nr.'
                                        keyboardType="numeric"
                                        value={item.parcel_street_nr}
                                        errorMessage={item.parcel_street_nr == null || item.parcel_street_nr == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_street_nr) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_street_nr = parcel_street_nr;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                </View>
                                <View style={styles.row}>
                                  <View style={styles.col}>                  
                                    <Input
                                        label='City'
                                        value={item.parcel_city}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={item.parcel_city == null || item.parcel_city == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_city) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_city = parcel_city;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                </View>
                                <View style={styles.row}>
                                  <View style={styles.col}>
                                    <Input
                                        label='Postal Code'
                                        keyboardType="numeric"
                                        value={item.parcel_postal_code}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={item.parcel_postal_code == null || item.parcel_postal_code == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_postal_code) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_postal_code = parcel_postal_code;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                  <View style={styles.col}>
                                    <Input
                                        label='Country'
                                        value={item.parcel_country}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={item.parcel_country == null || item.parcel_country == "" ? 'It is necessary.' : ''}
                                        onChangeText={(parcel_country) => this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_country = parcel_country;
                                          
                                          return parcels
                                        })}
                                    />
                                  </View>
                                </View>
                                <Text style={styles.subTitle}>
                                    GPS
                                </Text>
                                <View style={styles.row}>
                                  <View style={styles.col}>
                                    <Input
                                        label='Longitude'
                                        keyboardType="numeric"
                                        disabled={true}
                                        value={item.coords.longitude.toString()}
                                        onChangeText={(longitude) =>
                                          this.setState(state => {
                                            var parcels = this.state.parcels;
                                            parcels[index].coords = {
                                              longitude: parseFloat(longitude),
                                              latitude: item.coords.latitude,
                                              LATITUDE: parseFloat(longitude) + SPACE,
                                              LONGITUDE: item.coords.LONGITUDE + SPACE
                                            }
                                            parcels[index].isShowParcelMap = false;

                                            return parcels
                                          }, () => {
                                            this.setState(state => {
                                              var parcels = state.parcels;
                                              parcels[index].isShowParcelMap = true;

                                              return parcels;
                                            })
                                          })}
                                    />
                                  </View>
                                  <View style={styles.col}>
                                    <Input
                                        label='Latitude'
                                        keyboardType="numeric"
                                        disabled={true}
                                        value={item.coords.latitude.toString()}
                                        onChangeText={(latitude) =>
                                          this.setState(state => {
                                            var parcels = this.state.parcels;
                                            parcels[index].coords = {
                                              longitude: item.coords.longitude,
                                              latitude:  coords(latitude),
                                              LATITUDE: item.coords.LATITUDE + SPACE,
                                              LONGITUDE: parseFloat(latitude) + SPACE
                                            }

                                            parcels[index].isShowParcelMap = false;

                                            return parcels
                                          }, () => {
                                            this.setState(state => {
                                              var parcels = state.parcels;
                                              parcels[index].isShowParcelMap = true;

                                              return parcels;
                                            })
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
                                        date={item.parcel_date}
                                        mode="datetime"
                                        placeholder="select date"
                                        format="YYYY/MM/DD hh:mm"
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
                                        }}
                                        onDateChange={(date) => {this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].parcel_date = date;

                                          return parcels;
                                        })}}
                                      />
                                  </View>
                                </View>
                                <View style={{alignItems: 'flex-end'}}>
                                    <TouchableOpacity disabled={this.state.savingParcelAddress} style={[styles.save_addressContainer, styles.addressButton]} onPress={() => this.saveParcelAddress(item)}>
                                        {
                                          this.state.savingParcelAddress &&
                                          <ActivityIndicator 
                                          size="small"
                                          color={'#fff'}/>
                                        }
                                        {
                                          !this.state.savingParcelAddress &&
                                          <Text style={styles.lable_button}>Save address</Text>
                                        }                                    
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>
                                  <Picker
                                      selectedValue={item.selectedCountry}
                                      style={{height: 50, width: 100, margin: 10}}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].selectedCountry = itemIndex;

                                          return parcels;
                                        })
                                      }>
                                      {
                                        this.state.countries.map((item, index) => {
                                          return (
                                            <Picker.Item label={item.label} value={index} key={index}/>
                                          )
                                        })
                                      }
                                  </Picker>
                                  <Picker
                                      selectedValue={item.selectedParcelType}
                                      style={{height: 50, width: 100, margin: 10}}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].selectedParcelType = itemIndex;

                                          return parcels;
                                        })
                                      }>
                                      {
                                        this.state.parcel_types.map((item, index) => {
                                          return (
                                            <Picker.Item label={item.label} value={index} key={index}/>
                                          )
                                        })
                                      }
                                  </Picker>
                                  <Picker
                                      selectedValue={item.selectedCurrency}
                                      style={{height: 50, width: 100, margin: 10}}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.setState(state => {
                                          var parcels = this.state.parcels;
                                          parcels[index].selectedCurrency = itemIndex;

                                          return parcels;
                                        })
                                      }>
                                      {
                                        this.state.currencies.map((item, index) => {
                                          return (
                                            <Picker.Item label={item.label} value={index} key={index}/>    
                                          )
                                        })
                                      }
                                  </Picker>
                                </View>
                                <View style={{marginLeft: 20, marginRight: 20, marginTop: 120}}>
                                    <CheckBox
                                      title='Insurance'
                                      checked={item.insurance}
                                      onPress={() => this.setState(state => {
                                        var parcels = state.parcels;
                                        parcels[index].insurance = !item.insurance
                                        
                                        return parcels
                                      })}
                                    />
                                </View>
                                {
                                  item.avatarSource == null &&
                                  <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                                    <Text style={{color: 'red', fontSize: 12}}>
                                      Please, insert image.
                                    </Text>
                                  </View>  
                                }                                                      
                                <TouchableOpacity onPress={() => {this.selectPhotoTapped(index)}} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                  <View
                                    style={[styles.avatar, styles.avatarContainer, {marginBottom: 20, marginTop: 20}]}>
                                    {item.avatarSource === null ? (
                                      <Text>Select a Photo</Text>
                                    ) : (
                                      <Image style={styles.avatar} source={item.avatarSource} />
                                    )}
                                  </View>
                                </TouchableOpacity>
                                <View style={[styles.col, {marginBottom: 20}]}>
                                <Input
                                label='ParcelPrice'
                                  keyboardType="numeric"
                                  value={item.parcel_price}
                                  errorStyle={{ color: 'red' }}
                                  errorMessage={item.parcel_price == null || item.parcel_price == "" ? 'It is necessary.' : ''}
                                  onChangeText={(parcel_price) => this.setState(state => {
                                    var parcels = this.state.parcels;
                                    parcels[index].parcel_price = parcel_price;
                                    
                                    return parcels
                                  })}
                                  />
                                </View>
                              </View>
                            }                            
                        </View>
                      )
                    })
                  }                   
                  <View style={[styles.row, {marginTop: 20, marginBottom: 20}]}>
                      <View style={styles.col}>                  
                        <TouchableOpacity style={[styles.buttonContainer, styles.button]} onPress={() => {this.add_parcel()}} >
                            <Text style={styles.lable_button}>Add parcel</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.col}>
                        <TouchableOpacity disabled={this.state.sendingNewRequest} style={[styles.buttonContainer, styles.button]} onPress={() => {this.sendTransportRequest()}}>
                          {
                            this.state.sendingNewRequest &&
                            <ActivityIndicator 
                            size="small"
                            color={'#fff'}/>
                          }
                          {
                            !this.state.sendingNewRequest &&
                            <Text style={styles.lable_button}>Send transport request</Text>
                          }
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
        marginLeft: 18
      },
      buttonContainer: {
        height:38,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
      },
      button: {
        backgroundColor: "#007bff",
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
      },
      deleteButton: {
        backgroundColor: "#ff0000",
      },
      deleteButtonContainer: {
          height:38,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius:5,
      },
      container_progress: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.subScreen,
        height: 300
      }
});

export default RegisterParcel;
