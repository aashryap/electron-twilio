import qs from 'query-string';

export const getUrlParams = (url)=>qs.parse((new URL(url)).search);
