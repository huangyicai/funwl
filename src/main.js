import 'babel-polyfill'
import '@/assets/css/base.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/iconfont/iconfont.css'
import echarts from 'echarts'
import Vue from 'vue'
import App from './App'
import routes from './router'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import Router from 'vue-router'
import store from '@/store/store'
import axios from 'axios'
import  $axios from "./api/api"
import VueQuillEditor  from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// import {getRequest} from './api/index'
// import {postRequest} from'./api/index'
// import {deleteRequest} from './api/index'
// import {putRequest} from './api/index'
// import {getOutRequest} from './api/index'

Vue.use(VueQuillEditor);
Vue.use(ElementUI);
Vue.use(Router);
Vue.use(Vuex);
Vue.use(store);
Vue.use(echarts);
Vue.use(axios);
Vue.prototype.$axios = $axios;
Vue.config.productionTip = false;
// Vue.prototype.getRequest = getRequest;
// Vue.prototype.postRequest = postRequest;
// Vue.prototype.deleteRequest = deleteRequest;
// Vue.prototype.putRequest = putRequest;
// Vue.prototype.getOutRequest = getOutRequest;

//将数组放入路由中
const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {


  if (to.path==='/') {
    next({
      path:'/showIndex'
    })
  }
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (sessionStorage.getItem('funwlToken')) {  // 通过vuex state获取当前的token是否存在
      if(sessionStorage.getItem("funwlStatus")==0){
        if (to.path!='/redirect'&&to.path!='/pay'&&to.path!='/'&&to.path!='/showIndex'&&to.path!='/login') {
          next({
            path:'/404'
          })
        }else {
          next();
        }
      }else {
        next();
      }

    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
