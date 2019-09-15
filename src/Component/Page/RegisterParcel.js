import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Picker, Image, PixelRatio } from 'react-native';
import { Header, CheckBox, Input, Divider  } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import colors from '../../config/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker'


class RegisterParcel extends Component {
    constructor(props){
        super(props)
        this.state = {
          date:"2016-05-15",
          avatarSource: null
        }
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
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


    showMap = () => {
        Alert.alert("Alert", "Button pressed ");
      }

    render () {
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
                        <TouchableOpacity style={[styles.buttonContainer, styles.mapButton]} onPress={() => this.showMap()}>
                          <Text style={styles.lable_button}>Show map</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.col}>
                        <TouchableOpacity style={[styles.buttonContainer, styles.addressButton]} onPress={() => this.showMap()}>
                          <Text style={styles.lable_button}>Address book</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='Address Name/ID'
                         />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='E-mail'
                            keyboardType="email-address"
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Number'
                            keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='Street'
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Nr.'
                            keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='City'
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='City'
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Country'
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
                        />
                      </View>
                      <View style={styles.col}>
                         <Input
                            placeholder='Latitude'
                            keyboardType="numeric"
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
                            minDate="2016-05-01"
                            maxDate="2016-06-01"
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
                                borderColor: '#007bff',
                                borderHight: 2
                              }
                              // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                          />
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]} onPress={() => this.showMap()}>
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
                        <TouchableOpacity style={[styles.buttonContainer, styles.mapButton]} onPress={() => this.showMap()}>
                          <Text style={styles.lable_button}>Show map</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.col}>
                        <TouchableOpacity style={[styles.buttonContainer, styles.addressButton]} onPress={() => this.showMap()}>
                          <Text style={styles.lable_button}>Address book</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='Address Name/ID'
                         />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='E-mail'
                            keyboardType="email-address"
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Number'
                            keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='Street'
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Nr.'
                            keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>                  
                        <Input
                            placeholder='City'
                        />
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.col}>
                        <Input
                            placeholder='City'
                        />
                      </View>
                      <View style={styles.col}>
                        <Input
                            placeholder='Country'
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
                        />
                      </View>
                      <View style={styles.col}>
                         <Input
                            placeholder='Latitude'
                            keyboardType="numeric"
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
                            minDate="2016-05-01"
                            maxDate="2016-06-01"
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
                                borderColor: '#007bff',
                                borderHight: 2
                              }
                              // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                          />
                      </View>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]} onPress={() => this.showMap()}>
                            <Text style={styles.lable_button}>Save address</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                      <Picker
                          selectedValue={this.state.country}
                          style={{height: 50, width: 100, margin: 10}}>
                          <Picker.Item label="Czech" value="Czech" />
                          <Picker.Item label="Slovak" value="Slovak" />
                      </Picker>
                      <Picker
                          selectedValue={this.state.parcel_type}
                          style={{height: 50, width: 100, margin: 10}}>
                          <Picker.Item label="Large" value="Large" />
                          <Picker.Item label="Normal" value="Normal" />
                      </Picker>
                      <Picker
                          selectedValue={this.state.currency}
                          style={{height: 50, width: 100, margin: 10}}>
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
                </KeyboardAwareScrollView>
              </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
      mapButton: {
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
});

export default RegisterParcel;
