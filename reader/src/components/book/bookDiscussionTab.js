/*
 * description: 书籍详情讨论列表
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
import {dateFormat} from '../../utils/formatUtil';
import api from '../../common/api';
import {bookDiscussionList} from '../../actions/bookCommunityAction';
import Loading from '../../weight/loading';
import LoadingMore from '../../weight/loadingMore';

class BookDiscussionTab extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(
        bookDiscussionList(
          this._setParams(this.props.bookId, this.props.sort, 0),
          true,
          [],
        ),
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch} = this.props;
    if (nextProps.sort !== this.props.sort) {
      dispatch(
        bookDiscussionList(
          this._setParams(nextProps.bookId, nextProps.sort, 0),
          true,
          [],
        ),
      );
    }
  }

  _setParams(bookId, sort, start) {
    return {
      book: bookId,
      sort: sort,
      type: 'normal,vote',
      start: start,
      limit: 20,
    };
  }

  _back() {
    this.props.navigation.pop();
  }

  _showMoreItem() {
    const {bookCommunity, dispatch} = this.props;
    if (
      bookCommunity.bookDiscussionList.length === 0 ||
      bookCommunity.isLoadingDiscussion ||
      bookCommunity.isLoadingDiscussionMore
    ) {
      return;
    }
    dispatch(
      bookDiscussionList(
        this._setParams(
          this.props.bookId,
          this.props.sort,
          bookCommunity.bookDiscussionList.length,
        ),
        false,
        bookCommunity.bookDiscussionList,
      ),
    );
  }

  _goToBookDiscussionDetail(id) {
    this.props.navigation.push('bookDiscussionDetail', {
      bookDiscussionId: id,
    });
  }

  renderBookDiscussion({item: rowData, index}) {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        onPress={() => this._goToBookDiscussionDetail(rowData._id)}>
        <View style={styles.item}>
          <Image
            style={styles.itemImage}
            source={
              rowData.author.avatar
                ? {uri: api.IMG_BASE_URL + rowData.author.avatar}
                : require('../../assets/imgs/splash.jpg')
            }
          />
          <View style={styles.itemBody}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.itemAuthor}>
                {rowData.author.nickname + ' lv.' + rowData.author.lv}
              </Text>
              <Text style={styles.itemTime}>{dateFormat(rowData.updated)}</Text>
            </View>
            <Text style={styles.itemTitle}>{rowData.title}</Text>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                alignItems: 'center',
              }}>
              <Icon
                type="feather"
                name="message-square"
                size={15}
                color={config.css.fontColor.desc}
              />
              <Text style={styles.itemDesc}>{rowData.commentCount}</Text>
              <Icon
                type="feather"
                name="bar-chart-2"
                size={15}
                style={{marginLeft: 10}}
                color={config.css.fontColor.desc}
              />
              <Text style={styles.itemDesc}>{rowData.voteCount}</Text>
              <Icon
                type="feather"
                name="heart"
                size={15}
                style={{marginLeft: 10}}
                color={config.css.fontColor.desc}
              />
              <Text style={styles.itemDesc}>{rowData.likeCount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    const {bookCommunity} = this.props;
    if (
      bookCommunity.bookDiscussionList.length === 0 ||
      bookCommunity.isLoadingDiscussion
    ) {
      return null;
    }
    return <LoadingMore hasMore={true} />;
  }

  render() {
    const {bookCommunity} = this.props;
    return (
      <View style={styles.container}>
        {bookCommunity.isLoadingDiscussion ? (
          <Loading />
        ) : (
          <FlatList
            enableEmptySections={true}
            data={bookCommunity.bookDiscussionList}
            onEndReached={this._showMoreItem.bind(this)}
            onEndReachedThreshold={30}
            renderItem={this.renderBookDiscussion.bind(this)}
            ListFooterComponent={this.renderFooter.bind(this)}
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
  },
  body: {
    flex: 1,
  },
  listStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: config.css.color.line,
  },
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
  },
  item: {
    flexDirection: 'row',
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line,
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemBody: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemAuthor: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.author,
  },
  itemTime: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginRight: 14,
  },
  itemTitle: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.title,
    marginRight: 14,
    marginTop: 5,
    marginBottom: 5,
  },
  itemDesc: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginLeft: 3,
  },
});

function mapStateToProps(store) {
  const {bookCommunity} = store;
  return {
    bookCommunity,
  };
}

export default connect(mapStateToProps)(BookDiscussionTab);
