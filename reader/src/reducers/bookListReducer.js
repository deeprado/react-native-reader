/*
 * description: the reducer for bookList, bookListDetail
 */

'use strict';

import * as types from '../common/actionType';

const initialState = {
  isLoading: false,
  isLoadingMore: false,
  bookLists: [],
  total: 0,
};

export default function bookList(state = initialState, action) {
  switch (action.type) {
    case types.DISCOVER_BOOK_LIST_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    case types.DISCOVER_BOOK_LIST:
      return Object.assign({}, state, {
        isLoading: action.isLoading,
        isLoadingMore: action.isLoadingMore,
        total: action.total,
        bookLists: action.bookLists,
      });
    default:
      return state;
  }
}
