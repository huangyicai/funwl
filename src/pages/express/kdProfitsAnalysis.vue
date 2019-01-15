<template>
  <section class="clearfix">
    <div class="kdPro-analysis-container">
      <div class="kdPro-analysis-left">
        <div class="kdPro-analysis-left-title">
          <span class="el-icon-tickets" style="font-size: 14px">成员列表</span>
        </div>
        <el-tree
          style="z-index: 999 ;"
          :data="treeData"
          :props="defaultProps"
           node-key="id"
          :default-expanded-keys="selectedNode"
          :default-checked-keys="selectedNode"
          show-checkbox
          @check="handleCheckChange"
          @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="iconfont icon-iconset0450  kdPro-data-ana" v-if="data.platformId!==3">  &nbsp;{{ node.label }}</span>
            <span class="iconfont icon-addressbook_fill kdPro-data-ana" v-if="data.platformId===3">  &nbsp;{{ node.label }}</span>
        <span>
        </span>
      </span>
        </el-tree>
      </div>
      <div class="kdPro-analysis-right" >
        <div class="kdPro-analysis-right-nav">
          <el-radio-group v-model="tabPosition" @change="tabChange">
            <el-radio-button label="数据分析" name="1"></el-radio-button>
            <el-radio-button label="利润分析" name="2"></el-radio-button>
            <el-radio-button label="收银管理" name="3"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="kdPro-analysis-right-all"  v-loading="kdDataLoading">
          <div class="kdPro-analysis-right-time">
            <span class="el-icon-date " style="font-size: 13px">  时间 : </span>
            <el-date-picker
              v-model="month"
              type="month"
              format="yyyy-MM"
              prefix-icon="el-icon-time"
              size="small"
              placeholder="请选择日期"
              @change="handelChange">
            </el-date-picker>
            --
            <el-date-picker
              v-model="monthEnd"
              type="month"
              format="yyyy-MM"
              prefix-icon="el-icon-time"
              size="small"
              placeholder="请选择日期"
              @change="handelEndChange">
            </el-date-picker>
          </div>

          <el-card class="kdPro-analysis-right-header"  shadow="hover">
            <div slot="header" class="clearfix" style="text-align: center;font-weight: bold">
              <span>实收数据</span>
            </div>
            <div class="kdPro-analysis-right-header-item">
              <el-tooltip   effect="dark" content="已付款账单的全部金额！" placement="bottom">
                <span>&nbsp;￥实收：{{profitsData.totalPaid}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-right-header-item">
              <el-tooltip   effect="dark" content="已付款账单的成本金额！" placement="bottom">
                <span>￥&nbsp;实收成本：{{profitsData.paidCost}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-right-header-item">
              <el-tooltip   effect="dark" content="实收单价 = 实收总金额÷总单量" placement="bottom">
                <span>￥&nbsp;实收单价：{{profitsData.paidOnePrice }}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-right-header-item">
              <el-tooltip   effect="dark" content="实收利润 = 实收 - 实收成本" placement="bottom">
                <span>￥&nbsp;实收利润：{{profitsData.paidProfits}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-right-header-item">
              <el-tooltip   effect="dark" content="实收成本单价 = 实收成本金额÷总单量" placement="bottom">
                <span class="iconfont icon-banshou">&nbsp;实收成本单价：{{profitsData.paidCostOne}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-right-header-item">
              <el-tooltip   effect="dark" content="实收单件利润 = 实收单价 - 实收成本单价" placement="bottom">
                <span class="iconfont icon-banshou">&nbsp;实收单件利润：{{profitsData.paidOneProfits}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-right-header-item-p">
              <el-tooltip   effect="dark" content="实收利润百分比 = 实收利润÷实收金额" placement="bottom">
                <span>%&nbsp;实收利润百分比：{{(profitsData.paidProfitsPercentage*100<0?0:profitsData.paidProfitsPercentage*1000000/10000).toFixed(2)}}%</span>
              </el-tooltip>
            </div>
          </el-card>

          <el-card class="kdPro-analysis-left-header"  shadow="hover">
            <div slot="header" class="clearfix" style="text-align: center;font-weight: bold">
              <span>应收数据</span>
            </div>
            <div class="kdPro-analysis-left-header-item">
              <el-tooltip   effect="dark" content="已发送（包括已付款）账单的全部金额！" placement="bottom">
                <span>&nbsp;￥应收：{{profitsData.totalOffer}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-left-header-item">
              <el-tooltip   effect="dark" content="已发送（包括已付款）账单的成本金额！" placement="bottom">
                <span>￥&nbsp;应收成本：{{profitsData.offerCost}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-left-header-item">
              <el-tooltip   effect="dark" content="应收单价 = 应收总金额÷总单量" placement="bottom">
                <span>￥&nbsp;应收单价：{{profitsData.offerOnePrice }}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-left-header-item">
              <el-tooltip   effect="dark" content="应收利润 = 应收 - 应收成本" placement="bottom">
                <span>￥&nbsp;应收利润：{{profitsData.offerProfits}}</span>
              </el-tooltip>

            </div>
            <div class="kdPro-analysis-left-header-item">
              <el-tooltip   effect="dark" content="应收成本单价 = 应收成本÷总单量" placement="bottom">
                <span class="iconfont icon-banshou">&nbsp;应收成本单价：{{profitsData.offerCostOne}}</span>
              </el-tooltip>
            </div>
            <div class="kdPro-analysis-left-header-item">
              <el-tooltip   effect="dark" content="应收单件利润 = 应收单价 - 应收成本单价" placement="bottom">
                <span class="iconfont icon-banshou">&nbsp;应收单件利润：{{profitsData.offerOneProfits}}</span>
              </el-tooltip>
            </div>

            <div class="kdPro-analysis-left-header-item-p">
              <el-tooltip   effect="dark" content="应收利润百分比 = 应收利润÷应收" placement="bottom">
                <span>%&nbsp;应收利润百分比：{{(profitsData.offerProfitsPercentage*100<0?0:profitsData.offerProfitsPercentage*10000/100).toFixed(2)}}%</span>
              </el-tooltip>
            </div>
          </el-card>

          <el-card class="kdPro-analysis-right-main"  shadow="hover">
            <div class="kdPro-analysis-right-main-item">
              <span></span>总单量:{{profitsData.totalNumber }}
            </div>
            <div class="kdPro-analysis-right-main-item">
              <span></span>每日单量:{{profitsData.averageNumber }}
            </div>
            <div class="kdPro-analysis-right-main-item">
              <span></span>平均重量:{{profitsData.averageWeight }}
            </div>
            <div class="kdPro-analysis-right-main-item">
              <span></span>总重量:{{profitsData.totalWeight }}
            </div>
          </el-card>
          <div class="kdPro-analysis-right-footer" ref="numImg">
        </div>

        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import echarts from 'echarts'
  import $axios from '../../api/api'

  export default {
    data() {
      return {
        tabPosition: '利润分析',
        indetNum: 23,
        treeData: [],
        defaultProps: {
          children: 'sysUserInfos',
          label: 'name',
          value: 'id'
        },
        month: '',
        monthEnd: '',
        kdDataLoading:false,
        checkedKeysData:[],
        profitsData:{
          paidProfits:0,
          paidOneProfits:0,
          paidCostOne:0,
          paidOnePrice:0,
          paidCost:0,
          totalPaid:0,
          paidProfitsPercentage:0,

          totalOffer:0,
          offerCost:0,
          offerOnePrice:0,
          offerCostOne:0,
          offerOneProfits:0,
          offerProfits:0,
          offerProfitsPercentage:0,

          totalNumber:0,
          averageNumber:0,
          averageWeight:0,
          totalWeight:0
        },
        selectedNode:[],
      };
    },
    methods: {
      getUserList() {
        $axios.request({
          url: '/express/cusmoters',
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.treeData = res.data;
            if (res.data.length>0){
              this.selectedNode.push(res.data[0].id)
              this.getCustomersInfo();
            }

          },
          fail: res => {
            console.log(res);
          }
        })
      },
      handleNodeClick(data) {
      },
      getInfo(arr){
        $axios.request({
          url:'/express/total/getProfits',
          method:'post',
          data:{
            date:this.month,
            endDate:this.monthEnd,
            userId:arr.join()
          },
          _this:this,
          statu:2,
          success:res=>{
            if (res.data!==null){
              this.profitsData =res.data;
            }else {
              this.profitsData={
                paidProfits:0,
                paidOneProfits:0,
                paidCostOne:0,
                paidOnePrice:0,
                paidCost:0,
                totalPaid:0,
                paidProfitsPercentage:0,

                totalOffer:0,
                offerCost:0,
                offerOnePrice:0,
                offerCostOne:0,
                offerOneProfits:0,
                offerProfits:0,
                offerProfitsPercentage:0,

                totalNumber:0,
                averageNumber:0,
                averageWeight:0,
                totalWeight:0
              }
            }
            this.kdDataLoading = false;
          },
          fail:error=>{
            console.log(error);
            this.kdDataLoading = false;
          }
        })
      },
      handleCheckChange(val, arr, b) {
        this.kdDataLoading = true;
        this.checkedKeysData = arr.checkedKeys;
        if (arr.checkedKeys.length===0){
          this.profitsData={
            paidProfits:0,
            paidOneProfits:0,
            paidCostOne:0,
            paidOnePrice:0,
            paidCost:0,
            totalPaid:0,
            paidProfitsPercentage:0,

            totalOffer:0,
            offerCost:0,
            offerOnePrice:0,
            offerCostOne:0,
            offerOneProfits:0,
            offerProfits:0,
            offerProfitsPercentage:0,

            totalNumber:0,
            averageNumber:0,
            averageWeight:0,
            totalWeight:0
          };
          setTimeout(()=>{
            this.kdDataLoading = false;
          },200)
          return false
        }
        this.getInfo(this.checkedKeysData);
      },
      getEndDate(date){
        let nowDate = date;
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth()+1;
        month = month<10? '0'+month:month;
        this.monthEnd = year+'-'+month;
      },
      handelEndChange(val){
        if(val!=='' && val!==null){
          if(new Date(this.monthEnd).getTime()<=new Date(this.month).getTime()){
            this.$message({
              type:'warning',
              message:'结束时间需大于开始时间',
              duration:1000,
            })
            this.monthEnd=''
            return;
          }
          this.getEndDate(val);
        }
        if (this.checkedKeysData.length===0){
          this.$message({
            type:'warning',
            message:'请先在侧边栏选择客户',
            duration:500,
          })
          return false
        }
        this.getInfo(this.checkedKeysData)
      },
      handelChange(val){
        if(val==null||val==''){
          this.$message({
            type:'warning',
            message:'请选择起始时间',
            duration:1000,
          })
          return
        }
        this.getNowDate(val);
        if (this.checkedKeysData.length===0){
          this.$message({
            type: 'warning',
            message: '请先在侧边栏选择客户',
            duration:500,
          });
          return false
        }
        this.getInfo(this.checkedKeysData);
      },
      getNowDate(date){
        let nowDate = date;
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth()+1;
        month = month<10? '0'+month:month;
        this.month = year+'-'+month;
      },
      tabChange(val) {
        let _this = this;
        switch (val) {
          case '数据分析':
            _this.$router.push('/kdData');
            break;
          case '利润分析':
            _this.$router.push('/kdProfits');
            break;
          case '收银管理':
            _this.$router.push('/kdBillAnalysis');
            break;
        }
      },
      getCustomersInfo() {
        $axios.request({
          url: '/express/pricingGroup/customers',
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {

            let arr = [];
            if (res.data.length>0){
              res.data.forEach(v=>{
                arr.push(v.id);
              })
              this.checkedKeysData = arr;
              this.getInfo(arr)
            }
          },
          fail: error => {

          }
        })
      },
      getTime(){
        $axios.request({
          url:'/express/total/getTime',
          method:'get',
          _this:this,
          statu:1,
          success:res=>{
            this.month = res.data
          },
          fail:res=>{
            console.log(res)
          }
        })
      }

    },
    mounted() {
      this.getUserList();
      //this.getNowDate(new Date());
      this.getTime()
    }
  };
</script>

<style scoped lang="less">
  .kdPro-analysis-container {
    width: 100%;
    position: relative;
    /*左边*/
    .kdPro-analysis-left {
      position: absolute;
      left: 0;
      box-sizing: border-box;
      width: 320px;
      height: 890px;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px 40px 20px 20px;
      background-color: #fff;
      .kdPro-analysis-left-title {
        span {
          font-size: 14px;
          height: 60px;
          /*font-weight: 700;*/
          color: black;
          line-height: 60px;
          letter-spacing: 1px;
          color: #1c2438;
          font-weight: 700;
        }
        border-bottom: 1px solid #eeeeee;
        margin-bottom: 30px;
      }
    }
    /*右边*/
    .kdPro-analysis-right {
      margin-left: 325px;
      padding: 20px 0px 20px 0;
      box-sizing: border-box;
      min-height:890px;
      min-width: 1100px;
      background-color: #ffffff;
      box-shadow: -10px 0px 5px -5px #dddddd;
      font-size: 15px;
      color: black;

      .kdPro-analysis-right-nav {
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 10px;
        padding-left: 20px;
      }
      .kdPro-analysis-right-all{
        width: 100%;
        height: 800px;
        font-size: 15px;
        font-weight: bold;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
        padding-left: 30px;
        padding-right: 10px;
      }
      .kdPro-analysis-right-time {
        margin-top: 20px;
        margin-bottom: 40px;
      }
      .kdPro-analysis-right-header {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 50px;
        margin-top: 20px;
        width: 49%;
        height: 400px;
        .kdPro-analysis-right-header-item {
          display: inline-block;
          width: 49%;
          height: 75px;
          line-height: 70px;
          letter-spacing: 1px;

        }
        .kdPro-analysis-right-header-item-p {
          display: inline-block;
          width: 100%;
          height: 75px;
          line-height: 70px;
          letter-spacing: 1px;

        }
      }
      .kdPro-analysis-left-header {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 50px;
        margin-top: 20px;
        margin-left: 10px;
        width: 49%;
        height: 400px;
        .kdPro-analysis-left-header-item {
          display: inline-block;
          width: 49%;
          height: 75px;
          line-height: 70px;
          letter-spacing: 1px;

        }
        .kdPro-analysis-left-header-item-p {
          display: inline-block;
          width: 100%;
          height: 75px;
          line-height: 70px;
          letter-spacing: 1px;

        }
      }

      .kdPro-analysis-right-main {
        /*width: 90%;*/
        height: 130px;
        padding: 0 50px;
        margin-top: 20px;
        .kdPro-analysis-right-main-item {
          display: inline-block;
          width: 24%;
          line-height: 85px;
          span {
            display: inline-block;
            height: 7px;
            width: 7px;
            margin-right: 5px;
            line-height: 100px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            background-color: red;
          }
        }
      }

    }
  }

  .kdPro-data-ana {
    font-size: 13px;
  }

</style>
