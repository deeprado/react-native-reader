/*
 * description: 排行榜详情的tab页面
 */

import React, {Component} from 'react';
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  InteractionManager,
  FlatList,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import request from '../../utils/httpUtil';
import config from '../../common/config';
import Dimen from '../../utils/dimensionsUtil';
import api from '../../common/api';
import Loading from '../../weight/loading';
import LoadingMore from '../../weight/loadingMore';

export default class ChartsDetailTab extends Component {
  // static propTypes = {
  //   chartsId: React.PropTypes.string,
  // };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chartsDetailBooks: [],
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._getChartsTabDetail();
    });
  }

  _getChartsTabDetail() {
    this.setState({isLoading: true});
    request.get(
      api.DISCOVER_CHARTS_DETAIL(this.props.chartsId),
      null,
      (data) => {
        data.ok
          ? this.setState({
              isLoading: false,
              chartsDetailBooks: data.ranking.books,
            })
          : null;
      },
      (error) => {
        this.setState({isLoading: false});
      },
    );
  }

  /**
   * 跳转书的介绍页面
   * @param {string} id 书的信息
   */
  _goToBookDetail(id) {
    this.props.navigation.navigate('BookDetail', {
      bookId: id,
    });
  }

  renderBookList({item: rowData}) {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this._goToBookDetail(rowData._id)}>
        <View style={styles.item}>
          <Image
            style={styles.itemImage}
            source={
              rowData.cover
                ? {uri: api.IMG_BASE_URL + rowData.cover}
                : require('../../assets/imgs/splash.jpg')
            }
          />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <Text style={styles.itemDesc}>
              {rowData.author + ' | ' + rowData.cat}
            </Text>
            <Text style={styles.itemDesc} numberOfLines={1}>
              {rowData.shortIntro}
            </Text>
            <Text style={styles.itemDesc}>
              {rowData.latelyFollower +
                '在追 | ' +
                rowData.retentionRatio +
                '%读者留存'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    return <LoadingMore hasMore={false} />;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <FlatList
            style={styles.body}
            data={this.state.chartsDetailBooks}
            ListFooterComponent={this.renderFooter.bind(this)}
            renderItem={this.renderBookList.bind(this)}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground,
    alignItems: 'stretch',
  },
  body: {
    flex: 1,
  },
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line,
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    alignSelf: 'center',
    width: 40,
    height: 60,
  },
  itemBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    marginBottom: 3,
  },
  itemDesc: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginTop: 3,
    marginRight: 14,
  },
});
