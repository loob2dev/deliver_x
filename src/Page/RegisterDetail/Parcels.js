import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, Image, PixelRatio } from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { connect } from 'react-redux';

class Parcels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.transport_request_dto,
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(null);
  }

  render() {
    return (
      <View style={styles.container}>
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
                    style={styles.dataPicker}
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
              <View style={styles.picker_container}>
                <Picker selectedValue={this.props.currencies.indexOf(item.selectedParcelType)} style={styles.picker} enabled={false}>
                  {this.props.parcels.map((item_parcel, index_parcel) => {
                    return <Picker.Item label={item_parcel.label} value={index_parcel} key={index_parcel} />;
                  })}
                </Picker>
                <Picker selectedValue={this.props.currencies.indexOf(item.parcelValueCurrency)} style={styles.picker} enabled={false}>
                  {this.props.currencies.map((item_currency, index_currency) => {
                    return <Picker.Item label={item_currency.label} value={index_currency} key={index_currency} />;
                  })}
                </Picker>
              </View>

              <View style={styles.checkBoxContainer}>
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
              <View style={styles.avatar_mainContainer}>
                <View style={[styles.avatar, styles.avatarContainer]}>
                  <Image style={styles.avatar} source={{ uri: item.parcelPicture }} />
                </View>
              </View>
              <View style={styles.price}>
                <Input disabled={true} label="ParcelPrice" keyboardType="numeric" value={item.parcelValue.toString()} />
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

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
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  picker_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 100,
    margin: 10,
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
  dataPicker: {
    width: 200,
  },
  checkBoxContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 120,
  },
  avatar_mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    marginBottom: 30,
  },
});

const mapStatetoProps = ({ countries, parcels, currencies, register_parcel: { transport_request_dto } }) => ({
  countries,
  parcels,
  currencies,
  transport_request_dto,
});
export default connect(mapStatetoProps)(Parcels);
