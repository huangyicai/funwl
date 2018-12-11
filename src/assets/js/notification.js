import $axios from "../../api/api"

//确认收款提示
function getCollection() {
  let _this = this
  $axios.request({
    url: '/express/total/getCollection',
    _this: _this,
    method: 'get',
    statu: 1,
    success: res => {
      if (res.data.length > 0) {
        let str = ''
        res.data.forEach((v, index) => {
          let i = index + 1
          str = str + '<p><strong><i>' + i + '.&nbsp;&nbsp;' + v.name + '</i> </strong></p>'
        })
        let notifyClass = _this.$notify({
          title: '以下客户有已付款账单请确认！',
          message: str,
          type: 'warning',
          dangerouslyUseHTMLString: true,
          duration: 0,
          offset: 45,
          onClick:function () {
            _this.$router.push('/kdBills');
          }
        });
        _this.$store.state.notifyClasses.push(notifyClass)
      }
    },
  })
}
//未付款提示
function noPayCollection() {
  let _this = this
  $axios.request({
    url: '/customer/total/getNotPaying',
    _this: _this,
    method: 'get',
    statu: 1,
    success: res => {
      let arr = [];
      if (res.data.length > 0) {
        let str = ''
        res.data.forEach((v, index) => {
          arr.push(v.name);
          let i = index + 1
          str = str + '<p><strong><i>' + i + '.&nbsp;&nbsp;' + v.name + '账单</i> </strong></p>'
        })
        let notifyClass = _this.$notify({
          title: '账单未付款提醒(全部)',
          message: str,
          type: 'warning',
          dangerouslyUseHTMLString: true,
          duration: 0,
          offset: 45,
          onClick:function () {
            _this.$router.push('/khBills');
          }
        });
        _this.$store.state.notifyClasses.push(notifyClass)
      }
    },
  })
}
function text() {
  alert(1111)
}
export {getCollection,noPayCollection,text};



/*export default {
  install(Vue, options) {
    Vue.prototype.getCollection = function getCollection() {
      let _this = this
      $axios.request({
        url: '/express/total/getCollection',
        _this: _this,
        method: 'get',
        statu: 1,
        success: res => {
          if (res.data.length > 0) {
            let str = ''
            res.data.forEach((v, index) => {
              let i = index + 1
              str = str + '<p><strong><i>' + i + '.&nbsp;&nbsp;' + v.name + '</i> </strong></p>'
            })
            let notifyClass = _this.$notify({
              title: '以下客户有已付款账单请确认！',
              message: str,
              type: 'warning',
              dangerouslyUseHTMLString: true,
              duration: 0,
              offset: 45,
              onClick:function () {
                _this.$router.push('/kdBills');
              }
            });
            this.$store.state.notifyClasses.push(notifyClass)
          }
        },
      })
    },
    Vue.prototype.noPayCollection = function noPayCollection() {
      let _this = this
      $axios.request({
        url: '/customer/total/getNotPaying',
        _this: _this,
        method: 'get',
        statu: 1,
        success: res => {
          let arr = [];
          if (res.data.length > 0) {
            let str = ''
            res.data.forEach((v, index) => {
              arr.push(v.name);
              let i = index + 1
              str = str + '<p><strong><i>' + i + '.&nbsp;&nbsp;' + v.name + '账单</i> </strong></p>'
            })
            let notifyClass = _this.$notify({
              title: '账单未付款提醒(全部)',
              message: str,
              type: 'warning',
              dangerouslyUseHTMLString: true,
              duration: 0,
              offset: 45,
              onClick:function () {
                _this.$router.push('/khBills');
              }
            });
            this.$store.state.notifyClasses.push(notifyClass)
          }
        },
      })
    }
  }

}*/
