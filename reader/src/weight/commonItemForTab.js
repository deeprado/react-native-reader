/*
 * description: home中的发现/社区/我的tab中的item控件
 */

import React, {Component} from 'react';
import {Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import {Icon} from 'react-native-elements';

import config from '../common/config';
import Dimen from '../utils/dimensionsUtil';

export default class CommonItemForTab extends Component {
  _onClick() {
    this.props.clickItem();
  }

  render() {
    return (
      <TouchableOpacity style={styles.body} onPress={this._onClick.bind(this)}>
        <Image style={styles.image} source={this.props.image} />
        <Text style={styles.title}>{this.props.title}</Text>
        <Icon
          name="chevron-right"
          type="feather"
          style={styles.rightIcon}
          size={20}
          color={config.css.color.appBlack}
        />
      </TouchableOpacity>
    );
  }
}

// CommonItemForTab.propTypes = {
//   clickItem: React.PropTypes.func,
//   image: React.PropTypes.any,
//   title: React.PropTypes.string,
// };

const styles = StyleSheet.create({
  body: {
    width: Dimen.window.width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 25,
  },
  title: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    marginLeft: 25,
    flex: 1,
  },
  rightIcon: {
    marginRight: 25,
  },
});
