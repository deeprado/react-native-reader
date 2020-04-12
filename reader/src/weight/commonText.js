/*
 * description: loading
 */

import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class CommonText extends Component {
  // static propTypes = {
  //   text: React.PropTypes.string,
  // };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{this.props.text}</Text>
      </View>
    );
  }
}
