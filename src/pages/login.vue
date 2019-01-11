<template>
  <section class="login-container" @keyup.enter="login('form',form)">
    <el-row class="login-content">
      <el-col :span="10">
        <div class="login-main">
          <div class="login-title">
            <img src="https://funwl.oss-cn-hangzhou.aliyuncs.com/images/pyze9bailibaili.png" style="max-width: 100%;">
            <span>快递营收管理系统</span>
          </div>
          <el-form ref="form" :model="form" size="medium" :rules="rules" class="login-main-form">
            <el-form-item prop="username">
              <el-input v-model="form.username" class="input" placeholder="请输入用户名"   prefix-icon="iconfont icon-ren"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password" class="input" placeholder="请输入密码" type="password"   prefix-icon="iconfont icon-mima1"></el-input>
            </el-form-item>
            <el-button class="onsubmit" :loading="submitLoading" @click="login('form',form)">登录</el-button>
          </el-form>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="login-img"></div>
      </el-col>
    </el-row>
    <!--<el-row class="login-content-small">-->
      <!--<el-col :span="24">-->
        <!--<div class="login-main-samll">-->
          <!--<div class="login-title">-->
            <!--<p>FUN物流平台登录</p>-->
          <!--</div>-->
          <!--<el-form ref="form" :model="form" size="medium" :rules="rules" class="login-main-form">-->
            <!--<el-form-item prop="username">-->
              <!--<el-input v-model="form.username" class="input" placeholder="请输入用户名"   prefix-icon="iconfont icon-ren"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item prop="password">-->
              <!--<el-input v-model="form.password" class="input" placeholder="请输入密码" type="password"   prefix-icon=" "></el-input>-->
            <!--</el-form-item>-->
            <!--<el-button class="onsubmit" :loading="submitLoading" @click="login('form',form)">Submit</el-button>-->
          <!--</el-form>-->
        <!--</div>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </section>
</template>
<script>
  import qs from 'qs'
  import $axios from "../api/api"

  export default {
    data() {

      return {
        submitLoading: false,
        codeLoading: false,

        form: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {required: true, message: '用户名不能为空哦！', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不能为空哦！', trigger: 'blur'},
          ]
        }
      }
    },
    created() {

    },
    methods: {
      login(formName, val) {
        let _this = this;
        let param = {
          username: val.username,
          password: val.password,
        };

        this.$refs[formName].validate((valid) => {
          if (valid) {
            _this.submitLoading = true;
            $axios.request({
              url: "/public/login", method: 'post', data: param, statu: 2,
              _this: _this,
              success: res => {
                _this.submitLoading = false;
                sessionStorage.setItem('funwlStatus', res.data.auth.status);
                sessionStorage.setItem('funwlDisplay', res.data.auth.display);
                sessionStorage.setItem('funwlToken', res.data.token);
                sessionStorage.setItem('funwlId', res.data.auth.id);
                sessionStorage.setItem('funwlUserName', res.data.auth.name);
                sessionStorage.setItem('funwlPlatId', res.data.auth.platformId);
                sessionStorage.setItem('funwlPerson', res.data.auth.personInCharge);
                sessionStorage.setItem('funwlTelephone', res.data.auth.telephone);
                sessionStorage.setItem('funwlCompany', JSON.stringify(res.data.auth.courierCompany) );

                _this.$router.push('/redirect');
              },
              fail: e => {
                console.log(e);
                _this.submitLoading = false;
              }
            })
          } else {
            _this.$message.error("请填写登录信息！")
            return false;
          }
        });
      }

    },
    mounted() {

    }
  }
</script>
<style lang="less">
  .login-container {
    /*background-color: #F3F5F8;*/
    padding-top: 12%;
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 12%;


  }




    .login-content {
      margin: 0 auto;
      width: 807px;
      background-color: #fff;
      height: 450px;
      margin: 0 auto;
      -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
    }

    .login-main {
      width: 100%;
      height: 450px;
      padding:  0 10px;

    }

    .login-img {
      width: 471px;
      height:450px;
      background-image: url(../assets/images/beijing.jpg);
      background-repeat: no-repeat;
      -webkit-background-size: cover;
      background-size: cover;
    }


  .login-main-form {

    width: 85%;
    margin: 0 auto;
    margin-top: 30px;
    .onsubmit {
      width: 100%;
      background-color: #00AAFF;
      border-color: #00a0f0;
      box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.2);
      color: #fff;
    }
    .onsubmit:hover {
      background-color: #0094dc;
    }
  }

  .login-title {
    font: normal 700 25px/25px "Microsoft YaHei";
    text-align: center;
    margin-top: 70px;
    span {
      font: normal 500 25px/25px "Microsoft YaHei";
    }

  }

  .title {
    height: 40px;
    background-color: #f5f7fa;
  }

  .title-text {
    margin-left: 10px;
    font-size: 15px;
    line-height: 40px;
    font-weight: bold;
  }

  .text-center {
    display: inline-block;
    width: 100%;
    text-align: center;
  }


</style>
