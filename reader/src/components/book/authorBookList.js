/*
 * description: 标签书单
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

import request from '../../utils/httpUtil';
import config from '../../common/config';
import Dimen from '../../utils/dimensionsUtil';
import api from '../../common/api';
import Loading from '../../weight/loading';
import ToolBar from '../../weight/toolBar';

export default class AuthorBookList extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      isLoading: false,
      bookList: [],
      author: props.author ? props.author : params.author,
    };
  }

  componentDidMount() {}

  initData() {
    InteractionManager.runAfterInteractions(() => {
      this._getBookListDetail({author: this.state.author});
    });
  }

  _getBookListDetail(params) {
    this.setState({isLoading: true});
    request.get(
      api.BOOK_AUTHOR_BOOK_LIST,
      params,
      (data) => {
        data.ok
          ? this.setState({isLoading: false, bookList: data.books})
          : null;
      },
      (error) => {
        this.setState({isLoading: false});
      },
    );
  }

  _back() {
    this.props.navigation.pop();
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

  renderBookList({item: rowData, index}) {
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
              {rowData.author + ' | ' + rowData.majorCate}
            </Text>
            <Text style={styles.itemDesc} numberOfLines={1}>
              {rowData.shortIntro}
            </Text>
            <Text style={styles.itemDesc}>
              {rowData.latelyFollower +
                '在追 | ' +
                rowData.retentionRatio +
                '%人留存 | ' +
                rowData.author +
                '著'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolBar leftClick={this._back.bind(this)} title={this.state.author} />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <FlatList
            enableEmptySections={true}
            data={this.state.bookList}
            renderItem={this.renderBookList.bind(this)}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
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
    width: 45,
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
