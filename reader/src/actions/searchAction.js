/*
 * description: the action for search
 */

'use strict';

import * as types from '../common/actionType';
import request from '../utils/httpUtil';
import api from '../common/api';

export let searchHotWords = () => {
  return (dispatch) => {
    return request.get(api.SEARCH_HOT_WORD, null, (data) => {
      if (data.ok) {
        dispatch(getHowWords(data.hotWords));
        dispatch(refreshHowWord(data.hotWords, 0));
      }
    });
  };
};

export let refreshHowWord = (hotWords, hotPart) => {
  let part = (hotPart + 1) % 4;
  let words = [];
  if (8 * (part + 1) < hotWords.length) {
    words = hotWords.slice(8 * part, 8 * (part + 1));
  } else {
    words = hotWords.slice(8 * part);
  }
  return (dispatch) => {
    dispatch(getRefreshHowWord(words, part));
  };
};

export let backToInitState = () => {
  return (dispatch) => {
    dispatch(getBackToInitState());
  };
};

export let searchAutoComplete = (text) => {
  return (dispatch) => {
    return request.get(api.SEARCH_AUTO_COMPLETE, {query: text}, (data) => {
      data.ok
        ? dispatch(
            getSearchAutoComplete(stringArrayToObjectArray(data.keywords)),
          )
        : null;
    });
  };
};

export let searchBooks = (text) => {
  return (dispatch) => {
    return request.get(api.SEARCH_BOOKS, {query: text}, (data) => {
      data.ok ? dispatch(getSearchBooks(data.books)) : null;
    });
  };
};

let getHowWords = (hotWords) => {
  return {
    type: types.SEARCH_HOT_WORDS,
    hotWords: hotWords,
  };
};

let getRefreshHowWord = (hotWordsPart, hotPart) => {
  return {
    type: types.SEARCH_REFRESH_HOT_WORDS,
    hotWordsPart: hotWordsPart,
    hotPart: hotPart,
  };
};

let getSearchAutoComplete = (autoComplete) => {
  return {
    type: types.SEARCH_AUTO_COMPLETE,
    autoComplete: autoComplete,
  };
};

let getSearchBooks = (books) => {
  return {
    type: types.SEARCH_SEARCH_BOOKS,
    searchData: books,
    searchState: true,
    autoComplete: [],
  };
};

let getBackToInitState = () => {
  return {
    type: types.SEARCH_BACK_TO_INIT_STATE,
    searchState: false,
    autoComplete: [],
    searchData: [],
    hotPart: 0,
  };
};

let stringArrayToObjectArray = (temp) => {
  let array = new Array();
  for (let i = 0; i < temp.length; i++) {
    let element = temp[i];
    let o = new Object();
    o.word = element;
    array.push(o);
  }
  return array;
};
