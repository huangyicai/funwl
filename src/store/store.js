import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  // 定义状态
  state: {
    author: 'zhou zhongwei',
    userState:'111',
    notifyClasses:[],
    //未处理工单数
    serviceNum:0
  },
  mutations: {
    //清空notifyClasses
    clreaNotify (state) {
      if (state.notifyClasses.length > 0) {
        state.notifyClasses.forEach((v,index)=> {
          console.log("::::::::::")
          console.log(typeof(v))
          try {
            v.close()
          } catch (e) {
            console.log(e.name + ": " + e.message);
          }
        })
      }
      state.notifyClasses =[]
    },
    //push  notifyClasses
    pushNotify (state,res) {
      let date = state.notifyClasses
      console.log(res)
      date.push(res)
      state.notifyClasses =date
      console.log(state.notifyClasses.length)
    },
  }

})
export default store;

