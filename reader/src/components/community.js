/*
 * description: 社区tab
 */

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import CommonItemForTab from '../weight/commonItemForTab';

import config from '../common/config';
import CommonHeader from '../common/header';

export default class Community extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  /**
   * 跳转综合讨论区/原创区/女生区
   * @param {string} block ramble:综合讨论区  original：原创区  girl: 女生区
   */
  _goToBookDiscussion(block) {
    this.props.navigation.navigate('BookDiscussion', {
      block: block,
    });
  }

  /**
   * 跳转书评区
   */
  _goToBookReview() {
    this.props.navigation.navigate('BookReview', {});
  }

  /**
   * 跳转书荒互助区
   */
  _goToBookHelp() {
    this.props.navigation.navigate('BookHelp', {});
  }

  /**
   * 跳转女生区
   */
  _goToGirlBookDiscussion() {
    this.props.navigation.navigate('GirlBookDiscussion', {});
  }

  render() {
    return (
      <View style={styles.body}>
        <CommonHeader title="社区" navigation={this.props.navigation} />

        <CommonItemForTab
          title={'综合讨论区'}
          image={require('../assets/imgs/icon_discussion.png')}
          clickItem={() => this._goToBookDiscussion('ramble')}
        />
        <View style={styles.line} />
        <CommonItemForTab
          title={'书评区'}
          image={require('../assets/imgs/icon_review.png')}
          clickItem={() => this._goToBookReview()}
        />
        <View style={styles.line} />
        <CommonItemForTab
          title={'书荒互助区'}
          image={require('../assets/imgs/icon_help.png')}
          clickItem={() => this._goToBookHelp()}
        />
        <View style={styles.line} />
        <CommonItemForTab
          title={'女生区'}
          image={require('../assets/imgs/icon_girl.png')}
          clickItem={() => this._goToBookDiscussion('girl')}
        />
        <View style={styles.line} />
        <CommonItemForTab
          title={'原创区'}
          image={require('../assets/imgs/icon_original.png')}
          clickItem={() => this._goToBookDiscussion('original')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  line: {
    height: 1,
    backgroundColor: config.css.color.line,
  },
});
