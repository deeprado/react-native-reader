/*
 * description: loading

 */

import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import Dimen from '../utils/dimensionsUtil';

export default class LoadingMore extends Component {
  // static propTypes = {
  //   hasMore: React.PropTypes.bool,
  // };

  render() {
    return (
      <Text style={styles.bookListFooter}>
        {this.props.hasMore ? '正在加载更多~~~' : '没有更多了'}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  bookListFooter: {
    height: 30,
    width: Dimen.window.width,
    textAlign: 'center',
  },
});
