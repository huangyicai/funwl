<template>
    <section  class="show-index-container"  v-loading="indexLoading"
              element-loading-text="拼命加载中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-row class="show-index-header">
            <el-col :span="9">
              <div class="kong">
                <img src="../assets/images/index/logo.png" alt="" style="width: 67px;height: 30px;margin-left:40%">
              </div>
            </el-col>
            <el-col :span="5">
              <el-tooltip class="item" effect="dark" content="服务热线" placement="bottom">
                <i  style="font-size: 15px" class="el-icon-phone-outline">:18069000780</i>
              </el-tooltip>
            </el-col>
            <el-col :span="6">
                <div class="show-index-entrancd">
                    <span @click="entrance(1)">弗恩平台</span>
                    <span @click="entrance(2)">快递平台</span>
                    <span @click="entrance(3)">商家平台</span>
                </div>
            </el-col>
          <el-col :span="4">
            <div>
              <span class="show-index-user"  v-if="!token" @click="toLogin">
                  请登录
              </span>
              <span class="show-index-user"  v-if="token">
                <span > {{userName}}</span>
                <span @click="logout">退出登录</span>
              </span>
            </div>
          </el-col>
        </el-row>

        <el-input clearable placeholder="多个单号用英文逗号隔开" v-model="waybill"  type="text"
                  style="width: 50%;position: absolute;top: 670px;left:25%;z-index: 999" >
          <template slot="prepend" ><span style="font-weight: bold;font-size: 15px">运单号：</span></template>
          <el-button slot="append" @click="autonumber" icon="el-icon-search" :loading="loading"></el-button>
        </el-input>
      <el-dialog :title="'物流信息('+waybillArr.length+'单)'" :visible.sync="dialogTableVisible">
        <el-collapse v-model="activeName" accordion  @change="getWaybill">
          <el-collapse-item  :name="info" v-for="info in waybillArr">
            <template slot="title">
              <i class="header-icon el-icon-location"></i>
              <span style="font-weight: bold;font-size: 15px">运单号:</span>&nbsp;&nbsp;&nbsp;
              <span style="font-weight: bold;font-size: 16px;color: #909399">{{info}}</span>&nbsp;&nbsp;&nbsp;
            </template>
            <div  v-if="information.status==200">
              <img src="https://funwl.oss-cn-hangzhou.aliyuncs.com/images/le93cd5an8" alt="" width="100%" height="6px">
              <el-steps direction="vertical" :active="1" process-status="error ">
                <el-step v-for="(item,index) in information.data" :status="index!=0?'finish ':'error'" icon='el-icon-caret-top' :title="item.context" :description="item.time"></el-step>
              </el-steps>
            </div>
            <div v-else>
              <img src="https://funwl.oss-cn-hangzhou.aliyuncs.com/images/le93cd5an8" alt="" width="100%" height="6px">
              <div class="error-img"><img src="../assets/images/error.png" alt="" width="40%" height="200px" style="margin-left: 30%"></div>
              <p style="margin-left: 30%;color: #F56C6C;font-size: 16px;font-weight: bold">{{information.message}}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-dialog>

        <div class="show-index-banner">
          <el-carousel :interval="5000" arrow="always"  :height="(screenWidth/(1980/700))+'px'">
            <el-carousel-item >
              <span class="el-carousel-item-span  show-index-banner-imga"></span>
            </el-carousel-item>
            <el-carousel-item >
              <span class="el-carousel-item-span  show-index-banner-imgb"></span>
            </el-carousel-item>
            <el-carousel-item >
              <span class="el-carousel-item-span  show-index-banner-imgc"></span>
            </el-carousel-item>
            <el-carousel-item >
              <span class="el-carousel-item-span  show-index-banner-imgd"></span>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="show-index-title">
          <el-row>
              <el-col :span="4">
                  <div class="kong"></div>
              </el-col>
              <el-col :span="8">
                  <div class="show-index-title-text">
                    【新功能】"老板键"获悉每人工作
                  </div>
              </el-col>
              <el-col :span="8">
                <div class="show-index-title-text text-right">
                  查看最新通知
                </div>
              </el-col>
              <el-col :span="4">
                <div class="kong"></div>
              </el-col>
          </el-row>
        </div>




      <div class="show-index-box-video">
        <el-row>
          <el-col :span="4">
            <div class="kong"></div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-lside">
              <span >视频教程</span>
              <p>这里有一个快速上手的视频教程,
                由于视频中演示的版本低于最新的版本，
                可能有些界面会有不同，主要的功能的逻辑部分还是不变的。
                视频分为商家版与用户版。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="margin-top:-30px ">
            <el-carousel :interval="4000" type="card" height="300px"  style="min-width: 700px"  :autoplay="false">
              <el-carousel-item v-for="item in videoData">
                <p style="font-weight: bold;font-size: 16px;text-align: center;"><i class="el-icon-share"></i>{{item.name}}</p>
                <video  width="320" height="240" controls="controls">
                  <source :src="item.src" type="video/mp4">
                  <source :src="item.src" type="video/ogg">
                </video>
              </el-carousel-item>
            </el-carousel>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
        <div class="show-index-box">
            <el-row>
                <el-col :span="4">
                    <div class="kong"></div>
                </el-col>
                <el-col :span="8">
                    <div class="show-index-box-lside">
                        <span >精细化设计</span>
                        <p>弗恩物流平台的功能设计非常全面，涉及快递物流管理内部各个环节，从账单生成到催收，预警，截停等功能一应俱全，相当于四个全职财务的工作量！</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="show-index-box-rside">
                        <div>
                            <span class="show-index-box-lside-spana"></span>
                            <p>账单详情</p>
                        </div>
                        <div>
                          <span class="show-index-box-lside-spanb"></span>
                          <p>缴费预警</p>
                        </div>
                        <div>
                          <span class="show-index-box-lside-spanc"></span>
                          <p>物流截停</p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4"></el-col>
            </el-row>
        </div>
        <div class="show-index-box-play">
        <el-row>
          <el-col :span="4">
            <div class="kong"></div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-lside">
              <span >数据化分析</span>
              <p>从财务报表到应收账款明细，从订单信息统计到未来发展规划，快速提升网点管控和运营能力，老板只需通过“老板键”就能获悉网点每天的工作量和收支情况。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-rside">
              <div>
                <span class="show-index-box-lside-spana"></span>
                <p>账单详情</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanb"></span>
                <p>缴费预警</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanc"></span>
                <p>物流截停</p>
              </div>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
        <div class="show-index-box-kf">
        <el-row>
          <el-col :span="4">
            <div class="kong"></div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-lside">
              <span >专业化沟通</span>
              <p>物流平台配有专业的客服，通过APP端沟通与交流，协助客户处理物流异常</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-rside">
              <div>
                <span class="show-index-box-lside-spana"></span>
                <p>专业客服</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanb"></span>
                <p>物流处理</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanc"></span>
                <p>问题处理</p>
              </div>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
        <div class="show-index-box-play">
        <el-row>
          <el-col :span="4">
            <div class="kong"></div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-lside">
              <span >大众化操作</span>
              <p>系统的界面简单易懂，并且我司根据不同的物流快递公司的导出表格设计了相匹配的功能，帮助客户在快递平台页面转化间畅通无阻。</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-rside">
              <div>
                <span class="show-index-box-lside-spana"></span>
                <p>操作简便</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanb"></span>
                <p>表格设计</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanc"></span>
                <p>功能详细</p>
              </div>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
        <div class="show-index-box-ys">
        <el-row>
          <el-col :span="4">
            <div class="kong"></div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-lside">
              <span >平台优势</span>
              <p>专业的物流以及开发技术支持</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="show-index-box-rside">
              <div>
                <span class="show-index-box-lside-spana"></span>
                <p>完善服务</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanb"></span>
                <p>承载能力</p>
              </div>
              <div>
                <span class="show-index-box-lside-spanc"></span>
                <p>信息安全</p>
              </div>
            </div>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
        <div class="show-index-footer">

        </div>
    </section>
