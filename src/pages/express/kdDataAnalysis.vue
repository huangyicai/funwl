<template>
  <section class="data-analysis-container">
      <div class="data-analysis-left">
        <div class="data-analysis-left-title">
          <span class="el-icon-tickets">成员列表</span>
        </div>
        <div class="data-analysis-left-content">
          <el-tree
            style="z-index: 999 ;"
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="anNode"
            :default-checked-keys="selectedNode"
            show-checkbox
            @check="handleCheckChange"
            highlight-current
             >
                <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="iconfont icon-iconset0450  kd-data-ana" v-if="data.platformId!==3">  &nbsp;{{ node.label }}</span>
                    <span class="iconfont icon-addressbook_fill kd-data-ana" v-if="data.platformId===3">  &nbsp;{{ node.label }}</span>
        <span>

        </span>
      </span>

          </el-tree>

        </div>
      </div>
          <div class="data-analysis-right"  >
            <div class="data-analysis-right-nav">
              <el-radio-group v-model="tabPosition" @change="tabChange">
                <el-radio-button label="数据分析" name="1"></el-radio-button>
                <el-radio-button label="利润分析" name="2"></el-radio-button>
                <el-radio-button label="收银管理" name="3"></el-radio-button>
              </el-radio-group>
            </div>
              <div class="data-analysis-right-main"   v-loading="kdDataLoading">
              <div class="data-analysis-right-item data-analysis-right-time">
                <span class="el-icon-date"> 时间 : </span>
                <el-date-picker
                  v-model="month"
                  type="month"
                  format="yyyy-MM"
                  prefix-icon="el-icon-time"
                  size="small"
                  placeholder="请选择日期"
                  @change="handelChange">
                </el-date-picker>
              </div>
              <div class="data-analysis-right-item">
                <span class="data-analysis-right-item-num el-icon-document">&nbsp;总单量：{{monthData.totalNumber}}</span>
                <span class="data-analysis-right-item-num  el-icon-document">&nbsp;每日单量：{{monthData.dailyNum}}</span>
              </div>
              <div class="data-analysis-right-item">
                <span class="iconfont icon-banshou  data-analysis-right-item-weight">&nbsp;总重量(kg)：{{monthData.totalWeight}}</span>
                <span class="iconfont icon-banshou  data-analysis-right-item-weight">&nbsp;平均重量(kg)：{{monthData.averageWeight}}</span>
              </div>
                <el-row>
                  <el-col :span="8">
                    <div class="data-analysis-right-item data-analysis-right-city clearfix">
                      <span class="iconfont icon-bingtu fl" style="font-size: 13px;letter-spacing: 1px">&nbsp;本月目的地分布:</span>
                      <div class="city-accounted  fl">
                        <el-row class="city-accounted-item-title">
                          <el-col :span="8">
                    <span>
                      省份
                    </span></el-col>
                          <el-col :span="8">
                            <div  class="city-accounted-icon">
                              单量 <span >
                              <i  class="el-icon-caret-top" @click="sorting(1)"></i>
                              <i  class="el-icon-caret-bottom"  style="margin-top: -5px"  @click="sorting(2)"></i>
                            </span>
                            </div>
                          </el-col>
                          <el-col :span="8">
                            <div  class="city-accounted-icon">
                              比例  <span >
                              <i  class="el-icon-caret-top" @click="sorting(1)"></i>
                              <i  class="el-icon-caret-bottom"  style="margin-top: -5px"  @click="sorting(2)"></i>
                            </span>
                            </div>
                          </el-col>
                        </el-row>
                        <div class="city-accounted-main">
                          <el-row class="city-accounted-item" v-for="item in provincesData">
                            <el-col :span="8">{{item.name}}</el-col>
                            <el-col :span="8">{{item.value}}</el-col>
                            <el-col :span="8">{{item.proportion}}</el-col>
                          </el-row>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="15">
                    <div class="data-analysis-right-item">
                      <div class="data-analysis-right-item-img" ref="weightChart">

                      </div>
                    </div>
                  </el-col>
                  <el-col :span="1">
                    <div class="kong"></div>
                  </el-col>
                </el-row>

                <div class="data-analysis-right-item ">
                <span class="iconfont icon-bingtu " style="font-size: 13px;letter-spacing: 1px"> 重量占比：</span>
                <div class="data-right-weight clearfix ">
                  <p class="data-right-weight-item fl"  v-for="item in weightData">
                    <span> {{item.name}}(kg)</span>
                    <span> {{item.value}}</span>
                    <span>{{item.proportion}}</span>
                  </p>
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
        tabPosition: '数据分析',
        indetNum:23,
        treeData: [],
        defaultProps: {
          children: 'sysUserInfos',
          label: 'name',
          value: 'id'
        },
        month: '',
        provincesData:[],
        monthData:[],
        weightData:[],
        kdDataLoading:false,
        checkedKeysData:[],
        selectedNode:[],
        anNode:[],
        weightObj:{},

      };
    },
    methods: {
      //getinfo
      getUserList() {
        $axios.request({
          url: '/express/cusmoters',
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {

            if (res.data.length>0){
              this.treeData = res.data;
              this.selectedNode.push(res.data[0].id)
              this.anNode.push(res.data[0].id)
              this.getCustomersInfo();
            }
          },
          fail: res => {
            console.log(res);
          }
        })
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
              this.getMonthInfo(arr)
            }
          },
          fail: error => {

          }
        })
      },
      getWeightInfo(arr){
        $axios.request({
          url:'/express/weightCalculate/getWeightCalculate',
          method:'post',
          _this:this,
          data:{
            userId:arr.join(),
            date:this.month
          },
          statu:2,
          success:res=>{
            this.weightObj = res.data;
            let arr = [];
            let num = 0;
            for(let key in res.data){
              if (this.monthData.totalWeight==0){
                num = 0;
              } else {
                num=(((res.data[key].weight*100)/(this.monthData.totalWeight*100))*100).toFixed(2);
              }
              arr.push({
                name:res.data[key].interval,
                value:res.data[key].weight,
                proportion:num+'%',
                id:parseInt(key)===NaN?999:parseInt(key),
              })
            }
            arr.sort(function (x,y) {
              return x.id-y.id
            });
            this.weightData = arr
            this.getChart();
          },
          fail:res=>{
            console.log(res)
          }
        })

      },
      getProvincesInfo(arr){
        $axios.request({
          url:'/express/provinceCalculate/getProvinceCalculate',
          method:'post',
          _this:this,
          data:{
            userId:arr.join(),
            date:this.month
          },
          statu:2,
          success:res=>{
            let arr = [];
            let num = 0;
            for (let i in res.data) {
              if (this.monthData.totalNumber==0){
                num =0;
              }  else {
                num = ((res.data[i]*100)/(this.monthData.totalNumber*100)*100).toFixed(2)
              }
              arr.push({
                name:i,
                value:res.data[i],
                proportion:num+'%'

              })
            }
            arr.sort((x,y)=>{
              return y.value-x.value
            });
            this.provincesData = arr;
          },
          fail:res=>{
            console.log(res)
          }
        })
      },
      getMonthInfo(arr){
        $axios.request({
          url:'/express/total/getBillData',
          method:'post',
          _this:this,
          data:{
            userId:arr.join(),
            date:this.month
          },
          statu:2,
          success:res=>{
            this.monthData = res.data;
            this.getProvincesInfo(arr);
            this.getWeightInfo(arr);
            setTimeout(()=>{
              this.kdDataLoading = false;
            },200)
          },
          fail:res=>{
            console.log(res)
            this.kdDataLoading = false;
          }
        })
      },
      currentNode(node){
        console.log(node);
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
      handleCheckChange(val,arr,b){
        this.provincesData = []
        this.weightObj = {}
        this.weightData = [];
        this.kdDataLoading = true;
        this.checkedKeysData = arr.checkedKeys;
        if (arr.checkedKeys.length===0){
          let provincesObj = {
            上海: "0",
            云南: "0",
            内蒙古: "0",
            北京: "0",
            台湾: "0",
            吉林: "0",
            四川: "0",
            天津: "0",
            宁夏: "0",
            安徽: "0",
            山东: "0",
            山西: "0",
            广东: "0",
            广西: "0",
            新疆: "0",
            江苏: "0",
            江西: "0",
            河北: "0",
            河南: "0",
            浙江: "0",
            海南: "0",
            湖北: "0",
            湖南: "0",
            澳门: "0",
            甘肃: "0",
            福建: "0",
            西藏: "0",
            贵州: "0",
            辽宁: "0",
            重庆: "0",
            陕西: "0",
            青海: "0",
            香港: "0",
            黑龙江: "0"
          }
          for (let i in provincesObj) {
            this.provincesData.push({
                name:i,
                value:0,
                proportion:0,
            })
          }
         let weight = {
           '0.01到0.5': "0.00",
           '0.5到1.0': "0.00",
           '1.0到2.0': "0.00",
           '2.0到3.0': "0.00",
           '3.0到4.0': "0.00",
           '4.0到5.0': "0.00",
           '5.0到6.0': "0.00",
           '6.0到7.0': "0.00",
           '7.0到8.0': "0.00",
           '8.0到9.0': "0.00",
           '9.0到10.0': "0.00",
           '10以上': "0.00",
         };
          this.weightObj = weight;
         for (let key in weight){
           this.weightData.push({
             name:key,
             value:0,
             proportion:0+'%',
             id:parseInt(key)===NaN?999:parseInt(key),
           })
         }
            this.monthData=[];

          this.getChart()
          setTimeout(()=>{
            this.kdDataLoading = false;
          },200)
          return false
        }else {
          this.getMonthInfo(arr.checkedKeys);
        }

      },
      getNowDate(date){
        let nowDate = date;
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth()+1;
        month = month<10? '0'+month:month;
        this.month = year+'-'+month;
      },
      handelChange(val){
        if(val==null||val==''){
          this.$message({
            type:'warning',
            message:'时间不能为空',
            duration:1000,
          })
          return
        }
        this.getNowDate(val)
        if (this.checkedKeysData.length===0){
          this.$message({
            type: 'warning',
            message: '请先在侧边栏选择客户',
            duration:500,
          });
          return false
        }
        this.getMonthInfo(this.checkedKeysData);

      },
      //play
      sorting(val){
        this.provincesData.sort((x,y)=>{
          if (val===1){
            return x.value-y.value
          } else {
            return y.value-x.value
          }
        })
      },

      //饼图
      getChart() {
        let _this = this;
        let myChart = echarts.init(_this.$refs.weightChart);
        let data = genData(50);
        let option = {
          title: {
            text: '本月重量区间分布',
            subtext: '数据分析  ',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          /*legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 200,
            top: 20,
            bottom: 20,
            data: data.legendData,
            selected: data.selected
          },*/

          series: [
            {
              name: '重量区间分布',
              type: 'pie',
              radius: '55%',
              center: ['45%', '50%'],
              data: data.seriesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(100, 0, 0, 0.5)'
                }
              }
            }
          ]
        };


        function genData(count) {
          let legendData = [];
          let seriesData = _this.weightData;
          let selected = _this.weightObj;
          _this.weightData.forEach(v=>{
            legendData.push(v.name)
          });
          for (let key in selected) {
            // if (selected[key]==='0.00') {
            //   selected[key] = false;
            // }else [
            //   selected[key] = true
            // ]
            selected[key] = true
          }

          seriesData.forEach(v=>{

          })


          return {
            legendData: legendData,
            seriesData: seriesData.slice(0,12),
            selected: selected
          };

        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
    },
    mounted() {
      this.getUserList();
      this.getNowDate(new Date());

    }
  };
