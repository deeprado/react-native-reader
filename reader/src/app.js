/*
 * description: the main activity of app
 */
'use strict';

import React, {Component} from 'react';
import {View, BackHandler, StatusBar, Text, SafeAreaView} from 'react-native';

import AppContainer from './navigator';
import config from './common/config';
import Toast from './weight/toast';

let firstClick = 0;

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  handleBack = () => {
    var times = new Date().valueOf();
    if (times - firstClick > 2000) {
      firstClick = times;
      Toast.toastShort('再按一次退出');
      return true;
    } else {
      return false;
    }
  };

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: config.css.color.appMainColor}}>
        <StatusBar
          backgroundColor={config.css.color.appMainColor}
          translucent={true}
          showHideTransition={'slide'}
          animated={true}
          hidden={false}
          barStyle="default"
        />
        <AppContainer />
      </SafeAreaView>
    );
  }
}
