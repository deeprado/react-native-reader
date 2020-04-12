/*
 * description: 发现tab
 */

import React, {Component} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';

import CommonItemForTab from '../weight/commonItemForTab';

import config from '../common/config';
import CommonHeader from '../common/header';

export default class Discover extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  /**
   * 跳转排行榜
   */
  _goToCharts() {
    this.props.navigation.navigate('Charts');
  }

  /**
   * 跳转主题书单
   */
  _goToThemeBookList() {
    this.props.navigation.navigate('BookList');
  }

  /**
   * 跳转分类
   */
  _goToClassify() {
    this.props.navigation.navigate('CategoryList');
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.body}>
          <CommonHeader title="发现" navigation={this.props.navigation} />

          <CommonItemForTab
            title={'排行榜'}
            image={require('../assets/imgs/icon_charts.png')}
            clickItem={() => this._goToCharts()}
          />
          <View style={styles.line} />
          <CommonItemForTab
            title={'主题书单'}
            image={require('../assets/imgs/icon_booklist.png')}
            clickItem={() => this._goToThemeBookList()}
          />
          <View style={styles.line} />
          <CommonItemForTab
            title={'分类'}
            image={require('../assets/imgs/icon_category.png')}
            clickItem={() => this._goToClassify()}
          />
        </View>
      </SafeAreaView>
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
