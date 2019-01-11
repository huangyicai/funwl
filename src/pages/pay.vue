<template>
  <section>
    <div class="pay-header">
      <el-row>
        <el-col :span="5"><div class="pay-grid-content"></div></el-col>
        <el-col :span="14">
          <div class="pay-grid-content" style="font: 20px Extra large;line-height: 50px">
            <i class="el-icon-star-on"></i>百里百里&nbsp;
            <span style="font: 23px Extra large;color: #00a0f0;line-height: 50px">续费</span>
            <span v-if="platId==3" style="font: 16px Extra large;color: red;">(注：由于您所属快递企业账号使用期限已到，请及时提醒其账号归属者续费，即可继续使用。)</span>
          </div>
        </el-col>
        <el-col :span="5"><div class="pay-grid-content"></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="5"><div class="pay-content"></div></el-col>
        <el-col :span="14">
          <div class="pay-content" style="background: #fff ; margin-top: 10px;padding: 50px;">
            <div style="margin-top: 100px;">
              <i class="el-icon-location"></i>&nbsp;&nbsp;<span  style="font: 16px Medium;">续费时间:</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <div style="display: inline-block">
                  <!--<el-button class="fl offerPay" :type="item.status===2?'warning':'danger'" plain   :disabled="item.status===2?true:false"
                             v-for="item in sysPrices" style="margin-left: 40px" @click="totalPrice(item)">
                    <span style="font: 22px Extra large;">{{item.monthNum}}个月</span>
                    <div class="fontPay">
                      <p class="original-price">原价:<span>￥{{item.originalPrice}}.0</span></p>
                      <p style="font-weight: bold;">{{item.actualName}}:<span>￥{{item.actualPrice}}.0</span></p>
                    </div>
                  </el-button>-->


                  <!--<el-button class="fl offerPay" type="warning" plain style="margin-left: 40px" @click="totalPrice(1000)">
                    <span style="font: 22px Extra large;">1个月</span>
                    <div class="fontPay">
                      &lt;!&ndash;<p class="original-price">原价:<span>￥{{item.originalPrice}}.0</span></p>&ndash;&gt;
                      <p style="font-weight: bold;">优惠价<span>￥1000.0</span></p>
                    </div>
                  </el-button>-->

                  <el-button class="fl offerPay" type="danger" plain style="margin-left: 40px" @click="totalPrice(200)">
                    <span style="font: 22px Extra large;">1个月</span>
                    <div class="fontPay">
                      <p class="original-price">原价:<span>￥1000.0</span></p>
                      <p style="font-weight: bold;">优惠价<span>￥200.0</span></p>
                    </div>
                  </el-button>
                  <el-button class="fl offerPay" type="warning" plain style="margin-left: 40px" @click="totalPrice(2000)">
                    <span style="font: 22px Extra large;">12个月</span>
                    <div class="fontPay">
                      <p class="original-price">原价:<span>￥12000.0</span></p>
                      <p style="font-weight: bold;">优惠价<span>￥2000.0</span></p>
                    </div>
                  </el-button>


                  <el-tooltip class="item" effect="dark" :content="content" placement="right-end">
                    <i class="el-icon-question" style="font-size: 25px"></i>
                  </el-tooltip>
                </div>
            </div>
            <!--<br/><br/>
            <div>
              <el-button type="primary" icon="el-icon-edit" circle ></el-button>
              <el-button type="success" icon="el-icon-check" circle></el-button>
              <el-button type="info" icon="el-icon-message" circle></el-button>
              <el-button type="warning" icon="el-icon-star-off" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </div>-->
            <div class="pay-content-time" style="margin-top: 300px;background:#edf2fc" >
                <el-row>
                  <el-col :span="10"><div class="pay-grid-content"></div></el-col>
                  <el-col :span="7"><div class="pay-grid-content">
                    <span style="font: 18px Extra large;color: red">支付宝:&nbsp;&nbsp;</span>
                    <span style="font: 22px Extra large;color: red">￥{{totalItemObj.actualPrice}}.0</span>
                  </div></el-col>
                  <el-col :span="7">
                    <div class="pay-grid-content">
                      <el-button type="primary" @click="pay">立即购买</el-button>
                    </div>
                  </el-col>
                </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="5"><div class="pay-content"></div></el-col>
      </el-row>

      <div v-html="fromDate">

      </div>
    </div>
  </section>
</template>
<script type="text/ecmascript-6">
  import $axios from "../api/api"
    name: ""
    export default {
        data() {
            return {
              radio7: '1',
              fromDate:"",
              content:"持续优惠中...",
              sysPrices:[],
              totalItemObj:{
                actualPrice:"0"
              },
              platId:sessionStorage.getItem('funwlPlatId'),
            }
        },
      methods:{
          pay(){
            let _this = this;
            $axios.request({
              url: "/public/alipay/"+_this.totalItemObj.actualPrice,
              method: 'post',
              statu: 2,
              _this: _this,
              success: res => {
                _this.fromDate = res.data.body;
                sessionStorage.setItem('funwlStatus',1)
                setTimeout(
                  ()=>{
                    document.forms[0].submit();
                  },100
                )
              },
              fail:()=>{

              }
            })
          },
        sysPrice(){
          let _this = this;
          $axios.request({
            url: "/public/alipay/sysPrice",
            method: 'get',
            statu: 1,
            _this: _this,
            success: res => {
              _this.sysPrices = res.data;
            },
            fail:()=>{

            }
          })
        },
        totalPrice(totalItem){
          this.totalItemObj.actualPrice = totalItem
        }
      },
      mounted() {
        this.sysPrice();
      },
    }
</script>
<style>
  .pay-header{
    background: #ffffff;
    width: 100%;
    height: 50px;
  }
  .pay-grid-content{
    height: 50px;
  }
  .pay-content{
    min-height: 700px;
  }
.pay-content-time{
  height: 100px;
  line-height: 100px;
}
  .offerPay{
    text-align: center;
    font: 20px Extra large;
    padding: 5px;
    width: 120px;
    height: 120px;
    background: #edf2fc;
    margin-left: 10px;
  }
  .fontPay{
    font:14px Small;
    text-align: left;
    margin-top: 10px;
  }
  .original-price{
    text-decoration:line-through;
  }
  .item{
    margin-left: 50px;
  }
</style>