</template>

<script>
  import $axios from '../api/api'
    export default {
        name: "showIndex",
        data(){
          return{
            waybill:'',
            waybillArr:[],
            dialogTableVisible:false,
            activeName:"1",
            loading:false,
            information:'',
            videoData:[
              {
                src:'http://www.funwl.com:8090/video/khVideo.mp4',
                name:'商家版'
              },
              {
                src:'http://www.funwl.com:8090/video/kdVideo.mp4',
                name:'用户版'
              }
            ],
              screenWidth: document.body.clientWidth,
              token:sessionStorage.getItem('funwlToken')?sessionStorage.getItem('funwlToken'):'',
              userName:sessionStorage.getItem('funwlUserName')?sessionStorage.getItem('funwlUserName'):'',
             indexLoading:false,


          }
        },
      methods:{
        toLogin(){
          this.$router.push('/login')
        },
        entrance(val){
          let id = val;
          if (this.token==='') {
            this.$router.push('/login')
          }else {
            this.$router.push('/redirect?platId='+val)
          }
        },

        autonumber(){
          if(this.waybill==''||this.waybill==null){
            this.$message.error('请输入运单号');
            return
          }
          this.dialogTableVisible=true
          this.waybillArr = this.waybill.split(",")
          this.activeName = this.waybillArr[0]
          this.getWaybill(this.activeName)
        },
        getWaybill(val){
          if(val==''||val==null){
            return
          }
          this.information=''
          $axios.request({
            url:'/public/express/autonumber/'+val,
            method:'post',
            statu:2,
            _this:this,
            success:res=>{
              console.log("autonumber")
              console.log(res)
              if(res.data.auto.length<1){
                this.activeName =''
                this.$message.error('运单号错误或不存在');
              }else{
                this.queryNum(val,res.data.auto[0].comCode)
              }
            },
            fail:e=>{
            }
          })
        },
        queryNum(num,str){
          $axios.request({
            url:'/public/express/query/'+str+'/'+num,
            method:'post',
            statu:2,
            _this:this,
            success:res=>{
              console.log("query")
              console.log(res.data)
              this.information = res.data
              this.loading=false
              this.dialogTableVisible=true

            },
            fail:e=>{
            }
          })
        },
        logout(){
          this.$confirm('确定退出?', '提示', {
            confirmButtonText: '退出',
            cancelButtonText: '再看看！',
            type: 'warning'
          }).then(() => {
            $axios.request({
              url:'/public/logout',
              method:'get',
              statu:1,
              _this:this,
              success:res=>{
                sessionStorage.removeItem('funwlToken');
                sessionStorage.removeItem('funwlUserName');
                sessionStorage.removeItem('funwlPlatId');
                sessionStorage.removeItem('funwlPerson');
                sessionStorage.removeItem('funwlTelephone');
                sessionStorage.removeItem('funwlCompany');
                // this.$router.push('/showIndex');
                if (sessionStorage.getItem('funwlToken')) {
                  this.token = sessionStorage.getItem('funwlToken');
                  this.userName = sessionStorage.getItem('funwlUserName')
                }else{
                  this.token = '';
                  this.userName =''
                }
              },
              fail:e=>{
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        }

      },
      watch: {
        screenWidth (val) {
          let that = this;
          if (!this.timer) {
            this.screenWidth = val;
            this.timer = true;
            setTimeout(function () {
              // that.screenWidth = that.$store.state.canvasWidth
              that.init();
              that.timer = false
            }, 400)
          }
        }
      },
      mounted(){

          this.indexLoading = true;
        const that = this;
        window.onresize = () => {
          return (() => {
            window.screenWidth = document.body.clientWidth
            that.screenWidth = window.screenWidth
          })
        };
        setTimeout(
          ()=>{
            that.indexLoading = false
          },200
        )



      }
    }
</script>

<style scoped lang="less">
  .show-index-container{
    min-width: 1086px;
  }
  .show-index-header{
    height: 60px;
    width: 100%;
    background-color: #000000;
    color: #ffffff;
    line-height: 60px;
    font-size: 13px;
   .show-index-entrancd{
      span{
        display: inline-block;
        width: 80px;
        height: 13px;
        text-align: center;
        cursor: pointer;
        border-right: 1px solid #ffffff;
        line-height: 12px;
      }

   }
    .show-index-entrancd span:nth-child(3){
      border-right: none;
    }
    .show-index-user{
      display: inline-block;
      cursor: pointer;
      font-size: 13px;
    }
  }
  .kong{
    width: 100%;
    height: 60px;
  }
  .show-index-banner{
    .el-carousel-item-span{
      display: inline-block;
      width: 100%;
      height: 100%;
      -webkit-background-size: cover;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .show-index-banner-imga{
      background-image: url("../assets/images/index/banner3.1.jpg");
    }
    .show-index-banner-imgb{
      background-image: url("../assets/images/index/banner4.jpg");
    }
    .show-index-banner-imgc{
      background-image: url("../assets/images/index/banner5.jpg");
    }
    .show-index-banner-imgd{
      background-image: url("../assets/images/index/banner6.jpg");
    }
  }
  .show-index-title{
    height: 60px;
    background-color: #000000;
    width: 100%;
    .show-index-title-text{
      color: #ffffff;
      line-height: 60px;
      font-size: 18px;
      letter-spacing: 1px;
    }
  }
  .show-index-box{
    height: 400px;
    background-color: #000;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 85px 0;
    color: #fff;
    .show-index-box-lside{
      padding-right: 40%;
      padding-left: 20px;
      height: 230px;
      border-left: 10px solid #AE1615;
      span{
        display: inline-block;
        font-size: 25px;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }
      p{
        letter-spacing: 1px;
        font-size: 15px;
        line-height: 27px;
        text-align:justify;
        text-justify:inter-ideograph
      }
    }
    .show-index-box-rside{
      div{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        span{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          margin-top: 10px;
          margin-bottom: 40px;
          display: inline-block;
          width: 100px;
          height: 100px;

          background-repeat: no-repeat;
          background-size: cover;
        }
        p{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          font-size: 18px;
        }
      }
      div:hover{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        cursor: pointer;
        span{
          margin-bottom: 40px;
          display: inline-block;
          width: 120px;
          height: 120px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .show-index-box-lside-spana{
          background-image: url("../assets/images/index/zd.png");
        }
        .show-index-box-lside-spanb{
          background-image: url("../assets/images/index/yja.png");
        }
        .show-index-box-lside-spanc{
          background-image: url("../assets/images/index/cara.png");
        }
        p{
          font-size: 18px;
          color: #AE1615;
        }
      }
    }
    .show-index-box-lside-spana{
      background-image: url("../assets/images/index/zda.png");
    }
    .show-index-box-lside-spanb{
      background-image: url("../assets/images/index/yj.png");
    }
    .show-index-box-lside-spanc{
      background-image: url("../assets/images/index/car.png");
    }
  }
  .text-right{
  text-align: right;
}
  .show-index-box-video{
    height: 400px;
    background-color: #fff;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 85px 0;
    color: #000;
    .show-index-box-lside{
      padding-right: 40%;
      padding-left: 20px;
      height: 230px;
      border-left: 10px solid #AE1615;
      span{
        display: inline-block;
        font-size: 25px;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }
      p{
        letter-spacing: 1px;
        font-size: 15px;
        line-height: 27px;
        text-align:justify; text-justify:inter-ideograph
      }
  }
    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
    }

  .show-index-box-blank {
    height: 400px;
    background-color: #fff;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 85px 0;
    color: #000;
    .show-index-box-lside {
      padding-right: 40%;
      padding-left: 20px;
      height: 230px;
      border-left: 10px solid #AE1615;
      span {
        display: inline-block;
        font-size: 25px;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }
      p {
        letter-spacing: 1px;
        font-size: 15px;
        line-height: 27px;
        text-align: justify;
        text-justify: inter-ideograph
      }
    }
  }
    .show-index-box-rside{
      div{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        span{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          margin-top: 10px;
          margin-bottom: 40px;
          display: inline-block;
          width: 100px;
          height: 100px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        p{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          font-size: 18px;
        }
      }
      div:hover{
        display: inline-block;
        width: 32%;
        height: 210px;
        background-color: #AE1615;
        text-align: center;
        cursor: pointer;
        span{
          margin-top: 10px;
          margin-bottom: 40px;
          display: inline-block;
          width: 100px;
          height: 100px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .show-index-box-lside-spana{
          background-image: url("../assets/images/index/tj.png");
        }
        .show-index-box-lside-spanb{
          background-image: url("../assets/images/index/gzla.png");
        }
        .show-index-box-lside-spanc{
          background-image: url("../assets/images/index/sz.png");
        }
        p{
          font-size: 18px;
          color: #ffffff;
        }
      }
    }
    .show-index-box-lside-spana{
      background-image: url("../assets/images/index/tja.png");
    }
    .show-index-box-lside-spanb{
      background-image: url("../assets/images/index/gzl.png");
    }
    .show-index-box-lside-spanc{
      background-image: url("../assets/images/index/sza.png");
    }
  }
  .show-index-box-kf{
    height: 400px;
    background-color: #000;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 85px 0;
    color: #fff;
    .show-index-box-lside{
      padding-right: 40%;
      padding-left: 20px;
      height: 230px;
      border-left: 10px solid #AE1615;
      span{
        display: inline-block;
        font-size: 25px;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }
      p{
        letter-spacing: 1px;
        font-size: 15px;
        line-height: 27px;
        text-align:justify; text-justify:inter-ideograph
      }
    }
    .show-index-box-rside{
      div{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        span{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          margin-top: 10px;
          margin-bottom: 40px;
          display: inline-block;
          width: 100px;
          height: 100px;

          background-repeat: no-repeat;
          background-size: cover;
        }
        p{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          font-size: 18px;
        }
      }
      div:hover{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        cursor: pointer;
        span{
          margin-bottom: 40px;
          display: inline-block;
          width: 120px;
          height: 120px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .show-index-box-lside-spana{
          background-image: url("../assets/images/index/kfa02.png");
        }
        .show-index-box-lside-spanb{
          background-image: url("../assets/images/index/wlpsa.png");
        }
        .show-index-box-lside-spanc{
          background-image: url("../assets/images/index/cara.png");
        }
        p{
          font-size: 18px;
          color: #AE1615;
        }
      }
    }
    .show-index-box-lside-spana{
      background-image: url("../assets/images/index/kf.png");
    }
    .show-index-box-lside-spanb{
      background-image: url("../assets/images/index/wlps.png");
    }
    .show-index-box-lside-spanc{
      background-image: url("../assets/images/index/car.png");
    }
  }
  .show-index-box-play{
    height: 400px;
    background-color: #fff;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 85px 0;
    color: #000;
    .show-index-box-lside{
      padding-right: 40%;
      padding-left: 20px;
      height: 230px;
      border-left: 10px solid #AE1615;
      span{
        display: inline-block;
        font-size: 25px;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }
      p{
        letter-spacing: 1px;
        font-size: 15px;
        line-height: 27px;
        text-align:justify; text-justify:inter-ideograph
      }
    }
    .show-index-box-rside{
      div{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        span{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          margin-top: 10px;
          margin-bottom: 40px;
          display: inline-block;
          width: 100px;
          height: 100px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        p{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          font-size: 18px;
        }
      }
      div:hover{
        display: inline-block;
        width: 32%;
        height: 210px;
        background-color: #AE1615;
        text-align: center;
        cursor: pointer;
        span{
          margin-top: 10px;
          margin-bottom: 40px;
          display: inline-block;
          width: 100px;
          height: 100px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .show-index-box-lside-spana{
          background-image: url("../assets/images/index/playa.png");
        }
        .show-index-box-lside-spanb{
          background-image: url("../assets/images/index/edit.png");
        }
        .show-index-box-lside-spanc{
          background-image: url("../assets/images/index/xt.png");
        }
        p{
          font-size: 18px;
          color: #ffffff;
        }
      }
    }
    .show-index-box-lside-spana{
      background-image: url("../assets/images/index/play.png");
    }
    .show-index-box-lside-spanb{
      background-image: url("../assets/images/index/edita.png");
    }
    .show-index-box-lside-spanc{
      background-image: url("../assets/images/index/xt.png");
    }
  }
  .show-index-box-ys{
    height: 400px;
    background-color: #000;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 85px 0;
    color: #fff;
    .show-index-box-lside{
      padding-right: 40%;
      padding-left: 20px;
      height: 230px;
      border-left: 10px solid #AE1615;
      span{
        display: inline-block;
        font-size: 25px;
        margin-bottom: 40px;
        letter-spacing: 2px;
      }
      p{
        letter-spacing: 1px;
        font-size: 15px;
        line-height: 27px;
        text-align:justify; text-justify:inter-ideograph
      }
    }
    .show-index-box-rside{
      div{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        span{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          margin-top: 10px;
          margin-bottom: 40px;
          display: inline-block;
          width: 100px;
          height: 100px;

          background-repeat: no-repeat;
          background-size: cover;
        }
        p{
          -webkit-transition: all 0.5s;
          -moz-transition: all 0.5s;
          -ms-transition: all 0.5s;
          -o-transition: all 0.5s;
          transition: all 0.5s;
          font-size: 18px;
        }
      }
      div:hover{
        display: inline-block;
        width: 32%;
        height: 210px;
        text-align: center;
        cursor: pointer;
        span{
          margin-bottom: 40px;
          display: inline-block;
          width: 120px;
          height: 120px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .show-index-box-lside-spana{
          background-image: url("../assets/images/index/fwgwa.png");
        }
        .show-index-box-lside-spanb{
          background-image: url("../assets/images/index/wlpsa.png");
        }
        .show-index-box-lside-spanc{
          background-image: url("../assets/images/index/aqa.png");
        }
        p{
          font-size: 18px;
          color: #AE1615;
        }
      }
    }
    .show-index-box-lside-spana{
      background-image: url("../assets/images/index/fugw.png");
    }
    .show-index-box-lside-spanb{
      background-image: url("../assets/images/index/wlps.png");
    }
    .show-index-box-lside-spanc{
      background-image: url("../assets/images/index/aq.png");
    }
  }
  .show-index-footer{
    height: 10px;
    background-color: #fff;
  }
</style>
