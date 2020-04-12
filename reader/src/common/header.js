/*
 * description: the common header of app
 */

'use strict';

import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Header, Icon} from 'react-native-elements';

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

import config from './config';

class CommonHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title ? props.title : '简阅',
      opened: true,
    };
    this._goSearch = this._goSearch.bind(this);
  }

  _goSearch() {
    this.props.navigation.navigate('Search');
  }

  _other() {}

  onOptionSelect(value) {
    this.setState({opened: false});
  }

  onTriggerPress() {
    this.setState({opened: true});
  }

  onBackdropPress() {
    this.setState({opened: false});
  }

  renderLeftComponent() {
    return null;
  }

  renderRightComponent() {
    return (
      <View style={styles.rightBox}>
        <View style={styles.searchBox}>
          <TouchableOpacity onPress={this._goSearch}>
            <Icon name="search" color="#fff" type="feather" size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.menuBox}>
          <TouchableOpacity onPress={this._other}>
            <Icon name="plus" color="#fff" type="feather" />
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  rightBox: {flexDirection: 'row', alignItems: 'center'},
  searchBox: {
    marginRight: 20,
  },
  menuBox: {
    marginRight: 20,
  },
});
export default CommonHeader;
