/*
 * description: 单个榜单详情(其他)
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

import {connect} from 'react-redux';

import config from '../../common/config';
import Dimen from '../../utils/dimensionsUtil';
import api from '../../common/api';
import {chartsDetail} from '../../actions/chartsAction';
import Loading from '../../weight/loading';
import LoadingMore from '../../weight/loadingMore';
import ToolBar from '../../weight/toolBar';

class ChartsDetailOther extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      chartsItem: props.chartsItem ? props.chartsItem : params.chartsItem,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    const {dispatch} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(chartsDetail(this.state.chartsItem._id));
    });
  }

  _back() {
    this.props.navigation.pop();
  }

  /**
   * 跳转书籍详情
   * @param {string} bookId 书籍id
   */
  _goToChartsDetail(bookId) {
    this.props.navigation.navigate('BookDetail', {
      bookId: bookId,
    });
  }

  renderMainItem({item: rowData}) {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData._id)}>
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
              {rowData.author + ' | ' + rowData.cat ? rowData.cat : '未知'}
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
    const {charts} = this.props;
    return (
      <View style={styles.container}>
        <ToolBar
          leftClick={this._back.bind(this)}
          title={this.state.chartsItem.title}
        />
        {charts.isLoadingDetail ? (
          <Loading />
        ) : (
          <FlatList
            enableEmptySections={true}
            style={styles.body}
            data={charts.chartsDetailBooks}
            ListFooterComponent={this.renderFooter.bind(this)}
            renderItem={this.renderMainItem.bind(this)}
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
  },
  body: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    height: 100,
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

function mapStateToProps(store) {
  const {charts} = store;
  return {
    charts,
  };
}

export default connect(mapStateToProps)(ChartsDetailOther);
