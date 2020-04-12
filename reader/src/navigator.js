'use strict';

import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';

// 引导页面
import Splash from './components/splash';

import BookDetail from './components/book/bookDetail';
import BookCommunity from './components/book/bookCommunity';
import TagBookList from './components/book/tagBookList';
import AuthorBookList from './components/book/authorBookList';

import BookDiscussionDetail from './components/community/bookDiscussionDetail';
import BookReviewDetail from './components/community/bookReviewDetail';
import BookListDetail from './components/discover/bookListDetail';

import CategoryDetail from './components/discover/categoryDetail';
import ChartsDetail from './components/discover/chartsDetail';
import ChartsDetailOther from './components/discover/chartsDetailOther';
import Charts from './components/discover/charts';
import BookList from './components/discover/bookList';
import CategoryList from './components/discover/categoryList';

import MyBookList from './components/mine/myBookList';
import MyFattenList from './components/mine/myFattenList';

import ReadPlatform from './components/readPlatform';

import BookShelves from './components/bookshelves';
import Community from './components/community';
import Discover from './components/discover';
import Mine from './components/mine';
import Search from './components/search';

import BookDiscussion from './components/community/bookDiscussion';
import BookReview from './components/community/bookReview';
import BookHelp from './components/community/bookHelp';
import BookHelpDetail from './components/community/bookHelpDetail';

const switchNavigationOptions = {
  gesturesEnabled: true,
  headerTitle: null,
};

const commonNavigationOptions = {
  tabBarVisible: false,
  headerShown: false,
};

const bottomTabOptions = (tabBarTitle, {iconName, typeName}, navTitle) => {
  const tabBarLabel = tabBarTitle;
  const tabBarIcon = ({tintColor, focused}) => {
    return <Icon name={iconName} type={typeName} size={25} color={tintColor} />;
  };
  const headerTitle = navTitle;
  const headerTitleStyle = {fontSize: 22, color: 'white', alignSelf: 'center'};
  // header的style
  const headerStyle = {backgroundColor: '#4ECBFC'};
  const tabBarVisible = true;
  return {
    tabBarLabel,
    tabBarIcon,
    tabBarVisible,
    headerTitle,
    headerTitleStyle,
    headerStyle,
  };
};

const AppTabNavigator = createBottomTabNavigator(
  {
    BookShelves: {
      screen: BookShelves,
      navigationOptions: () =>
        bottomTabOptions('书架', {
          iconName: 'book-open',
          typeName: 'feather',
        }),
    },
    Discover: {
      screen: Discover,
      navigationOptions: () =>
        bottomTabOptions('发现', {
          iconName: 'compass',
          typeName: 'feather',
        }),
    },
    Community: {
      screen: Community,
      navigationOptions: () =>
        bottomTabOptions('社区', {iconName: 'coffee', typeName: 'feather'}),
    },
    Mine: {
      screen: Mine,
      navigationOptions: () =>
        bottomTabOptions('我的', {iconName: 'user', typeName: 'feather'}),
    },
  },
  {
    initialRouteName: 'BookShelves',
    tabBarOptions: {
      activeTintColor: '#FF9744',
      inactiveTintColor: 'gray',
    },
  },
);

let AppAllStack = createStackNavigator(
  {
    TabNavigator: {
      screen: AppTabNavigator,
      navigationOptions: commonNavigationOptions,
    },
    Search: {
      screen: Search,
      navigationOptions: commonNavigationOptions,
    },
    BookReview: {
      screen: BookReview,
      navigationOptions: commonNavigationOptions,
    },
    BookHelp: {
      screen: BookHelp,
      navigationOptions: commonNavigationOptions,
    },
    BookHelpDetail: {
      screen: BookHelpDetail,
      navigationOptions: commonNavigationOptions,
    },

    BookDiscussion: {
      screen: BookDiscussion,
      navigationOptions: commonNavigationOptions,
    },
    BookDetail: {
      screen: BookDetail,
      navigationOptions: commonNavigationOptions,
    },
    BookCommunity: {
      screen: BookCommunity,
      navigationOptions: commonNavigationOptions,
    },
    TagBookList: {
      screen: TagBookList,
      navigationOptions: commonNavigationOptions,
    },
    AuthorBookList: {
      screen: AuthorBookList,
      navigationOptions: commonNavigationOptions,
    },

    BookDiscussionDetail: {
      screen: BookDiscussionDetail,
      navigationOptions: commonNavigationOptions,
    },
    BookReviewDetail: {
      screen: BookReviewDetail,
      navigationOptions: commonNavigationOptions,
    },
    BookList: {
      screen: BookList,
      navigationOptions: commonNavigationOptions,
    },
    BookListDetail: {
      screen: BookListDetail,
      navigationOptions: commonNavigationOptions,
    },
    CategoryList: {
      screen: CategoryList,
      navigationOptions: commonNavigationOptions,
    },
    CategoryDetail: {
      screen: CategoryDetail,
      navigationOptions: commonNavigationOptions,
    },
    Charts: {
      screen: Charts,
      navigationOptions: commonNavigationOptions,
    },

    ChartsDetailOther: {
      screen: ChartsDetailOther,
      navigationOptions: commonNavigationOptions,
    },
    ChartsDetail: {
      screen: ChartsDetail,
      navigationOptions: commonNavigationOptions,
    },
    ReadPlatform: {
      screen: ReadPlatform,
      navigationOptions: commonNavigationOptions,
    },
    MyBookList: {
      screen: MyBookList,
      navigationOptions: commonNavigationOptions,
    },
    MyFattenList: {
      screen: MyFattenList,
      navigationOptions: commonNavigationOptions,
    },
  },
  {
    initialRouteName: 'TabNavigator',
    // headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: true,
      headerShown: false,
    },
  },
);

const SplashStack = createSwitchNavigator(
  {
    SplashPage: {
      screen: Splash,
      navigationOptions: switchNavigationOptions,
    },
    AppPage: {
      screen: AppAllStack,
      navigationOptions: switchNavigationOptions,
    },
  },
  {
    // mode: 'card',
    headerMode: 'none',
    initialRouteName: 'SplashPage',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

// const prefix = 'qimao://';

export default createAppContainer(SplashStack);
