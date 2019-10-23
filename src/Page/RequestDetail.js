import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, Image, PixelRatio, Platform } from 'react-native';
import { Header, CheckBox, Input, Divider } from 'react-native-elements';
import { Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-datepicker';
import colors from '../config/colors';
import api from '../config/api';

class RequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.state.params.data,
      countries: [],
      parcel_types: [],
      currencies: [],
    };
  }

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => <Icon name="home" style={{ fontSize: 24, color: tintColor }} />,
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Request Detail', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="arrow-back" style={styles.icon} onPress={() => this.props.navigation.goBack()} />
            </View>
          }
        />
        <KeyboardAwareScrollView enabledOnAndroid>
          <View style={styles.borderContainer}>
            <Text style={styles.subTitle}>Sender</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input label="Address Name/ID" disabled={true} value={this.state.data.senderAddressID} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input label="E-mail" keyboardType="email-address" disabled={true} value={this.state.data.senderEmail} />
              </View>
              <View style={styles.col}>
                <Input label="Phone" keyboardType="numeric" disabled={true} value={this.state.data.senderPhone} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input label="Street" disabled={true} value={this.state.data.senderStreet} />
              </View>
              <View style={styles.col}>
                <Input label="Nr." keyboardType="numeric" disabled={true} value={this.state.data.sender_street_nr} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input label="City" disabled={true} value={this.state.data.senderHouseNr} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input label="Postal Code" keyboardType="numeric" disabled={true} value={this.state.data.senderZip} />
              </View>
              <View style={styles.col}>
                <Input label="Country" disabled={true} value={this.state.data.senderCountry} />
              </View>
            </View>
            <Text style={styles.subTitle}>GPS</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Input label="Longitude" keyboardType="numeric" disabled={true} value={this.state.data.senderLatitude.toString()} />
              </View>
              <View style={styles.col}>
                <Input label="Latitude" keyboardType="numeric" disabled={true} value={this.state.data.senderLongitude.toString()} />
              </View>
            </View>
            <Text style={styles.label_data}>Loading Time</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <DatePicker
                  style={{ width: 200 }}
                  disabled={true}
                  date={new Date(this.state.data.created)}
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
                      borderHight: 2,
                    },
                  }}
                  onDateChange={date => {
                    this.setState({ sender_date: date });
                  }}
                />
              </View>
            </View>
          </View>
          <Divider style={{ backgroundColor: '#000' }} />
          {this.state.data.items.map((item, index) => {
            return (
              <View key={index}>
                <Text style={styles.subTitle}>Parcel #{index + 1}</Text>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Input label="Address Name/ID" disabled={true} value={item.parcelAddressID} />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Input label="E-mail" disabled={true} keyboardType="email-address" value={item.receiverEmail} />
                  </View>
                  <View style={styles.col}>
                    <Input label="Phone" disabled={true} keyboardType="numeric" value={item.receiverPhone} />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Input label="Street" disabled={true} value={item.receiverStreet} />
                  </View>
                  <View style={styles.col}>
                    <Input label="Nr." disabled={true} keyboardType="numeric" value={item.receiverHouseNr} />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Input label="City" disabled={true} value={item.receiverCity} />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Input label="Postal Code" disabled={true} keyboardType="numeric" value={item.receiverZip} />
                  </View>
                  <View style={styles.col}>
                    <Input label="Country" disabled={true} value={item.receiverCountry} />
                  </View>
                </View>
                <Text style={styles.subTitle}>GPS</Text>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Input label="Longitude" disabled={true} keyboardType="numeric" value={item.receiverLatitude.toString()} />
                  </View>
                  <View style={styles.col}>
                    <Input disabled={true} label="Latitude" keyboardType="numeric" value={item.receiverLongitude.toString()} />
                  </View>
                </View>
                <Text style={styles.label_data}>Loading Time</Text>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <DatePicker
                      disabled={true}
                      style={{ width: 200 }}
                      date={new Date(item.requestedDeliveryTime)}
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
                          borderHight: 2,
                        },
                      }}
                      onDateChange={date => {
                        this.setState(state => {
                          var parcels = this.state.parcels;
                          parcels[index].parcel_date = date;

                          return parcels;
                        });
                      }}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                  <Picker
                    selectedValue={item.receiverCountry}
                    style={{ height: 50, width: 100, margin: 10 }}
                    disabled={true}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState(state => {
                        var parcels = this.state.parcels;
                        parcels[index].selectedCountry = itemIndex;

                        return parcels;
                      })
                    }>
                    {this.state.countries.map((item, index) => {
                      return <Picker.Item label={item.label} value={index} key={index} />;
                    })}
                  </Picker>
                  <Picker
                    selectedValue={item.parcelType}
                    style={{ height: 50, width: 100, margin: 10 }}
                    disabled={true}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState(state => {
                        var parcels = this.state.parcels;
                        parcels[index].selectedParcelType = itemIndex;

                        return parcels;
                      })
                    }>
                    {this.state.parcel_types.map((item, index) => {
                      return <Picker.Item label={item.label} value={index} key={index} />;
                    })}
                  </Picker>
                  <Picker
                    selectedValue={item.parcelValueCurrency}
                    style={{ height: 50, width: 100, margin: 10 }}
                    disabled={true}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState(state => {
                        var parcels = this.state.parcels;
                        parcels[index].selectedCurrency = itemIndex;

                        return parcels;
                      })
                    }>
                    {this.state.currencies.map((item, index) => {
                      return <Picker.Item label={item.label} value={index} key={index} />;
                    })}
                  </Picker>
                </View>
                <View style={{ marginLeft: 20, marginRight: 20, marginTop: 120 }}>
                  <CheckBox
                    title="Insurance"
                    disabled={true}
                    checked={item.insuranceRequested}
                    onPress={() =>
                      this.setState(state => {
                        var parcels = state.parcels;
                        parcels[index].insurance = !item.insurance;

                        return parcels;
                      })
                    }
                  />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20, marginTop: 20 }]}>
                    <Image style={styles.avatar} source={item.parcelPicture} />
                  </View>
                </View>
                <View style={[styles.col, { marginBottom: 20 }]}>
                  <Input disabled={true} label="ParcelPrice" keyboardType="numeric" value={item.parcelValue.toString()} />
                </View>
              </View>
            );
          })}
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
});

export default RequestDetail;
