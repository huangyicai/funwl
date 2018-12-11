import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';
import routes from '../router/index.js'
import Router from 'vue-router'
let routerTo = new Router({
  routes
});
// export const baseSrc = "http://www.funwl.com:8090/test";
// export const baseSrc = "http://www.funwl.com:8090";
export const baseSrc = "http://10.10.10.45:8080";
axios.defaults.baseURL = baseSrc;
axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    //  config.data = config.params;
    //
    // config.params =""
    //  config.data = qs.stringify(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});

axios.interceptors.response.use(response => {
  return response
}, error => {
  let originalRequest = error.config;

  if(error.code === 'ECONNABORTED' && error.message.indexOf('timeout')!==-1 && !originalRequest._retry){
    Message.warning('网络错误，请求超时！')
  }
  return Promise.resolve(error.response)
});

function checkCode(res, success, fail,_this) {
  if (res.status !== 200 && res.status !== 304 && res.status !== 400) {
    Message.error(res.status);
    fail(res.status);
    return;
  }
  if (res.data.code !== 0) {
    fail(res.data);
    if (res.data.code === 10008) {
      sessionStorage.clear();
      _this.$store.state.notifyClasses.forEach(v=>{
        v.close()
      })
      _this.$router.push({path: '/login'});
      return;
    }
    if (res.data.code === 10009) {
      _this.$router.push({path: '/404'});
      return;
    }
    Message.warning(res.data.info + "");
    return;
  }
  success(res.data)
}

const request = {
  request(
    {
      url: url, method: method, data: data, statu: statu, success: success, fail: fail,_this:_this
    }
  ) {
    let paramSession = [
      {},
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': sessionStorage.getItem('funwlToken') ? sessionStorage.getItem('funwlToken') :  ""
      },
      {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('funwlToken') ? sessionStorage.getItem('funwlToken') : ""
      }
    ];
    switch (method) {
      case 'post':
        return axios({
          method: method,
          url: url,
          data: data,
          timeout: 10000000,
          headers: paramSession[statu]
        }).then(
          (res) => {
            return checkCode(res, success, fail,_this)
          }
        ).catch(e => {
          console.log(e);
          //fail(e);
        });
        break;
      case 'get':
        return axios({
          method: method,
          url: url,
          params: data,
          timeout: 30000,
          headers: paramSession[statu]
        }).then(
          (res) => {
            return checkCode(res, success, fail,_this)
          }
        ).catch(e => {
          console.log(e);
          //fail(e);
        });
        break;
      case 'delete':
        return axios({
          method: method,
          url: url,
          params: data,
          timeout: 10000,
          headers: paramSession[statu]
        }).then(
          (res) => {
            return checkCode(res, success, fail,_this)
          }
        ).catch(e => {
          console.log(e);
          //fail(e);
        });
        break;
      case 'put':
        return axios({
          method: method,
          url: url,
          data: data,
          timeout: 10000,
          headers: paramSession[statu]
        }).then(
          (res) => {
            return checkCode(res, success, fail,_this)
          }
        ).catch(e => {
          console.log(e);
          //fail(e);
        });
        break;
      default:
        return axios({
          method: method,
          url: url,
          data: data,
          timeout: 10000,
          headers: paramSession[statu]
        }).then(
          (res) => {
            return checkCode(res, success, fail,_this)
          }
        ).catch(e => {
          console.log(e);
          //fail(e);
        });
    }
  }
};


export default request;