</script>

<style scoped lang="less">


  .data-analysis-container {
    width: 100%;
    position: relative;
    .data-analysis-left {
      box-sizing: border-box;
      width: 320px;
      height: 890px;
      overflow-y: auto;
      overflow-x: hidden;

      padding: 10px 40px 20px 20px;
      background-color: #fff;
      position: absolute;
      left: 0;
      .data-analysis-left-title {
        span {
          height: 60px;
          /*font-weight: 700;*/
          color: black;
          line-height: 60px;
          letter-spacing: 1px;
          font-size: 14px;
          color: #1c2438;
          font-weight: 700;
        }
        border-bottom: 1px solid #eeeeee;
        margin-bottom: 30px;

      }

    }
    .data-analysis-right {
      margin-left: 325px;
      padding: 20px 0px 20px 0;
      box-sizing: border-box;
      min-height: 880px;
      background-color: #ffffff;
      box-shadow: -10px 0px 5px -5px #dddddd;
      font-size: 13px;
      .data-analysis-right-nav {
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 10px;
        padding-left: 20px;
      }
      .data-analysis-right-main{
        width: 100%;
        height: 800px;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
        padding-left: 30px;
      }
      .data-analysis-right-item {
        width: 100%;
        line-height: 40px;
        margin-bottom: 20px;
        .data-analysis-right-item-num {
          display: inline-block;
          width: 200px;
          letter-spacing: 1px;
        }
        .data-analysis-right-item-weight {
          display: inline-block;
          width: 200px;
          font-size: 13px;
          letter-spacing: 1px;
        }
        .accounted-weight {
          display: inline-block;
          width: 170px;
          height: 45px;
          border-radius: 10px;
          border: 1px solid #ededed;
          text-align: center;
          font-size: 20px;
          line-height: 45px;
          span {
            display: inline-block;
            width: 47%;
            height: 20px;
            text-align: center;
            line-height: 20px;
            i {
              color: #999999;
            }
          }
        }
        .accounted-weight span:nth-child(1) {
          border-right: 1px solid #999999;

        }
        .accounted-weight span:nth-child(2) {

        }
        .data-analysis-right-item-img {
          width: 100%;
          height: 420px;
          margin-left: 50px;
        }
      }

      .data-analysis-right-time {
        margin-top: 20px;
        margin-bottom: 40px;
      }
      .data-analysis-right-accounted {
        margin-top: 30px;
        .accounted-data {
          display: inline-block;
          width: 225px;
          height: 45px;
          line-height: 45px;
          border-radius: 10px;
          border: 1px solid #ededed;
          text-align: center;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
      }
      .data-right-weight {
        display: inline-block;
        p {
          width: 410px;
          height: 43px;
          border-radius: 10px;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          margin-top: 30px;
          text-align: center;
          line-height: 43px;
          margin-right: 30px;
          span {
            display: inline-block;
            width: 30%;

          }

        }
        .data-right-weight-item {
          margin-top: 10px;
        }

      }
      .data-analysis-right-city {
        margin-top: 10px;
        .city-accounted {
          display: inline-block;
          width: 420px;
          height: 420px;
          color: #495060;
          font-size: 12px;
          border:1px solid #ededed;
          background-color: #fff;
          box-sizing: border-box;
          .city-accounted-main {
            width: 100%;
            height: 340px;
            overflow-y: auto;
            overflow-x: hidden;
            .city-accounted-item {
              text-align: center;
              height: 50px;
              line-height: 50px;
              cursor: pointer;
              border-bottom: 1px solid #ededed;
            }
            .city-accounted-item:hover {
              background-color: #ebf7ff;
            }
          }

        }
        .city-accounted-item-title {
          padding-right: 20px;
          font-size: 14px;
          font-weight: 700;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background-color: #f5f7fa;
        }
      }
    }
  }
  .kd-data-ana{
    font-size: 13px;
  }
  .city-accounted-icon{
    position: relative;
    span{
      position: absolute;
      display: inline-block;
      top: 20px;
      i{
        display: block;
        font-size: 12px;
        cursor: pointer;
      }
      i:hover{
        color: #0094ff;
      }

    }
  }
  .kong{
    height: 100px;
    width: 100% ;
  }

</style>
