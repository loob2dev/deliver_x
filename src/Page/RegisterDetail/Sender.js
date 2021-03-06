import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';
import Moment from 'moment';

class Sender extends Component {
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
      <View style={styles.borderContainer}>
        <Text style={styles.subTitle}>Sender</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="Address Name/ID" disabled={true} value={this.state.data.senderAddressID} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="E-mail" keyboardType="email-address" disabled={true} value={this.state.data.senderEmail} />
          </View>
          <View style={styles.col}>
            <Input label="Phone" keyboardType="numeric" disabled={true} value={this.state.data.senderPhone} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="Street" disabled={true} value={this.state.data.senderStreet} />
          </View>
          <View style={styles.col}>
            <Input label="Nr." keyboardType="numeric" disabled={true} value={this.state.data.sender_street_nr} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="City" disabled={true} value={this.state.data.senderHouseNr} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="Postal Code" keyboardType="numeric" disabled={true} value={this.state.data.senderZip} />
          </View>
          <View style={styles.col}>
            <Input label="Country" disabled={true} value={this.state.data.senderCountry} />
          </View>
        </View>
        <Text style={styles.subTitle}>GPS</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="Longitude" keyboardType="numeric" disabled={true} value={this.state.data.senderLatitude.toString()} />
          </View>
          <View style={styles.col}>
            <Input label="Latitude" keyboardType="numeric" disabled={true} value={this.state.data.senderLongitude.toString()} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Input label="Loading Time" disabled={true} value={Moment(this.state.data.created).format('YYYY/MM/DD hh:mm')} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  dataPicker: {
    width: 200,
  },
  loadingtime: {
    marginLeft: 10,
    color: '#7d8690',
  },
});

const mapStatetoProps = ({ register_parcel: { transport_request_dto } }) => ({
  transport_request_dto,
});
export default connect(mapStatetoProps)(Sender);
