import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Header, Card } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import colors from '../../config/colors';
import { Divider} from 'react-native-elements';
import key from '../../config/api_keys';
import api from '../../config/api';
import ProgressScreen from '../Refer/ProgressScreen';
import { getDeliveryStatus } from "../../utils/requestStatus";

class DataList extends Component {
    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="list" style={{ fontSize: 24, color: tintColor }} />
        )
    }

    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        data: null    
      }
    }
    
    componentDidMount() {
      return fetch(api.get_all_transport_requests, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.props.navigation.state.params.person_info.token
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson,
          isLoading: false
        })
        console.log(responseJson)
      })
      .catch((error) => {
        console.error(error);
      });
    }

    Item = ({ item }) => {
      return (
        <Card>
          <View style={styles.item_container}>
            <Text style={styles.label}>Created: </Text>
            <TouchableOpacity onPress={() => this.props.navigation.state.params.parent.navigation.navigate('RequestDetail', {data: item, person_info: this.props.navigation.state.params.person_info})}>
              <Text style={[styles.value, {color: 'blue'}]}>{new Date(item.created).toLocaleString()}</Text>
            </TouchableOpacity>            
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Address: </Text>
            <Text style={styles.value}>{item.senderStreet + item.senderHouseNr + ", " + item.senderCity}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>E-mail: </Text>
            <Text style={styles.value}>{item.senderEmail}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>Status: </Text>
            <Text style={styles.value}>{getDeliveryStatus(item.status)}</Text>
          </View>
        </Card>
      );
    }

    render() {
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
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
                    containerStyle={{marginTop: Platform.OS === 'ios' ? 0 : - 24}}
                    centerComponent={{ text: 'Request History', style: { color: '#fff' } }}
                    leftComponent={<Icon name="menu" style={{ color: '#fff' }} onPress={() => this.props.navigation.openDrawer()} />}
                />
                <SafeAreaView style={styles.container}>
                  <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => <this.Item item={item} />}
                    keyExtractor={item => item.id}
                  />
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item_container: {
      flexGrow: 1,
      margin:5
    },
    title: {
      fontSize: 32,
    },
    label: {
      width: 120,
      fontSize: 12
    },
    value: {
      marginTop: 5,
      marginLeft: 35,
      fontSize: 15
    }
});

export default DataList;
