import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import { Card } from 'react-native-elements'
import colors from '../../config/colors'
import api from '../../config/api';
import ProgressScreen from '../Refer/ProgressScreen';

function Item({ item }) {
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
            <TouchableOpacity style={[styles.deleteButtonContainer, styles.deleteButton]}>
                <Text style={styles.lable_button}>Delete</Text>
            </TouchableOpacity>
        </Card>
      );
    }

class Address extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoading: true,
        }
    }

    componentDidMount() {
        return fetch(api.get_all_address_book_items)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
              data: responseJson,
              isLoading: false
            })
            console.log("all address", responseJson)
        })
        .catch((error) => {
           console.error(error);
        });
    }

    render() {
        if (this.state.isLoading) {
            return <ProgressScreen/>
        }
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
                    centerComponent={{ text: 'Address Book', style: { color: '#fff' } }}
                    leftComponent={<Icon name="arrow-back" style={{ color: '#fff' }} onPress={() => this.props.navigation.pop()} />}                 
                />
                <TouchableOpacity style={[styles.save_addressContainer, styles.addressButton]}>
                    <Text style={styles.lable_button}>Add address</Text>
                </TouchableOpacity>
                <SafeAreaView style={styles.container}>
                  <FlatList
                    data={this.state.data}
                    numColumns={1}
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
    save_addressContainer: {
        height:38,
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        margin: 20,
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
});

export default Address;
