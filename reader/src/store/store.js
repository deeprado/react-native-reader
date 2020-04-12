/*
 * description: store
 */

import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMIddle from 'redux-promise';
import rootReducer from '../reducers/indexReducer';

let store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(thunkMiddleware, promiseMIddle),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f,
  ),
);

export default store;
