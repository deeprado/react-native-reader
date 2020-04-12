/*
 * description: 综合讨论区/原创区
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
import {bookDiscussionList} from '../../actions/bookDiscussionAction';
import SelectionTabs from '../../weight/selectionTabs';
import Loading from '../../weight/loading';
import LoadingMore from '../../weight/loadingMore';
import ToolBar from '../../weight/toolBar';

let tabArray = [config.distillate, config.discussionSort];

class BookDiscussion extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      sort: 'updated',
      distillate: '',
      block: props.block ? props.block : params.block,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(
        bookDiscussionList(
          this._setParams(this.state.sort, this.state.distillate, 0),
          true,
          [],
        ),
      );
    });
  }

  _setParams(sort, distillate, start) {
    return {
      block: this.state.block,
      duration: 'all',
      sort: sort,
      type: 'all',
      start: start,
      limit: 20,
      distillate: distillate,
    };
  }

  _back() {
    this.props.navigation.pop();
  }

  _changeState(selected) {
    const {dispatch} = this.props;
    this.setState({distillate: selected[0].distillate, sort: selected[1].sort});
    dispatch(
      bookDiscussionList(
        this._setParams(selected[1].sort, selected[0].distillate, 0),
        true,
        [],
      ),
    );
  }

  _showMoreItem() {
    const {bookDiscussion, dispatch} = this.props;
    if (
      bookDiscussion.bookDiscussionList.length === 0 ||
      bookDiscussion.isLoadingBookDiscussionList ||
      bookDiscussion.isLoadingBookDiscussionListMore
    ) {
      return;
    }
    dispatch(
      bookDiscussionList(
        this._setParams(
          this.state.sort,
          this.state.distillate,
          bookDiscussion.bookDiscussionList.length,
        ),
        false,
        bookDiscussion.bookDiscussionList,
      ),
    );
  }

  _goToBookDiscussionDetail(id) {
    this.props.navigation.navigate('BookDiscussionDetail', {
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
    const {bookDiscussion} = this.props;
    if (
      bookDiscussion.bookDiscussionList.length === 0 ||
      bookDiscussion.isLoadingBookDiscussionList
    ) {
      return null;
    }
    return <LoadingMore hasMore={true} />;
  }

  render() {
    const {bookDiscussion} = this.props;
    return (
      <View style={styles.container}>
        <ToolBar leftClick={this._back.bind(this)} title="综合讨论区" />
        <SelectionTabs
          tabArray={tabArray}
          selectItem={(selected) => this._changeState(selected)}
        />
        {bookDiscussion.isLoadingBookDiscussionList ? (
          <Loading />
        ) : (
          <FlatList
            enableEmptySections={true}
            data={bookDiscussion.bookDiscussionList}
            onEndReached={this._showMoreItem.bind(this)}
            onEndReachedThreshold={30}
            renderItem={this.renderBookDiscussion.bind(this)}
            ListFooterComponent={this.renderFooter.bind(this)}
            key={(item, index) => {
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
  const {bookDiscussion} = store;
  return {
    bookDiscussion,
  };
}

export default connect(mapStateToProps)(BookDiscussion);
