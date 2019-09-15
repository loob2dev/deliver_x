import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Input } from 'react-native-elements';
import { Icon } from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import api from '../../config/api';
import ProgressScreen from '../Refer/ProgressScreen';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      email_error: false,
      password: '',
      password_error: false,
      isLoading: false
    }
  }

  onClickListener = (viewId) => {
    Alert.alert("Alert", "Button pressed "+viewId);
  }

  login = () => {
    this.props.navigation.navigate('Drawer', {email: 'example@email.com'});
    // if (this.state.email == '') {
    //     this.setState({email_error: true});
    // }
    // if (this.state.password == '') {
    //     this.setState({password_error: true});
    // }
    // if (this.state.email == '' || this.state.password == '') {
    //     return;
    // }

    // this.setState({isLoading: true});
    // return fetch(api.authenticate, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json-patch+json',
    //   },
    //   body: JSON.stringify({
    //       "email": this.state.email,
    //       "password": this.state.password,
    //       "mobilePhoneNr": null,
    //       "token": null,
    //       "deviceID": null
    //   }),
    // })
    // .then((response) => response.json())
    // .then((responseJson) => {
    //     this.setState({isLoading: false});

    //     if (responseJson.message){
    //         Alert.alert("Error", responseJson.message);
       
    //         return;
    //     }
    //    this.props.navigation.navigate('Drawer', {email: responseJson.email});

    //    return;
    // })
    // .catch((error) => {
    //   Alert.alert("Alert", error);
    // });
  }

  render() {
    if(this.state.isLoading) {  
      return <ProgressScreen/>
    }
    else {
        return (
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Input
              keyboardType="email-address"
              leftIcon={
                <Icon
                  name='mail'
                  size={24}
                  color='#82847c'
               />
              }
              onChangeText={(email) => this.setState({email, email_error: false})}
             />
            </View>
            {
                this.state.email_error &&
                <Text style={styles.error}>
                  Email is required!
                </Text>
            }            
            <View style={styles.inputContainer}>
              <Input
              secureTextEntry={true}
              leftIcon={
                <Icon
                  name='key'
                  size={24}
                  color='#82847c'
               />
              }
              onChangeText={(password) => this.setState({password, password_error: false})}
             />
            </View>
            {
                this.state.password_error &&
                <Text style={styles.error}>
                      Password is required!
                  </Text>
            }
            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.login()}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

             <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
                <Text>Forgot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => this.onClickListener('register')}>
                <Text>Register</Text>
            </TouchableOpacity>
          </View>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
      width:'80%',
      height:45,
      marginBottom:20,
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  error: {
    color: "#b00020",
    marginBottom: 20
  }
});