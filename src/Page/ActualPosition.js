import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';
import { connect } from 'react-redux';

import colors from '../config/colors';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ActualPosition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      // coords: {
      //   latitude: this.props.screenProps.latitude,
      //   longitude: this.props.screenProps.longitude,
      //   LATITUDE: this.props.screenProps.latitude,
      //   LONGITUDE: this.props.screenProps.longitude
      // }
    };
  }

  static navigationOptions = {
    drawerIcon: ({ tintColor }) => <Icon name="pin" style={{ fontSize: 24, color: tintColor }} />,
  };

  render() {
    const { coords } = this.props;

    return (
      <View style={styles.container}>
        <Header
          backgroundColor={colors.headerColor}
          containerStyle={styles.header_container}
          centerComponent={{ text: 'Actual Position', style: { color: '#fff' } }}
          leftComponent={
            <View style={styles.icon_container}>
              <Icon name="menu" style={styles.icon} onPress={() => this.props.navigation.openDrawer()} />
            </View>
          }
        />
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={{
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker coordinate={coords} />
        </MapView>
      </View>
    );
  }
}
ActualPosition.propTypes = {
  provider: ProviderPropType,
};
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
    height: height,
  },
});

const mapStatetoProps = ({ geolocation: { coords } }) => ({ coords });
export default connect(mapStatetoProps)(ActualPosition);
