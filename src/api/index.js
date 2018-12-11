import axios from 'axios'
import qs from 'qs'
import {Message} from 'element-ui'
let axiosIns = axios.create({});
let development_model ='development';
let token = localStorage.getItem('funwlToken')?localStorage.getItem('funwlToken'):'';

if (development_model === 'development') {
  axiosIns.defaults.baseURL = '***';
} else if (development_model === 'debug') {
  axiosIns.defaults.baseURL = '***';
} else if (development_model === 'production') {
  axiosIns.defaults.baseURL = '***';
}
axios.interceptors.request.use(config=> {
  return config;
}, err=> {
  Message.error({message: '请求超时!'});
  return Promise.resolve(err);
})
axios.interceptors.response.use(data=> {
  //
  if (data.status && data.status === 200 && data.data.status === 'error') {
    Message.error({message: data.data.msg});
    return;
  }
  return data;
}, err=> {
  if (err.response.status === 504||err.response.status === 404) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'});
  } else if (err.response.status === 403) {
    Message.error({message: '权限不足,请联系管理员!'});
  }else {
    Message.error({message: '未知错误!'});
  }
  return Promise.resolve(err);
});


export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': token
    }
  });
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token
    }
  });
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: url,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': token
    }
  });
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: url,
    headers:{
      'Authorization': token
    }
  });
}
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: url,
    headers:{
      'Authorization': token
    }
  });
}
export const getOutRequest = (url) => {
  return axios({
    method: 'get',
    url: url,
  });
}




