import {BASE_URL} from './service.config';

import pickBy from 'lodash/pickBy';
import map from 'lodash/map';

import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';

function customParamsSerializer(params: any) {
  const cleanedParams = pickBy(params, v => {
    return v === null || v === undefined;
  });
  const finalParams = map(cleanedParams, (value, key) => {
    if (Array.isArray(value)) {
      return value.map(v => `${key}[]=${v}`).join('&');
    } else {
      return `${key}=${value}`;
    }
  }).join('&');
  return finalParams;
}

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  paramsSerializer: customParamsSerializer,
});

export {customParamsSerializer, baseQuery};
