/*
 * description: 书单详情页面
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

import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import config from '../../common/config';
import Dimen from '../../utils/dimensionsUtil';
import api from '../../common/api';
import request from '../../utils/httpUtil';
import {wordCountFormat} from '../../utils/formatUtil';
import Toast from '../../weight/toast';
import Loading from '../../weight/loading';
import CommonText from '../../weight/commonText';
import ToolBar from '../../weight/toolBar';
import {realm} from '../../storage';

export default class BookListDetail extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;

    this.state = {
      isLoadingDetail: false,
      bookListDetail: null,
      bookListId: props.bookListId ? props.bookListId : params.bookListId,
    };
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    const bookListId = this.state.bookListId;
    InteractionManager.runAfterInteractions(() => {
      this._getBookListDetailData(bookListId);
    });
  }

  _back() {
    this.props.navigation.pop();
  }

  _getBookListDetailData(id) {
    this.setState({isLoadingDetail: true});
    request.get(
      api.DISCOVER_BOOK_LIST_DETAIL(id),
      null,
      (data) => {
        data.ok && data.bookList._id
          ? this.setState({
              isLoadingDetail: false,
              bookListDetail: data.bookList,
            })
          : this.setState({isLoadingDetail: false, bookListDetail: null});
      },
      (error) => {
        this.setState({isLoadingDetail: false, bookListDetail: null});
      },
    );
  }

  /**
   * 添加到我的收藏
   */
  _collectToMine() {
    if (this.state.bookListDetail) {
      this.saveBookListsToRealm(this.state.bookListDetail);
    }
  }

  /**
   * 是否已经保存过书单
   * @param {string} bookListId 书单id
   */
  hasSaveCollectionBookLists(bookListId) {
    let book = realm.objectForPrimaryKey('MyCollectionBookLists', bookListId);
    console.log('是否已经保存过书单', book);
  }

  /**
   * 向数据库中保存当前书单概况
   */
  saveBookListsToRealm(bookListDetail) {
    let book = realm.objectForPrimaryKey(
      'MyCollectionBookLists',
      bookListDetail._id,
    );
    realm.write(() => {
      if (book) {
        realm.create(
          'MyCollectionBookLists',
          {id: bookListDetail._id, isToShow: true},
          true,
        );
        Toast.toastLong('书单已经保存过了');
      } else {
        realm.create('MyCollectionBookLists', {
          id: bookListDetail._id,
          author: bookListDetail.author.nickname,
          bookCount: bookListDetail.total,
          collectorCount: bookListDetail.collectorCount,
          cover: bookListDetail.books[0].book.cover,
          desc: bookListDetail.desc,
          title: bookListDetail.title,
          gender: bookListDetail.gender,
          collectionTime: new Date(),
          isToShow: true,
        });
        Toast.toastShort('保存成功');
      }
    });
  }

  _goToBookListDetail(bookId) {
    this.props.navigation.push('BookDetail', {
      bookId: bookId,
    });
  }

  renderBookList({item: rowData, index}) {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => this._goToBookListDetail(rowData.book._id)}>
        <View style={styles.item}>
          <View style={styles.itemTop}>
            <Image
              style={styles.itemImage}
              source={
                rowData.book.cover
                  ? {uri: api.IMG_BASE_URL + rowData.book.cover}
                  : require('../../assets/imgs/splash.jpg')
              }
            />
            <View style={styles.itemTopBody}>
              <Text style={styles.itemTitle}>{rowData.book.title}</Text>
              <Text style={styles.itemDesc}>{rowData.book.author}</Text>
              <Text style={styles.itemDesc}>
                {rowData.book.latelyFollower +
                  '人在追 | ' +
                  wordCountFormat(rowData.book.wordCount)}
              </Text>
            </View>
          </View>
          <View style={styles.itemLine} />
          <View style={styles.itemBottom}>
            <Text style={styles.itemDesc}>{rowData.book.longIntro}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderBookListHeader() {
    return (
      <View style={styles.bodyHeader}>
        <Text style={styles.itemTitle}>{this.state.bookListDetail.title}</Text>
        <Text style={styles.itemDesc}>{this.state.bookListDetail.desc}</Text>
        <Text style={styles.itemDesc}>
          {'共' +
            this.state.bookListDetail.total +
            '本书 | 被收藏' +
            this.state.bookListDetail.collectorCount +
            '次'}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 14,
          }}>
          <Image
            style={styles.bodyHeaderImage}
            source={
              this.state.bookListDetail.author.avatar
                ? {
                    uri:
                      api.IMG_BASE_URL +
                      this.state.bookListDetail.author.avatar,
                  }
                : require('../../assets/imgs/splash.jpg')
            }
          />
          <Text style={styles.bodyHeaderAuthor}>
            {this.state.bookListDetail.author.nickname}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolBar
          leftClick={this._back.bind(this)}
          title="书单详情"
          rightIcon="bar-chart-2"
          rightClick={this._collectToMine.bind(this)}
        />
        {this.state.isLoadingDetail ? (
          <Loading />
        ) : (
          <View>
            {this.state.bookListDetail ? (
              <FlatList
                style={{backgroundColor: config.css.color.line}}
                enableEmptySections={true}
                data={this.state.bookListDetail.books}
                ListHeaderComponent={this.renderBookListHeader.bind(this)}
                renderItem={this.renderBookList.bind(this)}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
              />
            ) : (
              <View
                style={{
                  marginTop: 30,
                }}>
                <CommonText text="暂无数据" />
              </View>
            )}
          </View>
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
  bodyHeader: {
    backgroundColor: config.css.color.white,
    padding: 14,
  },
  bodyHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bodyHeaderAuthor: {
    alignSelf: 'center',
    flex: 1,
    marginLeft: 14,
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
  },
  item: {
    width: Dimen.window.width - 16,
    margin: 8,
    backgroundColor: config.css.color.white,
    borderWidth: 1,
    borderColor: config.css.color.white,
    borderRadius: 5,
  },
  itemTop: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 14,
  },
  itemLine: {
    height: 1,
    backgroundColor: config.css.color.line,
    marginLeft: 14,
    marginRight: 14,
  },
  itemBottom: {
    borderRadius: 10,
    flexDirection: 'row',
    margin: 14,
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    alignSelf: 'center',
    width: 45,
    height: 60,
  },
  itemTopBody: {
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
  },
});
