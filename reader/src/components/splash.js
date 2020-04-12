/*
 * description: 启动页
 */

import React, {Component} from 'react';
import {View, Image, StatusBar, StyleSheet} from 'react-native';

import Dimen from '../utils/dimensionsUtil';

export default class Splash extends Component {
  // 倒计时2秒后进入首页
  componentDidMount() {
    let {navigation} = this.props;
    this.timer = setTimeout(() => {
      navigation.navigate('AppPage');
    }, 2000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.root}>
        <StatusBar hidden={true} />
        <Image
          style={styles.image}
          source={require('../assets/imgs/splash.jpg')}
          resizeMode={'cover'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  image: {
    width: Dimen.window.width,
    height: Dimen.window.height,
  },
});
