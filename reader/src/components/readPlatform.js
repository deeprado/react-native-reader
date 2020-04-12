/*
 * description: 阅读器
 */

import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  InteractionManager,
  Platform,
  FlatList,
  ImageBackground,
} from 'react-native';

import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import request from '../utils/httpUtil';
import Dimen from '../utils/dimensionsUtil';
import {timeFormat, contentFormat} from '../utils/formatUtil';
import Toast from '../weight/toast';
import Loading from '../weight/loading';
import api from '../common/api';
import config from '../common/config';
import {realm} from '../storage';

export default class ReadPlatform extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;

    this.state = {
      bookName: '',
      showControlStation: false,
      showSaveModal: false,
      showListModal: false,
      bookChapter: null,
      chapterDetail: [],
      chapterNum: 0,
      chapterLength: 0,
      time: '',
      bookId: props.bookId ? props.bookId : params.bookId,
      bookDetail: props.bookDetail ? props.bookDetail : params.bookDetail,
    };
    this.count = 0; // 偏移量临界值
    this.currentChapter = ''; // 当前章节的页数
    this.nextChapter = ''; // 下一章节的页数
    this.number = 0; // 当前章节的章数
    this.x = 0; // 当前的偏移量
  }

  componentDidMount() {
    this.initData();
  }

  initData() {
    let bookId = this.state.bookId;
    let book = realm.objectForPrimaryKey('HistoryBook', bookId);
    if (this.state.bookDetail) {
      this.setState({bookName: this.state.bookDetail.title});
    } else {
      this.setState({bookName: book.bookName});
    }
    InteractionManager.runAfterInteractions(() => {
      this._getBookChapter(bookId, book ? book.historyChapterNum : 0);
    });
  }

  _getBookChapter(bookId, num) {
    request.get(
      api.READ_BOOK_CHAPTER_LIST(bookId),
      null,
      (data) => {
        if (data.ok) {
          this._getChapterDetailTwice(data.mixToc, num);
        } else {
          this.setState({bookChapter: null});
        }
      },
      (error) => {
        this.setState({bookChapter: null});
      },
    );
  }

  _getChapterDetailTwice(bookChapter, num) {
    let chapterUrl = bookChapter.chapters[num].link;
    let tempUrl = chapterUrl.replace(/\//g, '%2F').replace('?', '%3F');
    request.get(
      api.READ_BOOK_CHAPTER_DETAIL(tempUrl),
      null,
      (data) => {
        if (data.ok) {
          let _currentChapter = data.chapter.body;
          let _arr = this._formatChapter(
            _currentChapter,
            num,
            bookChapter.chapters[num].title,
          );
          this._updateHistoryBookChapter(this.state.bookId, num);
          this.currentChapter = _arr.length;
          if (num + 1 >= bookChapter.chapters.length) {
            this.setState({
              bookChapter: bookChapter,
              chapterDetail: _arr,
              chapterNum: num,
              chapterLength: bookChapter.chapters.length,
              time: timeFormat(),
            });
          } else {
            let nextTempUrl = bookChapter.chapters[num + 1].link
              .replace(/\//g, '%2F')
              .replace('?', '%3F');
            request.get(
              api.READ_BOOK_CHAPTER_DETAIL(nextTempUrl),
              null,
              (data) => {
                if (data.ok) {
                  let _nextChapter = data.chapter.body;
                  let _arr2 = this._formatChapter(
                    _nextChapter,
                    num + 1,
                    bookChapter.chapters[num + 1].title,
                  );
                  this.nextChapter = _arr2.length;
                  _arr = _arr.concat(_arr2);
                  this.setState({
                    bookChapter: bookChapter,
                    chapterDetail: _arr,
                    chapterNum: num,
                    chapterLength: bookChapter.chapters.length,
                    time: timeFormat(),
                  });
                }
              },
            );
          }
        } else {
          Toast.toastShort('加载失败,请重试');
        }
      },
      (error) => {
        Toast.toastShort('加载失败,请重试');
      },
    );
  }

  _chapterDetailFromNet(url, num) {
    let tempUrl = url.replace(/\//g, '%2F').replace('?', '%3F');
    let tempChapterDetail = null;
    request.get(
      api.READ_BOOK_CHAPTER_DETAIL(tempUrl),
      null,
      (data) => {
        data.ok
          ? (tempChapterDetail = data.chapter.body)
          : Toast.toastShort('加载失败,请重试');
      },
      (error) => {
        Toast.toastShort('加载失败,请重试');
      },
    );
    return tempChapterDetail;
  }

  _formatChapter(content, num, title) {
    let _arr = [];
    let _content = '\u3000\u3000' + content.replace(/\n/g, '@\u3000\u3000');
    let _arrTemp = contentFormat(_content);
    _arrTemp.forEach(function (element) {
      let _chapterInfo = {
        title: title,
        num: num,
        content: element,
      };
      _arr.push(_chapterInfo);
    });
    return _arr;
  }

  handleScroll(e) {
    // console.log('e.nativeEvent.contentOffset.x', e.nativeEvent.contentOffset.x)
    let arr = [];
    let chapterInfo;
    let x = e.nativeEvent.contentOffset.x;
    if (this.count === 0) {
      this.count = (this.currentChapter - 1) * Dimen.window.width;
    }

    this.x = x;
    if (x > this.count) {
      this.a = this.count;
      this.count += this.nextChapter * Dimen.window.width;
      // 获取下一章节
      if (this.state.chapterNum + 2 < this.state.chapterLength) {
        let tempUrl = this.state.bookChapter.chapters[
          this.state.chapterNum + 2
        ].link
          .replace(/\//g, '%2F')
          .replace('?', '%3F');
        request.get(
          api.READ_BOOK_CHAPTER_DETAIL(tempUrl),
          null,
          (data) => {
            if (data.ok) {
              let tempArr = this._formatChapter(
                data.chapter.body,
                this.state.chapterNum + 2,
                this.state.bookChapter.chapters[this.state.chapterNum + 2]
                  .title,
              );
              this._updateHistoryBookChapter(
                this.state.bookId,
                this.state.chapterNum + 1,
              );
              this.setState({
                chapterDetail: this.state.chapterDetail.concat(tempArr),
                chapterNum: this.state.chapterNum + 1,
                time: timeFormat(),
              });
            } else {
              Toast.toastShort('获取下一章节失败~~');
            }
          },
          (error) => {
            Toast.toastShort('获取下一章节失败~~');
          },
        );
      } else {
        Toast.toastShort('已到达最后一页~~');
      }
    }

    if (Platform.OS === 'ios') {
      if (x < 0 && this.state.chapterNum === 0) {
        Toast.toastShort('已到达第一页~~');
      }

      if (x < 0 && this.state.chapterNum !== 0) {
        let tempUrl = this.state.bookChapter.chapters[
          this.state.chapterNum - 1
        ].link
          .replace(/\//g, '%2F')
          .replace('?', '%3F');
        request.get(
          api.READ_BOOK_CHAPTER_DETAIL(tempUrl),
          null,
          (data) => {
            if (data.ok) {
              let tempArr = this._formatChapter(
                data.chapter.body,
                this.state.chapterNum - 1,
                this.state.bookChapter.chapters[this.state.chapterNum - 1]
                  .title,
              );
              this._updateHistoryBookChapter(
                this.state.bookId,
                this.state.chapterNum - 1,
              );
              this.setState({
                chapterDetail: tempArr.concat(this.state.chapterDetail),
                chapterNum: this.state.chapterNum - 1,
                time: timeFormat(),
              });
              let scrollView = this.scrollView;
              scrollView.scrollTo({
                x: (tempArr.length - 1) * Dimen.window.width,
                y: 0,
                animated: false,
              });
            } else {
              Toast.toastShort('获取上一章节失败~~');
            }
          },
          (error) => {
            Toast.toastShort('获取上一章节失败~~');
          },
        );
      }
    } else {
      if (x === 0 && this.state.chapterNum === 0) {
        Toast.toastShort('已到达第一页~~');
      }

      if (x === 0 && this.state.chapterNum !== 0) {
        let tempUrl = this.state.bookChapter.chapters[
          this.state.chapterNum - 1
        ].link
          .replace(/\//g, '%2F')
          .replace('?', '%3F');
        request.get(
          api.READ_BOOK_CHAPTER_DETAIL(tempUrl),
          null,
          (data) => {
            if (data.ok) {
              let tempArr = this._formatChapter(
                data.chapter.body,
                this.state.chapterNum - 1,
                this.state.bookChapter.chapters[this.state.chapterNum - 1]
                  .title,
              );
              this._updateHistoryBookChapter(
                this.state.bookId,
                this.state.chapterNum - 1,
              );
              this.setState({
                chapterDetail: tempArr.concat(this.state.chapterDetail),
                chapterNum: this.state.chapterNum - 1,
                time: timeFormat(),
              });
              let scrollView = this.scrollView;
              scrollView.scrollTo({
                x: tempArr.length * Dimen.window.width,
                y: 0,
                animated: false,
              });
            } else {
              Toast.toastShort('获取上一章节失败~~');
            }
          },
          (error) => {
            Toast.toastShort('获取上一章节失败~~');
          },
        );
      }
    }
  }

  _back() {
    let bookId = this.state.bookId;
    let book = realm.objectForPrimaryKey('HistoryBook', bookId);
    if (book && book.isToShow !== 0) {
      this._toPop();
    } else {
      this.setState({showSaveModal: true});
    }
  }

  _closeModal() {
    this.setState({showSaveModal: false});
  }

  _toPop() {
    this.props.navigation.pop();
  }

  _toSaveAndPop() {
    let bookId = this.state.bookId;
    let book = realm.objectForPrimaryKey('HistoryBook', bookId);
    this._closeModal();
    if (!book || book.isToShow === 0) {
      this.saveBookToRealm(this.state.bookDetail, this.state.chapterNum);
    }
    this._toPop();
  }

  /**
   * 向数据库中保存当前书籍的记录
   */
  saveBookToRealm(bookDetail, chapterNum) {
    let bookId = this.state.bookId;
    let books = realm.objects('HistoryBook').sorted('sortNum');
    let book = realm.objectForPrimaryKey('HistoryBook', bookId);
    realm.write(() => {
      if (book) {
        if (book.bookId == books[books.length - 1].bookId) {
          realm.create(
            'HistoryBook',
            {bookId: book.bookId, isToShow: 1, historyChapterNum: chapterNum},
            true,
          );
        } else {
          let sortNum = books[books.length - 1].sortNum + 1;
          realm.create(
            'HistoryBook',
            {
              bookId: book.bookId,
              isToShow: 1,
              sortNum: books[books.length - 1].sortNum + 1,
              historyChapterNum: chapterNum,
            },
            true,
          );
        }
      } else {
        realm.create('HistoryBook', {
          bookId: bookDetail._id,
          bookName: bookDetail.title,
          bookUrl: bookDetail.cover,
          lastChapterTitle: bookDetail.lastChapter,
          historyChapterNum: chapterNum,
          lastChapterTime: bookDetail.updated,
          saveTime: new Date(),
          sortNum:
            books && books.length > 0 ? books[books.length - 1].sortNum + 1 : 0,
          isToShow: 1,
        });
      }
    });
  }

  /**
   * 进入书籍社区
   */
  _toBookCommunity() {
    this.props.navigation.navigate('BookCommunity', {
      bookId: this.state.bookId,
      page: 0,
    });
  }

  /**
   * 进入书籍详情界面
   */
  _toBookDetail() {
    this.props.navigation.push('BookDetail', {
      bookId: this.state.bookChapter.book,
    });
  }

  _showListModal() {
    this.setState({showListModal: true, showControlStation: false});
  }

  _closeListModal() {
    this.setState({showListModal: false});
  }

  _clickListModalItem(rowID) {
    this._getChapterDetailTwice(this.state.bookChapter, rowID);
    this._closeListModal();
  }

  _showControlStation(evt) {
    let pageX = evt.nativeEvent.pageX;
    let pageY = evt.nativeEvent.pageY;
    if (
      pageX > Dimen.window.width / 3 &&
      pageX < (Dimen.window.width * 2) / 3 &&
      pageY > Dimen.window.height / 3 &&
      pageY < (Dimen.window.height * 2) / 3
    ) {
      this.setState({showControlStation: true});
    }
  }

  _updateHistoryBookChapter(bookId, chapterNum) {
    let books = realm.objects('HistoryBook').sorted('sortNum');
    let book = realm.objectForPrimaryKey('HistoryBook', bookId);
    if (book) {
      realm.write(() => {
        if (book.bookId === books[books.length - 1].bookId) {
          realm.create(
            'HistoryBook',
            {bookId: book.bookId, historyChapterNum: chapterNum},
            true,
          );
        } else {
          let sortNum = books[books.length - 1].sortNum + 1;
          realm.create(
            'HistoryBook',
            {
              bookId: book.bookId,
              sortNum: books[books.length - 1].sortNum + 1,
              historyChapterNum: chapterNum,
            },
            true,
          );
        }
      });
    }
  }

  renderListModal({item: rowData, index: rowID}) {
    return (
      <TouchableOpacity
        key={rowID}
        activeOpacity={0.5}
        onPress={() => this._clickListModalItem(parseInt(rowID))}>
        {this.state.chapterNum !== parseInt(rowID) ? (
          <Text
            numberOfLines={1}
            style={[
              styles.listModalText,
              {
                fontSize: config.css.fontSize.title,
                color: config.css.fontColor.title,
              },
            ]}>
            {parseInt(rowID) + 1 + ' -- ' + rowData.title}
          </Text>
        ) : (
          <Text
            numberOfLines={1}
            style={[
              styles.listModalText,
              {
                fontSize: config.css.fontSize.title,
                color: config.css.fontColor.appMainColor,
              },
            ]}>
            {parseInt(rowID) + 1 + ' -- ' + rowData.title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  renderListView() {
    return (
      <FlatList
        enableEmptySections
        horizontal={true}
        pagingEnabled={true}
        initialListSize={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={this.state.chapterDetail}
        renderItem={this.renderItem.bind(this)}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />
    );
  }

  renderItem({item: rowData, index}) {
    return (
      <View style={{flexDirection: 'row'}} key={index}>
        <TouchableOpacity
          style={{height: Dimen.window.height, width: Dimen.window.width}}
          activeOpacity={1}>
          {this.renderContent(rowData)}
        </TouchableOpacity>
      </View>
    );
  }

  renderContent(rowData) {
    return (
      <View
        style={{flex: 1, justifyContent: 'space-between'}}
        onStartShouldSetResponder={() => true}
        onResponderRelease={(evt) => {
          this._showControlStation(evt);
        }}>
        <Text
          style={{
            fontSize: config.css.fontSize.desc,
            color: config.css.fontColor.desc,
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 10,
          }}>
          {rowData.title}
        </Text>
        <View style={{alignSelf: 'center', flex: 1}}>
          {rowData.content
            ? rowData.content.map((value, index, chapterContent) => {
                return (
                  <Text style={styles.ficContent} key={index}>
                    {value}
                  </Text>
                );
              })
            : null}
        </View>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text
            style={{
              fontSize: config.css.fontSize.desc,
              color: config.css.fontColor.desc,
            }}>
            {this.state.time}
          </Text>
          <Text
            style={{
              fontSize: config.css.fontSize.desc,
              color: config.css.fontColor.desc,
            }}>
            {rowData.num + 1 + ' / ' + this.state.chapterLength}
          </Text>
        </View>
      </View>
    );
  }

  renderControlStation() {
    return (
      <View
        style={{
          position: 'absolute',
          width: Dimen.window.width,
          height: Dimen.window.height,
        }}>
        <View
          style={[styles.control, {paddingTop: config.css.statusBarHeight}]}>
          <TouchableOpacity onPress={this._back.bind(this)}>
            <Icon
              type="feather"
              name="chevron-left"
              style={{marginLeft: 14, flex: 1}}
              size={25}
              color={config.css.color.appBlack}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={styles.controlHeaderTitle}
              onPress={this._toBookCommunity.bind(this)}>
              社区
            </Text>
            <Text
              style={styles.controlHeaderTitle}
              onPress={this._toBookDetail.bind(this)}>
              简介
            </Text>
          </View>
        </View>
        <Text
          onPress={() => {
            this.setState({showControlStation: false});
          }}
          style={{flex: 1}}
        />
        <View style={[styles.control, {height: 50}]}>
          <TouchableOpacity
            style={styles.controlFooterItem}
            onPress={this._back.bind(this)}>
            <Icon
              type="feather"
              name="settings"
              style={styles.controlFooterIcon}
              size={25}
              color={config.css.color.appBlack}
            />
            <Text style={styles.controlFooterTitle}>设置</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlFooterItem}
            onPress={this._back.bind(this)}>
            <Icon
              type="feather"
              name="download"
              style={styles.controlFooterIcon}
              size={25}
              color={config.css.color.appBlack}
            />
            <Text style={styles.controlFooterTitle}>缓存</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlFooterItem}
            onPress={this._back.bind(this)}>
            <Icon
              type="feather"
              name="bookmark"
              style={styles.controlFooterIcon}
              size={25}
              color={config.css.color.appBlack}
            />
            <Text style={styles.controlFooterTitle}>书签</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlFooterItem}
            onPress={this._showListModal.bind(this)}>
            <Icon
              type="feather"
              name="list"
              style={styles.controlFooterIcon}
              size={25}
              color={config.css.color.appBlack}
            />
            <Text style={styles.controlFooterTitle}>目录</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={!this.state.showControlStation}
          translucent={true}
          showHideTransition={'slide'}
          barStyle={'light-content'}
        />
        <ImageBackground
          source={require('../assets/imgs/read_bg.jpg')}
          style={{width: Dimen.window.width, height: Dimen.window.height}}>
          {this.state.chapterDetail.length === 0 ? (
            <Loading />
          ) : (
            <ScrollView
              ref={(scrollView) => (this.scrollView = scrollView)}
              scrollEventThrottle={800}
              horizontal={true}
              onScroll={(e) => this.handleScroll(e)}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              pagingEnabled={true}>
              <View>{this.renderListView()}</View>
            </ScrollView>
          )}
        </ImageBackground>
        {this.state.showControlStation ? this.renderControlStation() : null}
        <Modal
          visible={this.state.showSaveModal}
          animationType={'none'}
          transparent={true}>
          <TouchableOpacity
            style={styles.modal}
            activeOpacity={1}
            onPress={() => this._closeModal()}>
            <View style={styles.innerView}>
              <Text style={styles.modalTitle}>添书</Text>
              <Text style={styles.modalBody}>是否将本书加入到书架?</Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={styles.modalButton}
                  onPress={this._toPop.bind(this)}>
                  不了
                </Text>
                <Text
                  style={styles.modalButton}
                  onPress={this._toSaveAndPop.bind(this)}>
                  加入书架
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          visible={this.state.showListModal}
          animationType={'fade'}
          transparent={true}>
          <TouchableOpacity
            style={styles.listModal}
            activeOpacity={1}
            onPress={() => this._closeListModal()}>
            <Text style={styles.listModalTitle}>{this.state.bookName}</Text>
            <FlatList
              style={styles.innerListView}
              data={
                this.state.bookChapter ? this.state.bookChapter.chapters : []
              }
              renderItem={this.renderListModal.bind(this)}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
            />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTitle: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: 'bold',
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
  },
  textBody: {
    margin: 15,
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    lineHeight: 30,
  },
  ficContent: {
    color: '#604733',
    fontSize: 18,
    lineHeight: 34,
  },
  control: {
    height: config.css.headerHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: config.css.color.appMainColor,
  },
  controlHeaderTitle: {
    marginRight: 14,
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.title,
  },
  controlFooterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlFooterTitle: {
    color: config.css.fontColor.title,
    fontSize: config.css.fontSize.desc,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  innerView: {
    backgroundColor: config.css.color.white,
    borderWidth: 1,
    borderColor: config.css.color.line,
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalBody: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.title,
  },
  modalButton: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.appMainColor,
  },
  listModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerListView: {
    backgroundColor: '#fff3df',
    width: Dimen.window.width - 60,
    flex: 1,
  },
  listModalTitle: {
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
    backgroundColor: '#fff3df',
    width: Dimen.window.width - 60,
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    borderColor: config.css.color.line,
  },
  listModalText: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderColor: config.css.color.line,
  },
});
