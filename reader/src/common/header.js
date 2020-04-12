/*
 * description: the common header of app
 */

'use strict';

import React, {Component} from 'react';
import {View, Text} from 'react-native';

import {Header, Icon} from 'react-native-elements';
import config from './config';

class CommonHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title ? props.title : '简阅',
    };
    this._goSearch = this._goSearch.bind(this);
  }

  _goSearch() {
    this.props.navigation.navigate('Search');
  }

  _other() {}

  renderLeftComponent() {
    return null;
  }

  renderRightComponent() {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            marginRight: 20,
          }}>
          <Icon
            name="search"
            color="#fff"
            type="feather"
            size={20}
            onPress={this._goSearch}
          />
        </View>
        <View
          style={{
            marginRight: 20,
          }}>
          <Icon name="plus" color="#fff" type="feather" onPress={this._other} />
        </View>
      </View>
    );
  }

  render() {
    return (
      <Header
        backgroundColor={config.css.color.appMainColor}
        placement={'left'}
        leftComponent={this.renderLeftComponent()}
        centerComponent={{
          text: this.state.title,
          style: {color: '#fff', fontSize: 20},
        }}
        rightComponent={this.renderRightComponent()}
      />
    );
  }
}

export default CommonHeader;
