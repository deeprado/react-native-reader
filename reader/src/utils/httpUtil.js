/*
 * description: 网络请求工具类
 */

'use strict';

import queryString from 'query-string';
import _ from 'lodash';
import config from '../common/config';

let request = {};

request.get = (url, params, successCallBack, failCallBack) => {
  if (params) {
    url += '?' + queryString.stringify(params);
  }
  console.log('httpUtil -- GET -- URL : ' + url);
  return fetch(url)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      successCallBack(response);
    })
    .catch((error) => {
      failCallBack && failCallBack(error);
    });
};

request.post = (url, body, successCallBack, failCallBack) => {
  let options = _.extend(config.header, {
    body: JSON.stringify(body),
  });
  console.log('httpUtil -- POST -- URL : ' + url + ' -- BODY : ' + body);
  return fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      successCallBack(response);
    })
    .catch((error) => {
      failCallBack && failCallBack(error);
    });
};

export default request;
