import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import colors from '../../config/colors';
import { Divider} from 'react-native-elements';
import key from '../../config/api_keys';
import api from '../../config/api';
import ProgressScreen from '../Refer/ProgressScreen';

function Item({ item }) {
      return (
        <View style={styles.item}>
          <View style={styles.item_container}>
            <Text style={styles.label}>ParcelNr: </Text>
            <Text>{item.id}</Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>AddressName: </Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>receiverEmail: </Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>DeliveryStatus: </Text>
          </View>
          <View style={styles.item_container}>
            <Text style={styles.label}>receiverNumber: </Text>
          </View>
          <Divider style={{ backgroundColor: '#000' }} />
        </View>
      );
    }

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
      console.log('Authorization', this.props.navigation.state.params.person_info.token)
      return fetch(api.get_all_own_undelivered_transport_requests, {
        method: 'GET',
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

    render() {
        if (this.state.isLoading) {
              return (
                <View style={styles.container}>
                     <Header
                      backgroundColor={colors.headerColor}
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
                    centerComponent={{ text: 'Request History', style: { color: '#fff' } }}
                    leftComponent={<Icon name="menu" style={{ color: '#fff' }} onPress={() => this.props.navigation.openDrawer()} />}
                />
                <SafeAreaView style={styles.container}>
                  <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => <Item item={item} />}
                    keyExtractor={item => item.id}
                  />
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 8,
    },
    item_container: {
      flex: 1,
      flexDirection: 'row'
    },
    title: {
      fontSize: 32,
    },
    label: {
      width: 120
    }
});

export default DataList;
