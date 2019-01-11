<template>
  <section class="home-container" v-loading="homeLoading">
    <!--导航-->
    <section class="home-header home-header-second" ref="header">
      <el-row>
        <el-col :span="4" class="clearfix">
          <!--<img :src="funwlCompany.logoUrl" style="max-width: 100%;margin-left: 10px">-->
          <img src="https://funwl.oss-cn-hangzhou.aliyuncs.com/images/pyze9bailibaili.png" style="width: 50%;margin-left: 10px;">
          <span style="color: black;margin-top: 30px;font-weight: bold;font-size: 14px;"> 快递营收管理系统</span>
        </el-col>
        <el-col :span="15">
          <section class="home-nav">
            <el-menu
              :default-active="$route.path"
              class="vertical"
              mode="horizontal"
              :background-color="funwlCompany.backgroundColor"
              :text-color="funwlCompany.color"
              :active-text-color="funwlCompany.selectColor"
              unique-opened router
            >
              <template v-for="(item,index) in navData">
                <el-submenu :index="index+''" v-if="item.sysMenus.length>1 && item.url!=1">
                  <template slot="title"><i :class="item.icon"></i><span slot="title">{{item.title}}</span></template>
                  <el-menu-item v-for="child in item.sysMenus" :index="child.url" :key="child.title" disabled
                                class="home-nav-item">
                    <span class="children-li">{{child.title}}</span>
                  </el-menu-item>

                </el-submenu>
                  <el-menu-item v-if="item.sysMenus.length===0 && item.url!=1" :index="item.url">
                    <template slot="title"><i :class="item.icon"></i>
                      <span slot="title">{{item.title}}</span>
                      <el-badge :value="$store.state.serviceNum" :max="99" type="warning" v-if="item.title=='客服/工单'">
                      </el-badge>
                    </template>
                </el-menu-item>
              </template>
            </el-menu>
          </section>
        </el-col>
        <el-col :span="5">
          <div class="home-header-r fr">
            <!--<span   > 退出登录</span>-->
            <el-dropdown trigger="click" style="color: #555" size="small">
      <span class="el-dropdown-link" ref="personal">
        {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
              <el-dropdown-menu slot="dropdown">
                <div @click="toPersonal">
                  <el-dropdown-item>
                    <p>  个人中心</p>
                  </el-dropdown-item>
                </div>
                <div  @click="renew">
                  <el-dropdown-item v-if="platId==2">
                    <p @click="renew"> 续费</p>
                  </el-dropdown-item>
                </div>
                <div  @click="logout">
                  <el-dropdown-item >
                    <p > 退出登录</p>
                  </el-dropdown-item>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </section>
    <!--标签页- ->
    <!--盒子-->
    <!--<section class="home-breadcrumb" >-->
    <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
    <!--<el-breadcrumb-item>活动管理</el-breadcrumb-item>-->
    <!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
    <!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
    <!--</section>-->
    <!--contactsValue.name-->
    <div style="position: fixed;bottom:100px;right: 30px;z-index: 999;">
      <el-tooltip v-if="platId==2" class="item" effect="dark"
                  :content="'售后:'+contactsValue.phone" placement="left">
        <img src="https://funwl.oss-cn-hangzhou.aliyuncs.com/images/vrwl6cmsat"  style="width: 45px;height: 45px"alt="" >
      </el-tooltip>
    </div>
    <section class="home-content" ref="homecontent">
      <section class="page-box clearfix">
        <el-row class="page-box-row">
          <el-col :span="24" class="content-wrapper">
            <transition name="el-zoom-in-center">
              <router-view/>
            </transition>
          </el-col>
        </el-row>
      </section>
    </section>
    <el-dialog
      :title="'通知('+messageList.length+'条)'"
      :visible.sync="centerDialogVisible"
      width="40%"
      center
      :show-close="false"
      :before-close="beforeClose"
      >
      <el-carousel height="200px"   indicator-position="none">
        <el-carousel-item v-for="item in messageList" :key="item.id">
          <h6 style="text-align: center;font-weight: bold;font-size: 16px;color: #409EFF">{{ item.title}}</h6>
          <hr style="margin-top: 20px">
          <div style="margin-left:10%;text-align: left;width:80%;padding: -30px;text-indent:25px;font-weight: bold;font-size: 15px">
            {{ item.content}}
          </div>
        </el-carousel-item>
      </el-carousel>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmMessage" :disabled="disabledVal">{{countDownTime>0?'('+countDownTime+')':''}}确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
  import $axios from "../api/api"
  import {baseSrc} from "../api/api";
  export default {
    name: 'home',
    data() {
      return {
        disabledVal:true,
        countDownTime:10,
        centerDialogVisible:false,
        contactsValue: {},
        navData: [],
        homeLoading: false,
        platId: sessionStorage.getItem('funwlPlatId'),
        messageList:[],
        imgSrc: '',
        userName: sessionStorage.getItem('funwlUserName') ? sessionStorage.getItem('funwlUserName') : '',
        funwlCompany: JSON.parse(sessionStorage.getItem('funwlCompany')),
        websock: null,
        done:''
      }
    },
    methods: {
      //获取未处理工单数
      getServiceNum(){
        if(this.platId!=2){
          return;
        }
        let _this = this
        $axios.request({
          url: '/express/service/noHandle',
          _this: _this,
          method: 'get',
          statu: 1,
          success: res => {
            _this.$store.state.serviceNum=res.data;
          },
        })
      },
      beforeClose(done){
        return false
      },
      confirmMessage(){
        let arr = []
        this.messageList.forEach(v=>{
          arr.push(v.id)
        })
        console.log(arr.join())
        $axios.request({
          url:'/express/message/confirmMessage/'+arr.join(),
          method:'put',
          statu:2,
          _this:this,
          success:res=>{
            this.getMessageList()
          },
          fail:e=>{
            this.centerDialogVisible = false
          }
        })

      },
      getMessageList(){
        let  _this = this

        $axios.request({
          url:'/express/message/getUserMessage',
          method:'get',
          statu:1,
          _this:this,
          success:res=>{
            this.messageList = res.data;
            if(res.data.length>0){
              this.centerDialogVisible = true
              let timer = setInterval(
                ()=>{

                  if(_this.countDownTime>0){
                    _this.countDownTime-=1
                  }
                  else {
                    clearInterval(timer)
                    _this.disabledVal=false
                  }
                },1000
              )
            }else{
              this.centerDialogVisible = false
            }
          },
          fail:e=>{
          }
        })
      },
      //确认收款提示
      getCollection() {
        let _this = this
        _this.$store.commit("clreaNotify")
        $axios.request({
          url: '/express/total/getCollection',
          _this: _this,
          method: 'get',
          statu: 1,
          success: res => {
            console.log(111111)
            console.log(res)
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
              _this.$store.commit("pushNotify",notifyClass)
              //_this.$store.state.notifyClasses.push(notifyClass)
            }
          },
        })
      },
      //未付款提示
      noPayCollection() {
        let _this = this
        _this.$store.commit("clreaNotify")
        $axios.request({
          url: '/customer/total/getNotPaying',
          _this: _this,
          method: 'get',
          statu: 1,
          success: res => {
            let arr = [];
            if (res.data.length > 0) {
              let str = ''
              let offset = 0
              res.data.forEach((v, index) => {
                arr.push(v.name);
                offset = offset+65
                if(v.state==2){
                  str = '<p><strong><i>' +  '&nbsp;&nbsp;' + v.totalName + '账单</i> </strong></p>'
                  let notifyClass = _this.$notify({
                    title: '账单未付款',
                    message: str,
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    duration: 0,
                    offset: offset,
                    onClick:function () {
                      _this.$router.push({name: '账单管理', params: {status: v.state,time: v.totalTime}});
                    }
                  });
                  _this.$store.commit("pushNotify",notifyClass)
                }else if(v.state==5){
                  str = '<p><strong><i>' +  '&nbsp;&nbsp;' + v.totalName + '账单</i> </strong></p>'
                  let notifyClass = _this.$notify.error({
                    title: '账单未结清',
                    message: str,
                    dangerouslyUseHTMLString: true,
                    duration: 0,
                    offset: offset,
                    onClick:function () {
                      _this.$router.push({name: '账单管理', params: {status: v.state,time: v.totalTime}});
                    }
                  });
                  _this.$store.commit("pushNotify",notifyClass)
                }


              })

            }
          },
        })
      },
      //获取菜单
      getNavInfo() {
        this.homeLoading = true;
        let platId = sessionStorage.getItem('funwlPlatId')
        let _this = this
        $axios.request({
          url: '/public/menus',
          method: 'get',
          statu: '1',
          data: {
            platId: platId
          },
          _this: _this,
          success: res => {
            this.navData = res.data;
            this.homeLoading = false;
            _this.$router.push(res.data[0].url)
          },
          fail: e => {
            _this.homeLoading = false
            _this.$router.push('/404')
          }
        })
      },
      logout() {
        this.$confirm('确定退出平台嘛?', '提示', {
          confirmButtonText: '必须退出',
          cancelButtonText: '再看看！',
          type: 'warning'
        }).then(() => {
          $axios.request({
            url: '/public/logout',
            method: 'get',
            statu: 1,
            _this: this,
            success: res => {
              sessionStorage.clear();
              if (this.websock) {
                this.websock.close()
              }
              if (this.$store.state.notifyClasses.length > 0) {
                this.$store.state.notifyClasses.forEach(v => {
                  v.close()
                })
                this.$store.state.notifyClasses=[]
              }
              this.$router.push('/showIndex')
            },
            fail: e => {
              console.log(e)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      toPersonal() {
        this.$router.push('/personal')
      },
      renew() {
        this.$router.push('/pay')
      },
      getExpressContacts() {
        let _this = this
        $axios.request({
          url: '/public/contacts',
          method: 'get',
          statu: 1,
          _this: _this,
          success: res => {
            _this.contactsValue = res.data
          },
          fail: e => {
          }
        })

      },
      //websocket
      initWebSocket() { //初始化weosocket
        // const wsuri = 'ws://www.funwl.com:8090/test/websocket?id=' + sessionStorage.getItem('funwlId');//ws地址
        const wsuri = 'ws://www.funwl.com:8090/websocket?id=' + sessionStorage.getItem('funwlId');//ws地址
        // const wsuri = 'ws://10.10.10.45:8080/websocket?id=' + sessionStorage.getItem('funwlId');//ws地址
        this.websock = new WebSocket(wsuri);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen() {
        console.log("WebSocket连接成功");
      },
      websocketonerror(e) { //错误
        console.log("WebSocket连接发生错误");
      },
      websocketonmessage(e) { //数据接收
        let _this = this
        const redata = JSON.parse(e.data);
        let notifyClass = {}
        console.log(redata)
        if(redata.type==1||redata.type==3){
           /*notifyClass = this.$notify({
            title: '账单未付款提醒(新消息)',
            message: redata.bill.name,
            type: 'warning',
            duration: 0,
            offset: 45,
            onClick:function () {
              _this.$router.push('/khBills');
            }
          });*/
          //去掉通知

           _this.noPayCollection()
        }else if(redata.type==2){
          notifyClass = this.$notify({
            title: '账单确认收款(新消息)',
            message: redata.bill.name,
            type: 'success',
            duration: 0,
            offset: 45,
            onClick:function () {
              _this.$router.push('/kdBills');
            }
          });
        }else if(redata.type==4){
          notifyClass = this.$notify({
            title: '新工单消息',
            message: redata.content,
            type: 'warning',
            duration: 0,
            position: 'bottom-right',
            onClick:function () {
              _this.$router.push('/kdCustomerServices');
            }
          });
          this.getServiceNum()
        }
        else if(redata.type==5){
          notifyClass = this.$notify({
            title: redata.wayNum,
            message: redata.content,
            duration: 0,
            position: 'bottom-right',
            type: 'success',
            onClick:function () {
              let url = ''
              if(_this.platId==2){
                url = '/kdCustomerServices'
              }
              else{
                url = '/khCustomerServices'

              }
              _this.$router.push(url);
            }
          });
        }
        else if(redata.type==6){
          //我来处理的socket
          this.getServiceNum()
        }


        this.$store.state.notifyClasses.push(notifyClass)
      },

      websocketsend(agentData) {//数据发送
        this.websock.send(agentData);
      },
      websocketclose(e) { //关闭

        console.log("connection closed (" + e.code + ")");
      },
    },

    //***********
    created() {
      //平台id
      let platId = sessionStorage.getItem('funwlPlatId')
      //区分运营与老板 （1=老板，2=运营）
      let display = sessionStorage.getItem('funwlDisplay')

      if (platId == 3) {

        this.noPayCollection()
        //页面刚进入时开启长连接
        this.initWebSocket()
        this.getMessageList()
      }
      if (platId == 2 && display != 0) {
        this.getCollection()
        this.initWebSocket()
      }
      if(platId == 2&& display == 0){
        this.initWebSocket()
      }

    },

    mounted() {
      this.platId = sessionStorage.getItem('funwlPlatId');
      this.getExpressContacts();
      this.getNavInfo();
      this.$refs.header.style.backgroundColor = this.funwlCompany.backgroundColor;
      this.$refs.personal.style.color = this.funwlCompany.color;
      this.getServiceNum()
    }
  }
</script>
<style scoped lang="less">

  .home-container {
    transition: all 0.7s;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top: 60px;
  }

  .home-header {
    min-width: 1200px;
    padding-right: 15px;
    margin-right: auto;
    margin-left: auto;
    height: 60px;
    z-index: 99999;

    width: 100%;
    color: #676a6d;
    border-bottom: 1px solid #e7e7e7;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    position: fixed;
    top: 0;
    img {
      width: 169px;
      height: 55px;
    }
    z-index: 10;
    .home-title {
      width: 100%;
      display: inline-block;
      font-size: 22px;
      font-weight: 700;
      line-height: 60px;
      color: #555;
      text-align: center;
      letter-spacing: 1px;
    }

    .home-header-r {
      span {
        font-size: 13px;
      }
      cursor: pointer;
      margin-right: 20px;
      line-height: 60px;
      color: #555;

    }
    .home-header-r img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }

  .home-header-first {
    background-color: #ffffff;
  }

  .home-header-second {
    background-color: #ffffff;
  }

  .home-header-third {
    background-color: #ffffff;
  }

  .home-content {
    transition: all 0.7s;
    box-sizing: border-box;
    /*padding-left: 250px;*/
    width: 100%;
    height: 100%;
    .home-nav {
      transition: all 0.7s;
      position: fixed;
      left: 0;
      height: 100%;
      width: 250px;
      background-color: #2b333e;
      transform: translateX(0);
      .home-nav-item {
        width: 100px;
      }
    }
    .page-box {
      box-sizing: border-box;
      padding: 10px;
      background-color: #f0f0f0;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      font-size: 13px;
      color: #676a6d;
      position: relative;

      /*min-height: 1000px;*/
      min-width: 1200px;
    }
  }

  /*!*标签页*!*/
  /*.home-breadcrumb{*/
  /*!*width: 100%;*!*/
  /*margin-top: 68px;*/
  /*padding-top: 10px;*/
  /*padding-left: 15px;*/
  /*background-color: #f0f0f0;*/
  /*}*/

</style>

