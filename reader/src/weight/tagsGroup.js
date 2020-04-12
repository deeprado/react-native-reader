/*
 * description: 标签控件
 */

import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import config from '../common/config';

export default class TagsGroup extends Component {
  // static propTypes = {
  //   checkTag: React.PropTypes.func,
  // };

  onClick(tag) {
    if (this.props.checkTag) {
      this.props.checkTag(tag);
    }
  }

  renderTags(array) {
    let texts = [];
    if (array) {
      for (let i = 0; i < array.length; i++) {
        let boxColorIndex = i % 7;
        let element = array[i];
        texts.push(
          <TouchableOpacity
            activeOpacity={0.5}
            key={i}
            style={{
              alignSelf: 'center',
              margin: 5,
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 2,
              paddingBottom: 2,
              backgroundColor: config.css.boxColor[boxColorIndex],
            }}
            onPress={this.onClick.bind(this, element)}>
            <Text style={{color: '#ffffff'}}>{element}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return texts;
  }

  render() {
    return (
      <View
        style={{
          marginLeft: 14,
          marginRight: 14,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}>
        {this.renderTags(this.props.tags).map((item, i) => {
          return item;
        })}
      </View>
    );
  }
}
