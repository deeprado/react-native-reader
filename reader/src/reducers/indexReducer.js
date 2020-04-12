/*
 * description: all of reducer to combine
 */

'use strict';

import {combineReducers} from 'redux';
import charts from './chartsReducer';
import bookList from './bookListReducer';
import categoryList from './categoryListReducer';
import bookDiscussion from './bookDiscussionReducer';
import bookReview from './bookReviewReducer';
import bookHelp from './bookHelpReducer';
import bookCommunity from './bookCommunityReducer';
import search from './searchReducer';

const rootReducer = combineReducers({
  charts,
  bookList,
  categoryList,
  bookDiscussion,
  bookReview,
  bookHelp,
  bookCommunity,
  search,
});

export default rootReducer;
