/*
 * description: 书单详情页面
 */

import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity, View, Modal} from 'react-native';

import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';

import TabBarOnlyText from '../../weight/TabBarOnlyText';

import config from '../../common/config';
import Dimen from '../../utils/dimensionsUtil';

import CategoryDetailTab from './categoryDetailTab';
import ToolBar from '../../weight/toolBar';

let tabNames = ['新书', '热门', '口碑', '完结'];

export default class CategoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      minor: '',
      toShow: false,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    const categoryList = this._stringArrayToObjectArray(this.state.chartsItem);
    this.setState({categoryList: categoryList});
  }

  _back() {
    this.props.navigation.pop();
  }

  _chooseMinor(obj) {
    if (obj.name === 'major') {
      this.setState({minor: '', toShow: false});
    } else {
      this.setState({minor: obj.value, toShow: false});
    }
  }

  _stringArrayToObjectArray(temp) {
    let array = new Array();
    let o1 = new Object();
    o1.name = 'major';
    o1.value = temp.major;
    array.push(o1);
    for (let i = 0; i < temp.mins.length; i++) {
      let element = temp.mins[i];
      let o = new Object();
      o.name = 'mins';
      o.value = element;
      array.push(o);
    }
    return array;
  }

  _closeModal() {
    this.setState({toShow: false});
  }

  _showChooseBox() {
    this.setState({toShow: true});
  }

  renderList(array) {
    let items = [];
    if (array) {
      for (let i = 0; i < array.length; i++) {
        let element = array[i];
        items.push(
          <TouchableOpacity
            key={i}
            activeOpacity={0.5}
            onPress={() => this._chooseMinor(element)}>
            <Text style={styles.chooseItem}>{element.value}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return items;
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolBar
          leftClick={this._back.bind(this)}
          title={this.state.minor === '' ? this.props.major : this.state.minor}
          rightIcon="bar-chart-2"
          rightClick={this._showChooseBox.bind(this)}
        />
        <ScrollableTabView
          scrollWithoutAnimation={true}
          tabBarPosition={'top'}
          renderTabBar={() => <TabBarOnlyText tabNames={tabNames} />}>
          <CategoryDetailTab
            gender={this.props.gender}
            type="new"
            major={this.props.major}
            minor={this.state.minor}
            tabLabel="新书"
            navigation={this.props.navigation}
          />
          <CategoryDetailTab
            gender={this.props.gender}
            type="hot"
            major={this.props.major}
            minor={this.state.minor}
            tabLabel="热门"
            navigation={this.props.navigation}
          />
          <CategoryDetailTab
            gender={this.props.gender}
            type="reputation"
            major={this.props.major}
            minor={this.state.minor}
            tabLabel="口碑"
            navigation={this.props.navigation}
          />
          <CategoryDetailTab
            gender={this.props.gender}
            type="over"
            major={this.props.major}
            minor={this.state.minor}
            tabLabel="完结"
            navigation={this.props.navigation}
          />
        </ScrollableTabView>
        <Modal
          visible={this.state.toShow}
          animationType={'none'}
          transparent={true}>
          <TouchableOpacity
            style={styles.modal}
            activeOpacity={1}
            onPress={() => this._closeModal()}>
            <View style={styles.listView}>
              {this.renderList(this.state.categoryList).map((item, i) => {
                return item;
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  listView: {
    backgroundColor: config.css.color.white,
    marginTop: config.css.headerHeight + 30,
    marginLeft: Dimen.window.width / 2 + 60,
  },
  chooseItem: {
    width: Dimen.window.width / 2 - 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: config.css.color.appBackground,
    borderColor: config.css.color.line,
    borderWidth: 1,
  },
});
