/*
 * description: 星级评定控件
 */

import React, {Component} from 'react';
import {View} from 'react-native';
import {Icon} from 'react-native-elements';
import config from '../common/config';

export default class StarLevel extends Component {
  renderRatingMap(rating) {
    let items = [];
    for (let i = 0; i < 5; i++) {
      items.push(
        i < rating ? (
          <View key={i}>
            <Icon
              type="foundation"
              name="star"
              size={15}
              color={config.css.color.appMainColor}
            />
          </View>
        ) : (
          <View key={i}>
            <Icon
              type="feather"
              name="star"
              size={15}
              color={config.css.color.appMainColor}
            />
          </View>
        ),
      );
    }
    return items;
  }
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        {this.renderRatingMap(this.props.rating).map((item, i) => {
          return item;
        })}
      </View>
    );
  }
}
