/*
 * description: 分类页面
 */

import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  InteractionManager,
  FlatList,
} from 'react-native';

import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';

import config from '../../common/config';
import Dimen from '../../utils/dimensionsUtil';
import {
  categoryListBasic,
  categoryListV2,
} from '../../actions/categoryListAction';
import Loading from '../../weight/loading';
import ToolBar from '../../weight/toolBar';

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {dispatch} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(categoryListBasic());
      dispatch(categoryListV2());
    });
  }

  _back() {
    this.props.navigation.pop();
  }

  _goToCategoryDetail(isMale, name) {
    if (name) {
      let categorylistSelected = this._getSelectedCategoryList(isMale, name);
      this.props.navigation.navigate('CategoryDetail', {
        categoryListSelected: categorylistSelected
          ? categorylistSelected
          : {major: name, mins: []},
        gender: isMale ? 'male' : 'female',
        major: name,
        minor: '',
      });
    }
  }

  _getSelectedCategoryList(isMale, name) {
    let categorylistSelected = null;
    const {categoryList} = this.props;
    if (categoryList.categoryListV2 && isMale) {
      categoryList.categoryListV2.male.forEach(function (element) {
        if (name === element.major) {
          categorylistSelected = element;
        }
      }, this);
    } else if (categoryList.categoryListV2 && !isMale) {
      categoryList.categoryListV2.female.forEach(function (element) {
        if (name === element.major) {
          categorylistSelected = element;
        }
      }, this);
    }
    return categorylistSelected;
  }

  renderCategoryListMale({item: rowData, index}) {
    return (
      <TouchableOpacity
        key={index}
        style={styles.item}
        activeOpacity={0.5}
        onPress={() => this._goToCategoryDetail(true, rowData.name)}>
        <View>
          <Text style={styles.itemTitle}>{rowData.name}</Text>
          <Text style={styles.itemDesc}>{rowData.bookCount}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCategoryListFemale({item: rowData, index}) {
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.5}
        onPress={() => this._goToCategoryDetail(false, rowData.name)}>
        <View>
          <Text style={styles.itemTitle}>{rowData.name}</Text>
          <Text style={styles.itemDesc}>{rowData.bookCount}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {categoryList} = this.props;
    return (
      <View style={styles.container}>
        <ToolBar leftClick={this._back.bind(this)} title="分类" />
        {categoryList.isLoadingBasic ? (
          <Loading />
        ) : (
          <ScrollView style={styles.body}>
            <Text style={styles.listHeader}>男生</Text>
            <FlatList
              dataSource={categoryList.maleList}
              renderItem={this.renderCategoryListMale.bind(this)}
              initialListSize={categoryList.maleList.length}
              removeClippedSubviews={false}
              contentContainerStyle={styles.listStyle}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                return 'male' + index.toString();
              }}
            />
            <Text style={styles.listHeader}>女生</Text>
            <FlatList
              dataSource={categoryList.femaleList}
              renderItem={this.renderCategoryListFemale.bind(this)}
              enableEmptySections={true}
              initialListSize={categoryList.femaleList.length}
              contentContainerStyle={styles.listStyle}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => {
                return 'female' + index.toString();
              }}
            />
          </ScrollView>
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
    backgroundColor: config.css.color.line,
  },
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
  },
  item: {
    width: Dimen.window.width / 3 - 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0.5,
    backgroundColor: config.css.color.white,
  },
  itemTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    alignSelf: 'center',
  },
  itemDesc: {
    fontSize: config.css.fontSize.desc,
    color: config.css.fontColor.desc,
    marginTop: 3,
    alignSelf: 'center',
  },
});

function mapStateToProps(store) {
  const {categoryList} = store;
  return {
    categoryList,
  };
}

export default connect(mapStateToProps)(CategoryList);
