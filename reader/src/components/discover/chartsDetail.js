/*
 * description: 单个榜单详情(自家)
 */

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import TabBarOnlyText from '../../weight/TabBarOnlyText';
import config from '../../common/config';

import ChartsDetailTab from './chartsDetailTab';
import ToolBar from '../../weight/toolBar';

let tabNames = ['周榜', '月绑', '总榜'];

export default class ChartsDetail extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      chartsItem: props.chartsItem ? props.chartsItem : params.chartsItem,
    };
  }

  componentDidMount() {}

  _back() {
    this.props.navigation.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolBar
          leftClick={this._back.bind(this)}
          title={this.state.chartsItem.title}
        />
        <ScrollableTabView
          scrollWithoutAnimation={true}
          tabBarPosition={'top'}
          renderTabBar={() => <TabBarOnlyText tabNames={tabNames} />}>
          <ChartsDetailTab
            chartsId={this.state.chartsItem._id}
            tabLabel="周榜"
            navigation={this.props.navigation}
          />
          <ChartsDetailTab
            chartsId={this.state.chartsItem.monthRank}
            tabLabel="月绑"
            navigation={this.props.navigation}
          />
          <ChartsDetailTab
            chartsId={this.state.chartsItem.totalRank}
            tabLabel="总榜"
            navigation={this.props.navigation}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground,
  },
});
