import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';

import {
  get_all_countries,
  get_all_parcels,
  get_all_currencies,
  get_all_transport_requests,
  get_all_address,
} from '../redux/actions/CallApiAction';
import colors from '../config/colors';
import { get_geo_code } from '../redux/actions/GeolocationAction';

const load_step = 0.2;
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
      this.setState({ progress: this.state.progress + load_step });
      await dispatch(get_all_countries());
      this.setState({ progress: this.state.progress + load_step });
      await dispatch(get_all_parcels());
      this.setState({ progress: this.state.progress + load_step });
      await dispatch(get_all_currencies());
      this.setState({ progress: this.state.progress + load_step });
      await dispatch(get_geo_code());
      this.setState({ progress: this.state.progress + load_step });
      await dispatch(get_all_transport_requests());
      this.setState({ progress: this.state.progress + load_step });
      await dispatch(get_all_address());
      this.setState({ progress: this.state.progress + load_step }, () => {
        if (this.props.person_info.transporter) {
          this.props.navigation.navigate('TransporterDrawer');
        } else {
          this.props.navigation.navigate('OrderDrawer');
        }
      });
    } catch (error) {}
  };

  render() {
    const { progress, indeterminate } = this.state;
    return (
      <View style={styles.container}>
        <Progress.Bar style={styles.progress} progress={progress} indeterminate={indeterminate} />
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
