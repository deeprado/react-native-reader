/*
 * description: 搜索页面
 */

import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  InteractionManager,
  FlatList,
} from 'react-native';

import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import TagsGroup from '../weight/tagsGroup';
import Dimen from '../utils/dimensionsUtil';
import api from '../common/api';
import config from '../common/config';

import {
  searchHotWords,
  refreshHowWord,
  searchAutoComplete,
  searchBooks,
  backToInitState,
} from '../actions/searchAction';

import {storage} from '../storage';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWords: '',
      searchHistory: [],
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    // 请求热词,和获取历史搜索数据
    let searchW = this.props.searchWord;
    InteractionManager.runAfterInteractions(() => {
      dispatch(searchHotWords());
      this._storageSelectSearchHistory();
    });
    if (searchW) {
      this._changeSearchWord(searchW);
    } else {
      dispatch(backToInitState());
    }
  }

  _stringArrayToObjectArray(temp) {
    let array = [];
    for (let i = 0; i < temp.length; i++) {
      let element = temp[i];
      let o = {};
      o.word = element;
      array.push(o);
    }
    return array;
  }

  /**
   * 搜索关键字
   * @param {string} text 输入的关键字
   */
  _searchAutoComplete(text) {
    const {dispatch} = this.props;
    this.setState({searchWords: text});
    if (text) {
      dispatch(searchAutoComplete(text));
    }
  }

  /**
   * 按照输入的书名搜索符合的书的列表
   * @param {string} text 输入的书名
   */
  _submit(text) {
    const {dispatch} = this.props;
    if (text) {
      this._storageSaveSearchHistory(text);
      dispatch(searchBooks(text));
    }
  }

  _storageSelectSearchHistory() {
    storage
      .load({
        key: 'search',
      })
      .then((ret) => {
        let array = this._stringArrayToObjectArray(ret.search);
        this.setState({searchHistory: array});
      });
  }

  _storageSaveSearchHistory(text) {
    storage
      .load({
        key: 'search',
      })
      .then((ret) => {
        let index = ret.search.indexOf(text);
        if (index > -1) {
          ret.search.splice(index, 1);
        }
        ret.search.unshift(text);
        let searchStorage = {
          search: [],
        };
        searchStorage.search = ret.search;
        storage.save({key: 'search', rawData: searchStorage});
        let array = this._stringArrayToObjectArray(ret.search);
        this.setState({searchHistory: array});
      })
      .catch((err) => {
        if (err.name === 'NotFoundError') {
          let searchStorage = {
            search: [],
          };
          searchStorage.search.push(text);
          storage.save({key: 'search', rawData: searchStorage});
          let array = this._stringArrayToObjectArray(searchStorage.search);
          this.setState({searchHistory: array});
        } else {
          console.warn(err);
        }
      });
  }

  _storageRemoveSearchHistory() {
    storage.remove({
      key: 'search',
    });
    this.setState({searchHistory: []});
  }

  /**
   * 跳转书的介绍页面
   * @param {string} rowData 书的信息
   */
  _startReadDetail(rowData) {
    this.props.navigation.navigate('BookDetail', {
      bookId: rowData._id,
    });
  }

  /**
   * 修改关键字
   * @param {string} word 关键字
   */
  _changeSearchWord(word) {
    this._submit(word);
    this.setState({
      searchWords: word,
    });
  }

  _refreshHotWord() {
    const {dispatch, search} = this.props;
    dispatch(refreshHowWord(search.hotWords, search.hotPart));
  }

  _back() {
    const {dispatch, search} = this.props;
    if (search.searchState) {
      this.setState({searchWords: ''});
      dispatch(backToInitState());
    } else {
      this.props.navigation.pop();
    }
  }

  renderAutoComplete({item: rowData, index}) {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        onPress={() => this._changeSearchWord(rowData.word)}
        style={styles.autoItem}>
        <Text>{rowData.word}</Text>
      </TouchableOpacity>
    );
  }

  renderSearchData({item: rowData, index}) {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        onPress={() => this._startReadDetail(rowData)}>
        <View style={styles.item}>
          <Image
            style={styles.itemImage}
            source={
              rowData.cover
                ? {uri: api.IMG_BASE_URL + rowData.cover}
                : require('../assets/imgs/splash.jpg')
            }
          />
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <Text style={styles.itemDesc}>
              {rowData.latelyFollower +
                '人在追 | ' +
                (rowData.retentionRatio ? rowData.retentionRatio : 0) +
                '%读者留存 | ' +
                rowData.author +
                '著'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderSearchHistory({item: rowData, index}) {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        onPress={() => this._changeSearchWord(rowData.word)}>
        <View style={styles.historyItem}>
          <Icon
            type="feather"
            name="clock"
            color={config.css.color.appBlack}
            size={20}
          />
          <Text style={styles.historyItemText}>{rowData.word}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {search} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this._back.bind(this)}>
            <Icon
              type="feather"
              name="chevron-left"
              style={styles.headerIcon}
              size={25}
              color={config.css.color.appBlack}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.headerTextInput}
            value={this.state.searchWords}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="搜索..."
            underlineColorAndroid="transparent"
            onChangeText={(text) => this._searchAutoComplete(text)}
            onSubmitEditing={(event) => this._submit(event.nativeEvent.text)}
          />
        </View>
        <ScrollView style={styles.body}>
          {search.searchState ? (
            // 显示搜索结果
            <FlatList
              enableEmptySections={true}
              data={search.searchData}
              renderItem={this.renderSearchData.bind(this)}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
            />
          ) : (
            // 显示历史记录和热门搜索
            <View>
              <View style={styles.hotWordsHeader}>
                <Text style={styles.hotWordsHeaderText}>大家都在搜</Text>
                <Icon
                  type="feather"
                  name="refresh-cw"
                  size={20}
                  style={{marginTop: 2}}
                  color={config.css.color.appBlack}
                  onPress={this._refreshHotWord.bind(this)}
                />
                <Text
                  style={{
                    fontSize: config.css.fontSize.desc,
                    marginLeft: 5,
                    marginRight: 30,
                  }}
                  onPress={this._refreshHotWord.bind(this)}>
                  换一批
                </Text>
              </View>
              <TagsGroup
                tags={search.hotWordsPart}
                checkTag={(tag) => this._changeSearchWord(tag)}
              />
              <View style={styles.hotWordsHeader}>
                <Text style={styles.hotWordsHeaderText}>搜索历史</Text>
                <Icon
                  type="feather"
                  name="trash"
                  size={20}
                  style={{marginTop: 2}}
                  color={config.css.color.appBlack}
                  onPress={this._storageRemoveSearchHistory.bind(this)}
                />
                <Text
                  style={{
                    fontSize: config.css.fontSize.desc,
                    marginLeft: 5,
                    marginRight: 30,
                  }}
                  onPress={this._storageRemoveSearchHistory.bind(this)}>
                  清空
                </Text>
              </View>
              <FlatList
                data={this.state.searchHistory}
                renderItem={this.renderSearchHistory.bind(this)}
                keyExtractor={(item, index) => {
                  return index.toString();
                }}
              />
            </View>
          )}
          {search.autoComplete ? (
            <FlatList
              style={{position: 'absolute'}}
              enableEmptySections={true}
              data={search.autoComplete}
              renderItem={this.renderAutoComplete.bind(this)}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
            />
          ) : null}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: config.css.color.appBackground,
  },
  header: {
    height: config.css.headerHeight,
    paddingTop: config.css.statusBarHeight,
    backgroundColor: config.css.color.appMainColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  headerTextInput: {
    flex: 1,
    marginLeft: 20,
    padding: 0,
  },
  body: {
    // flex: 1
  },
  item: {
    flexDirection: 'row',
    height: 80,
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
  },
  autoItem: {
    height: 30,
    width: Dimen.window.width - 60,
    justifyContent: 'center',
    paddingLeft: 20,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: config.css.color.appBackground,
    borderColor: config.css.color.line,
    borderWidth: 1,
  },
  hotWordsHeader: {
    height: 30,
    width: Dimen.window.width,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginLeft: 14,
    marginRight: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotWordsHeaderText: {
    flex: 1,
    fontSize: config.css.fontSize.desc,
  },
  historyItem: {
    height: 30,
    width: Dimen.window.width - 48,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 24,
    marginRight: 24,
  },
  historyItemIcon: {
    marginTop: 2,
  },
  historyItemText: {
    marginLeft: 10,
    fontSize: config.css.fontSize.desc,
  },
});

function mapStateToProps(store) {
  const {search} = store;
  return {
    search,
  };
}

export default connect(mapStateToProps)(Search);
