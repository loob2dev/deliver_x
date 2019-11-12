import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import {
  get_all_countries,
  get_all_parcels,
  get_all_currencies,
  get_all_transport_requests,
  get_all_address,
  get_all_unaccepted_by_transporter,
  all_own_undelivered_transport_requests,
} from '../redux/actions/CallApiAction';
import colors from '../config/colors';
import { get_geo_code } from '../redux/actions/GeolocationAction';

class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      indeterminate: false,
    };
  }

  componentDidMount() {
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    try {
      const { dispatch } = this.props;
      if (this.props.person_info.transporter) {
        await Promise.all([
          dispatch(get_all_countries()),
          dispatch(get_all_parcels()),
          dispatch(get_all_currencies()),
          dispatch(get_geo_code()),
          dispatch(get_all_address()),
          dispatch(all_own_undelivered_transport_requests()),
          dispatch(get_all_unaccepted_by_transporter()),
        ]);
        this.props.navigation.navigate('TransporterDrawer');
      } else {
        await Promise.all([
          dispatch(get_all_countries()),
          dispatch(get_all_parcels()),
          dispatch(get_all_currencies()),
          dispatch(get_geo_code()),
          dispatch(get_all_address()),
          dispatch(get_all_transport_requests()),
        ]);
        this.props.navigation.navigate('OrderDrawer');
      }
    } catch (error) {
      console.log('Loding_Error', error);
    }
  };

  render() {
    const { progress, indeterminate } = this.state;
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.progress} />
      </View>
    );
  }
}

Loading.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.subScreen,
  },
  progress: {
    color: colors.progress,
  },
});

const mapStatetoProps = ({ login: { person_info } }) => ({ person_info });
export default connect(mapStatetoProps)(Loading);
