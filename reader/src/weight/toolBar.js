/*
 * description: 界面的toolbar
 */

import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import config from '../common/config';

export default class ToolBar extends Component {
  // static propTypes = {
  //   leftClick: React.PropTypes.func,
  //   leftIcon: React.PropTypes.string,
  //   title: React.PropTypes.string,
  //   rightClick: React.PropTypes.func,
  //   rightIcon: React.PropTypes.string,
  // };

  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={this.props.leftClick}>
          <Icon
            name={
              this.props.leftIcon === undefined
                ? 'chevron-left'
                : this.props.leftIcon
            }
            style={styles.headerIcon}
            type="feather"
            size={25}
            color={config.css.color.appBlack}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>{this.props.title}</Text>
        <TouchableOpacity onPress={this.props.rightClick}>
          <Icon
            name={
              this.props.rightIcon === undefined
                ? 'chevron-right'
                : this.props.rightIcon
            }
            type="feather"
            style={styles.headerIcon}
            size={25}
            color={
              this.props.rightIcon === undefined
                ? config.css.color.appMainColor
                : config.css.color.appBlack
            }
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: config.css.headerHeight,
    paddingTop: config.css.statusBarHeight,
    backgroundColor: config.css.color.appMainColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.appTitle,
  },
});
