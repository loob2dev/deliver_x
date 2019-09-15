import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import { Left, Right, Icon } from 'native-base';
import colors from '../../config/colors'

class TaxiParcel extends Component {
    static navigationOptions = {
        drawerIcon: ({ tintColor }) => (
            <Icon name="home" style={{ fontSize: 24, color: tintColor }} />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor={colors.headerColor}
                    leftComponent={<Icon name="menu" style={{ color: '#fff' }} onPress={() => this.props.navigation.openDrawer()} />}
                />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Homepage</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default TaxiParcel;
