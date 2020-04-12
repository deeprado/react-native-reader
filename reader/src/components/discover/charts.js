/*
 * description: 排行榜
 */

import React, {Component} from 'react';
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  InteractionManager,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';

import config from '../../common/config';
import Dimen from '../../utils/dimensionsUtil';
import api from '../../common/api';
import {charts} from '../../actions/chartsAction';
import Loading from '../../weight/loading';
import ToolBar from '../../weight/toolBar';

class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMaleOther: false,
      showFemaleOther: false,
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(charts());
    });
  }

  _back() {
    this.props.navigation.pop();
  }

  _showMaleCollapse() {
    this.setState({showMaleOther: !this.state.showMaleOther});
  }

  _showFemaleCollapse() {
    this.setState({showFemaleOther: !this.state.showFemaleOther});
  }

  _goToChartsDetail(rowData) {
    if (rowData.collapse) {
      this.props.navigation.navigate('ChartsDetailOther', {
        chartsItem: rowData,
      });
    } else {
      this.props.navigation.navigate('ChartsDetail', {
        chartsItem: rowData,
      });
    }
  }

  renderMainItem({item: rowData, index}) {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData)}>
        <View style={styles.item}>
          <Image
            style={styles.itemImage}
            source={
              rowData.cover
                ? {uri: api.IMG_BASE_URL + rowData.cover}
                : require('../../assets/imgs/ic_rank_collapse.png')
            }
          />
          <Text style={styles.itemTitle}>{rowData.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderOtherItem({item: rowData, index}) {
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.5}
        onPress={() => this._goToChartsDetail(rowData)}>
        <Text style={styles.itemOtherTitle}>{rowData.title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolBar leftClick={this._back.bind(this)} title="排行榜" />
        {charts.isLoading ? (
          <Loading />
        ) : (
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.listHeader}>男生</Text>
            <FlatList
              enableEmptySections={true}
              data={charts.male}
              renderItem={this.renderMainItem.bind(this)}
              keyExtractor={(item, index) => {
                return 'rank_male' + index.toString();
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this._showMaleCollapse()}>
              <View style={styles.item}>
                <Image
                  style={styles.itemImage}
                  source={require('../../assets/imgs/ic_rank_collapse.png')}
                />
                <Text style={styles.itemTitle}>更多排行榜</Text>
              </View>
            </TouchableOpacity>
            {this.state.showMaleOther ? (
              <FlatList
                enableEmptySections={true}
                data={charts.maleOther}
                renderItem={this.renderOtherItem.bind(this)}
                keyExtractor={(item, index) => {
                  return 'rank_male_other' + index.toString();
                }}
              />
            ) : null}
            <Text style={styles.listHeader}>女生</Text>
            <FlatList
              enableEmptySections={true}
              data={charts.female}
              renderItem={this.renderMainItem.bind(this)}
              keyExtractor={(item, index) => {
                return 'rank_female' + index.toString();
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this._showFemaleCollapse()}>
              <View style={styles.item}>
                <Image
                  style={styles.itemImage}
                  source={require('../../assets/imgs/ic_rank_collapse.png')}
                />
                <Text style={styles.itemTitle}>更多排行榜</Text>
              </View>
            </TouchableOpacity>
            {this.state.showFemaleOther ? (
              <FlatList
                enableEmptySections={true}
                data={charts.femaleOther}
                renderItem={this.renderOtherItem.bind(this)}
                keyExtractor={(item, index) => {
                  return 'rank_female_other' + index.toString();
                }}
              />
            ) : null}
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
    paddingBottom: 20,
  },
  body: {
    flex: 1,
  },
  listHeader: {
    width: Dimen.window.width,
    margin: 14,
    fontSize: config.css.fontSize.appTitle,
    color: config.css.fontColor.title,
  },
  item: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    width: Dimen.window.width,
    borderTopWidth: 1,
    borderTopColor: config.css.color.line,
  },
  itemImage: {
    marginLeft: 14,
    marginRight: 14,
    alignSelf: 'center',
    width: 30,
    height: 30,
  },
  itemTitle: {
    fontSize: config.css.fontSize.title,
    color: config.css.fontColor.title,
    marginBottom: 3,
  },
  itemOtherTitle: {
    marginLeft: 40,
    height: 30,
  },
});

function mapStateToProps(store) {
  return {
    charts: store.charts,
  };
}

export default connect(mapStateToProps)(Charts);
