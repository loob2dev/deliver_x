import React, { Component } from 'react';
import { 
    FlatList,
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
    ToastAndroid,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { Header } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import { Card, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import RNGeocoder from 'react-native-geocoder';
import Geocoder from 'react-native-geocoding';
import publicIP from 'react-native-public-ip';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Toast, {DURATION} from 'react-native-easy-toast'

import colors from '../../config/colors'
import api from '../../config/api';
import key from '../../config/api_keys';
import ProgressScreen from '../Refer/ProgressScreen';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class Address extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoading: true,

            countries: [],
            parcel_types: [],
            currencies: [],
            coords: {
                latitude: this.props.screenProps.latitude,
                longitude: this.props.screenProps.longitude,
                LATITUDE: this.props.screenProps.latitude + SPACE,
                LONGITUDE: this.props.screenProps.longitude + SPACE
            },
            isShowMapContainer: false,
            isShowMap: true,
            loading: false,
            updatesEnabled: false,
            location: {},
            address_name: null,
            email: null,
            phone: null,
            street: null,
            street_nr: null,
            city: null,
            postal_code: null,
            country: null,
            addAddress: false
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.fetchAllAddress(() => {
            this.getGeoCode(() => {
                this.setState({
                    isLoading: false
                })
            }); 
        });
    }

    componentWillUnmount() {
        this.setState({addAddress: false})
    }

    fetchAllAddress = (callback) =>
    {
        return fetch(api.get_all_address_book_items, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json-patch+json',
            'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
        }})
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
              data: responseJson,
              isLoading: false
            })
            console.log("all address", responseJson)
            callback();
        })
        .catch((error) => {
            console.error(error);
            callback();
        });
    }

    map_log(eventName, e) {
        if (eventName == "onDragEnd") {
        this.setState({
            coords: {
                longitude: e.nativeEvent.coordinate.longitude,
                latitude: e.nativeEvent.coordinate.latitude
            }
            }, () => {
                this.getGeoCode(() => {
                });
            })
        }
      }

    getGeoCode = async (callback) => {
        Platform.OS === 'ios' ? RNGeocoder.fallbackToGoogle(key.google_map_ios):
                                RNGeocoder.fallbackToGoogle(key.google_map_android);
        RNGeocoder.geocodePosition({lat: this.state.coords.latitude, lng: this.state.coords.longitude}).then(res => {
        res.forEach((item, index) => {
            this.setState({
                address_name : item.formattedAddress != null ? item.formattedAddress : null,
                email: null,
                phone: null,
                street: item.streetName != null ? item.streetName : null,
                street_nr: item.streetNumber != null ? item.streetNumber: null,
                city: item.locality != null ? item.locality : null,
                postal_code: item.postalCode != null ? item.postalCode : null,
                country: item.country != null ? item.country : null,
            })
            if (index + 1 === res.length){
                Platform.OS === 'ios' ? Geocoder.init(key.google_map_ios):
                                        Geocoder.init(key.google_map_android);
                Geocoder.from(this.state.coords.latitude, this.state.coords.longitude)
                .then(json => {
                    json.results.forEach((array_component) => {
                        array_component.types.forEach((type, index) => {
                            if (type == 'country') {
                                this.setState({
                                country: array_component.formatted_address
                            })
                        }
                        if (type == 'street_address') {
                            array_component.address_components.forEach((item_address) => {
                                item_address.types.forEach((type) => {
                                    if (type == "postal_code") {
                                        this.setState({
                                            postal_code: item_address.long_name
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

    saveAddress = () => {
        console.log("saveAddress", this.state);
        this.setState({savingAddress: true}, () =>{
            let error_cnt = 0;
            if (this.state.address_name == null || this.state.address_name == "") {
                error_cnt++;
            }
            if (this.state.city == null || this.state.city == "") {
                error_cnt++;
            }
            if (this.state.street == null || this.state.street == "") {
                error_cnt++;
            }
            if (this.state.street_nr == null || this.state.street_nr == "") {
                error_cnt++;
            }
            if (this.state.postal_code == null || this.state.postal_code == "") {
                error_cnt++;
            }
            if (this.state.phone == null || this.state.phone == "") {
                error_cnt++;
            }
            if (this.state.email == null || this.state.email == "") {
                error_cnt++;
            }
            if (error_cnt > 0) {
                this.setState({savingAddress: false});
                this.refs.toast.show('Please, insert all fiedls.', 3500);

                return;
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
                "addressID": this.state.address_name,
                "city": this.state.city,
                "street": this.state.street,
                "houseNr": this.state.street_nr,
                "zip": this.state.postal_code,
                "latitude": this.state.coords.latitude,
                "longitude": this.state.coords.longitude,
                "phone": this.state.phone,
                "email": this.state.email
              }
            ]),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({savingAddress: false});
                console.log("saveAddress_response", responseJson);
                this.refs.toast.show('Save an address is success', 3500);
                this.fetchAllAddress(() => {})

               return;
            })
            .catch((error) => {
              this.setState({savingAddress: false});
              console.log("saveAddress_response", error)
              this.refs.toast.show('Save an address is faild', 3500);
            });
        })      
    }

    autocompleteAddrrss = (data, details) => {
        this.setState({                              
            coords: {
              latitude : details.geometry.location.lat,
              longitude : details.geometry.location.lng,
              LATITUDE : details.geometry.location.lat + SPACE,
              LONGITUDE : details.geometry.location.lng + SPACE
            },
            isShowMap: false
        }, () => {
            this.getGeoCode();
            this.setState({isShowMap: true})
        })
    }

    Item = ({ item }) => {
      return (
        <Card>
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
            <TouchableOpacity style={[styles.deleteButtonContainer, styles.deleteButton]} onPress={() => this.deleteItem(item)}>
                <Text style={styles.lable_button}>Delete</Text>        
            </TouchableOpacity>
        </Card>
      );
    }

    deleteItem = (item) => {
        console.log(item.id)
        return fetch(api.delete_address_book_item, {
            method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json-patch+json',
            'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
        },
        body: JSON.stringify([
            item.id
        ]),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            this.fetchAllAddress(() => {});

           return;
        })
        .catch((error) => {
          console.log(error)
        });
    }

    render() {
        const { loading, location, updatesEnabled } = this.state;
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <Header
                        backgroundColor={colors.headerColor}
                        containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}
                        centerComponent={{ text: 'Address Book', style: { color: '#fff' } }}
                        leftComponent={<Icon name="arrow-back" style={{ color: '#fff' }} onPress={() => this.props.navigation.goBack()} />}                 
                    />
                    <ProgressScreen/>
                </View>            
            )
        } else if(!this.state.addAddress){
            return (
                <View style={styles.container}>
                    <Header
                        backgroundColor={colors.headerColor}
                        containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}
                        centerComponent={{ text: 'Address Book', style: { color: '#fff' } }}
                        leftComponent={<Icon name="arrow-back" style={{ color: '#fff' }} onPress={() => this.props.navigation.goBack()} />}                 
                    />
                    <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]} onPress={() => this.setState({addAddress: true})}>
                        <Text style={styles.lable_button}>Add address</Text>
                    </TouchableOpacity>
                    <SafeAreaView style={styles.container}>
                      <FlatList
                        data={this.state.data}
                        numColumns={1}
                        renderItem={({ item }) => <this.Item item={item} />}
                        keyExtractor={item => item.id}
                      />
                    </SafeAreaView>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
                    containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}
                    centerComponent={{ text: 'New Address', style: { color: '#fff' } }}
                    leftComponent={<Icon name="arrow-back" style={{ color: '#fff' }} onPress={() => this.props.navigation.goBack()} />}                 
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
                      <Card containerStyle={{padding: 0}}>
                        <GooglePlacesAutocomplete
                          placeholder='Search'
                          minLength={2} // minimum length of text to search
                          autoFocus={false}
                          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                          listViewDisplayed='false'    // true/false/undefined
                          fetchDetails={true}
                          renderDescription={row => row.description} // custom description render
                          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            this.autocompleteAddrrss(data, details)
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
                          this.state.isShowMap && 
                          <MapView
                          provider={this.props.provider}
                          style={styles.map}
                          initialRegion={{
                            latitude: this.state.coords.latitude,
                            longitude: this.state.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                          }}
                          >
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
                        }                        
                        </Card>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            label='Address Name/ID'
                            value={this.state.address_name}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.address_name == null || this.state.address_name == "" ? 'It is necessary.' : ''}
                            onChangeText={(address_name) => this.setState({address_name})}
                         />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            label='E-mail'
                            keyboardType="email-address"
                            value={this.state.email}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.email == null || this.state.email == "" ? 'It is necessary.' : ''}
                            onChangeText={(email) => this.setState({email})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            label='Phone'
                            keyboardType="numeric"
                            value={this.state.phone}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.phone == null || this.state.phone == "" ? 'It is necessary.' : ''}
                            onChangeText={(phone) => this.setState({phone})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            label='Street'
                            value={this.state.street}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.street == null || this.state.street == "" ? 'It is necessary.' : ''}
                            onChangeText={(street) => this.setState({street})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            label='Nr.'
                            keyboardType="numeric"
                            value={this.state.street_nr}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.street_nr == null || this.state.street_nr == "" ? 'It is necessary.' : ''}
                            onChangeText={(street_nr) => this.setState({street_nr})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            label='City'
                            value={this.state.city}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.city == null || this.state.city == "" ? 'It is necessary.' : ''}
                            onChangeText={(city) => this.setState({city})}
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            label='Postal Code'
                            keyboardType="numeric"
                            value={this.state.postal_code}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.postal_code == null || this.state.postal_code == "" ? 'It is necessary.' : ''}
                            onChangeText={(postal_code) => this.setState({postal_code})}
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            label='Country'
                            value={this.state.country}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.country == null || this.state.country == "" ? 'It is necessary.' : ''}
                            onChangeText={(country) => this.setState({country})}
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
                            value={this.state.coords.longitude.toString()}
                            onChangeText={(longitude) => parseFloat(longitude) > 0 && 
                              this.setState({
                                coords : {
                                  longitude: parseFloat(longitude),
                                  latitude: this.state.coords.latitude,
                                  LATITUDE: parseFloat(longitude) - SPACE,
                                  LONGITUDE: this.state.coords.LONGITUDE
                                },
                                isShowMap: false
                              }, () => {
                                this.setState({isShowMap: true})
                              })}
                        />
                      </View>
                      <View style={styles.col}>
                         <Input
                            label='Latitude'
                            keyboardType="numeric"
                            value={this.state.coords.latitude.toString()}
                            onChangeText={(latitude) => parseFloat(latitude) > 0 && this.setState({
                              coords : {
                                longitude: this.state.coords.longitude,
                                latitude:  parseFloat(latitude),
                                LATITUDE: this.state.coords.LATITUDE + SPACE,
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
                            <TouchableOpacity style={[styles.buttonContainer, styles.addressButton]} onPress={() => this.setState({addAddress: false})}>
                                <Text style={styles.lable_button}>Back to list</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.col}>
                            <TouchableOpacity disabled={this.state.savingAddress} style={[styles.buttonContainer, styles.addressButton]} onPress={() => {this.saveAddress()}}>
                                {
                                  this.state.savingAddress &&
                                    <ActivityIndicator 
                                      size="small"
                                      color={'#fff'}/>
                                }
                                {
                                  !this.state.savingAddress &&
                                  <Text style={styles.lable_button}>Save address</Text>
                                }    
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
    container: {
        flex: 1
    },
    item_container: {
        padding: 2
    },
    label: {
        fontSize: 15,
    },
    value: {
        fontSize: 20,
        marginLeft: 20
    },
    lable_button: {
        color: 'white',
    },
    addressButton: {
        backgroundColor: "#007bff",
    },
    deleteButton: {
        backgroundColor: "#ff0000",
    },
    deleteButtonContainer: {
        height:38,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
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
        margin: 20,
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
    }
});

export default Address;
