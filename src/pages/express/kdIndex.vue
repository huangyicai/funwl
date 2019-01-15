<template>
  <section class="kd-index-container" v-loading="kdDataLoading">
    <div class="kd-index-header">
          <el-card class="kd-index-header-card">
              <div class="kd-index-header-left-time ">
                <span class="el-icon-date kd-index-title">  时间 : </span>
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
              <div  class="kd-index-header-right">
                    <el-row>
                        <el-col :span="6">
                            <div  class="kd-index-header-card-item">
                                <el-row>
                                  <el-col :span="8">
                                      <div  class="kd-index-header-card-item-left "  style="background-color:rgb(45, 140, 240) ;">
                                          <i class="el-icon-time  kd-index-header-card-item-left-icon"></i>
                                      </div>
                                  </el-col>
                                  <el-col :span="16">
                                    <div  class="kd-index-header-card-item-right">
                                        <p  style="color:rgb(45, 140, 240)">{{monthData.totalNumber}}</p>
                                        <p>总单量</p>
                                    </div>
                                  </el-col>
                                </el-row>
                            </div>
                        </el-col>
                      <el-col :span="6">
                        <div  class="kd-index-header-card-item">
                          <el-row>
                            <el-col :span="8">
                              <div  class="kd-index-header-card-item-left " style="background-color:rgb(100, 213, 114) ;">
                                <i class="el-icon-bell  kd-index-header-card-item-left-icon"></i>
                              </div>
                            </el-col>
                            <el-col :span="16">
                              <div  class="kd-index-header-card-item-right">
                                <p  style="color:rgb(100, 213, 114)">{{monthData.dailyNum}}</p>
                                <p>每日单量</p>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div  class="kd-index-header-card-item">
                          <el-row>
                            <el-col :span="8">
                              <div  class="kd-index-header-card-item-left " style="background-color:rgb(255, 213, 114) ">
                                <i class="el-icon-share  kd-index-header-card-item-left-icon"></i>

                              </div>
                            </el-col>
                            <el-col :span="16">
                              <div  class="kd-index-header-card-item-right">
                                <p  style="color: rgb(255, 213, 114);">{{monthData.totalWeight}}</p>
                                <p>总重量（KG）</p>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div  class="kd-index-header-card-item" >
                          <el-row>
                            <el-col :span="8">
                              <div  class="kd-index-header-card-item-left"  style="background-color:rgb(242, 94, 67); ">

                                <i class="el-icon-view  kd-index-header-card-item-left-icon"></i>
                              </div>
                            </el-col>
                            <el-col :span="16">
                              <div  class="kd-index-header-card-item-right">
                                <p   style="color: rgb(242, 94, 67);"> {{monthData.averageWeight}}</p>
                                <p>平均重量(KG)</p>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                    </el-row>

              </div>
          </el-card>
        </div>
    <el-row>
      <el-col :span="16">
        <el-card  class="kd-index-card">
          <div slot="header" class="clearfix">
            <span class="iconfont icon-shuju3 kd-index-title">本月每日单量分布</span>
          </div>
          <div class="kd-index-footer"  ref="imgZz"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="kd-index-card">
          <div slot="header" class="clearfix">
            <span class="el-icon-share fl kd-index-title">本月重量区间分布</span>
          </div>
          <div style="width: 100%;height: 425px;font-size: 25px;font-weight: bold"  ref="weightChart"></div>
        </el-card>

      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8">
        <el-card  class="kd-index-header-card-notice">

          <div slot="header" class="clearfix">
            <div class="kd-index-header-right-title el-icon-bell kd-index-title">
              公告
            </div>
          </div>
          <div  class="kd-index-header-notice">
            <el-collapse v-model="activeName" accordion >
              <el-collapse-item  :name="item.id"  v-for="item in noticeData">
                <template slot="title">
                  {{item.title}}&nbsp;&nbsp;&nbsp;<el-tag type="danger"  v-if="item.status===1"  size="mini">系统通知</el-tag>
                  &nbsp;<i class="header-icon el-icon-time"></i>
                </template>
                <div>{{item.content}}</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="kd-index-card">
          <div slot="header" class="clearfix">
            <span class="el-icon-share fl kd-index-title">本月目的地单量分布</span>
          </div>
          <div class="kd-index-right-item kd-index-right-city clearfix">
            <div class="city-accounted  fl">
              <el-row class="city-accounted-item-title">
                <el-col :span="8">省份</el-col>
                <el-col :span="8">

                  <div class="city-accounted-item-cl">
                    单量
                    <span >
                              <i  class="el-icon-caret-top" @click="sorting(1)"></i>
                              <i  class="el-icon-caret-bottom"  style="margin-top: -5px"  @click="sorting(2)"></i>
                            </span>
                  </div>
                </el-col>
                <el-col :span="8">

                  <div class="city-accounted-item-cl">
                    比例
                    <span>
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
            <div class="city-china" style="height: 410px;width: 50%;position: absolute;top: 0;left:50%" ref="china" id="home_page_map"></div>
          </div>
        </el-card>
      </el-col>


  </el-row>


  </section>
</template>

<script>
  import echarts from 'echarts'
  import $axios from '../../api/api'
  export default {
    name: "index",
    data() {
      return {
        month: '2018-09',
        activeName: 19,
        monthData:{
          totalNumber:0,
          dailyNum:0,
          totalWeight:0,
          averageWeight:0

        },
        kdDataLoading:false,
        weightObj:{},
        weightData:[],
        provincesData:[],
        noticeData:[],
        //map
        //map
        geoCoordMap:{
          "北京市": [116.24,39.55],
          "上海市": [121.46,31.23],
          "天津市": [117.25,39.10],
          "重庆市": [106.54,29.55],
          "山西省": [112.52,37.83],
          "辽宁省": [123.41,41.79],
          "吉林省": [125.31,43.89],
          "黑龙江省": [126.629804, 45.774197],
          "浙江省": [120.15,30.26],
          "福建省":[119.18,26.05],
          "山东省": [117.0056,36.66],
          "河南省": [113.700339, 34.751827],
          "湖北省": [114.289984, 30.5942],
          "湖南省": [113.03042, 28.188898],
          "广东省":[113.14,23.08],
          "海南省": [110.17, 19.92],
          "四川省": [104.112035, 30.630737],
          "贵州省":[106.42,26.35 ],
          "云南省":[102.74,26.35 ],
          "江西省":[115.8999,28.6759 ],
          "陕西省":[108.94,34.26 ],
          "青海省":[101.78,36.60],
          "甘肃省":[103.51,36.04],
          "广西壮族自治区":[108.19,22.48 ],
          "新疆维吾尔自治区":[87.6061,43.79 ],
          "内蒙古":[111.66,40.82 ],
          "西藏自治区":[91.13,29.65 ],
          "宁夏回族自治区":[106.27,38.47 ],
          "安徽省": [117.321109, 31.850184],
          "广东省": [113.293215, 23.102603],
          "吉林省":[125.19,43.54]
        },
        mapDataList:[],
        everyDayNum:[],


      }
    },
    methods:{

      getMonthInfo(){
        this.kdDataLoading = true;
        $axios.request({
          url:'/express/total/getBillData',
          method:'post',
          _this:this,
          data:{
            date:this.month
          },
          statu:2,
          success:res=>{
            if (res.data) {
              this.monthData = res.data;
              this.getWeightInfo();
              this.getProvincesInfo();
            }
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
      getNowDate(date){
        let nowDate = date;
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth()+1;
        month = month<10? '0'+month:month;
        this.month = year+'-'+month;
      },
      getNotice(){
        $axios.request({
          url:'/public/notice',
          method:'get',
          statu:1,
          _this:this,
          success:res=>{
            this.noticeData = res.data.reverse();
            this.activeName = res.data[0].id;
          },
          fail:e=>{
            console.log(e);
          }
        })

      },
      getWeightInfo(){
        $axios.request({
          url:'/express/weightCalculate/getWeightCalculate',
          method:'post',
          _this:this,
          data:{
            date:this.month
          },
          statu:2,
          success:res=>{
            if (res.data){
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
              this.weightData = arr;

              this.getChartBt();

            }

          },
          fail:res=>{
            console.log(res)
          }
        })

      },
      sorting(val){
        this.provincesData.sort((x,y)=>{
          if (val===1){
            return x.value-y.value
          } else {
            return y.value-x.value
          }
        })
      },
      getProvincesInfo(){
        $axios.request({
          url:'/express/provinceCalculate/getProvinceCalculate',
          method:'post',
          _this:this,
          data:{
            date:this.month
          },
          statu:2,
          success:res=>{
            if (res.data){
              let arr = [];
              let num = 0;
              for (let i in res.data) {
                if (this.monthData.totalNumber==0){
                  num=0;
                } else {
                  num = ((res.data[i]*100)/(this.monthData.totalNumber*100)*100).toFixed(2);
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
              this.mapDataList = arr;
              this.createMap();
            }

          },
          fail:res=>{
            console.log(res)
          }
        })
      },
      handelChange(val){
        this.getNowDate(val)
        this.getMonthInfo();
        this.getEveryDayNum();

      },
      getEveryDayNum(){
          $axios.request({
            url:'/express/dailyTotal/getDailyTotalList',
            method:'post',
            statu:2,
            _this:this,
            data:{
              date:this.month,
            },
            success:res=>{
              this.everyDayNum = res.data;
              this.getChartZz();
            },
            fail:e=>{
              console.log(e);
            }
          })
      },
      //饼图
      getChartBt() {
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
          // legend: {
          //   type: 'scroll',
          //   orient: 'vertical',
          //   right: 10,
          //   top: 20,
          //   bottom: 20,
          //   data: data.legendData,
          //
          //   selected: data.selected
          // },
          series: [
            {
              name: '重量区间分布',
              type: 'pie',
              radius: '60%',
              center: ['50%', '60%'],
              data: data.seriesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label:{
                fontSize:16
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
            if (selected[key]==='0.00') {
              selected[key] = false;
            }else {
              selected[key] = true
            }


          }
          return {
            legendData: legendData,
            seriesData: seriesData,
            selected: selected
          };

        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      },
      getChartZz(){
        let _this = this;
        let myChart = echarts.init(_this.$refs.imgZz);
        let data = genData();
        let option = {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data:['单量']
          },
          xAxis: {
            data: data.legendData
          },
          yAxis: {},
          series: [{
            name: '日期',
            type: 'bar',
            data: data.seriesData
          }]
        };
        function genData() {
          let legendData = [];
          let seriesData = [];
          _this.everyDayNum.forEach(v=>{
            legendData.push(v.day)
            seriesData.push(v.num)
          });

          return {
            legendData: legendData,
            seriesData: seriesData,
          };

        }
        myChart.setOption(option);
      },
      createMap(){
        let _this = this;
        let myChart = echarts.init(this.$refs.china);
        const geoJson = require('./map-data/china.json');
        echarts.registerMap('zhongguo', geoJson);
        myChart.hideLoading();
        let geoCoordMap = this.geoCoordMap;
        let data = this.mapDataList;
        let max = 100000,
          min = 900; // todo
        let maxSize4Pin = 100,
          minSize4Pin = 20;
        let convertData = function(data) {
          let res = [];
          for (let i = 0; i < data.length; i++) {
            let geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              });
            }
          }
          return res;
        };
        let option = {
          title: {
            text: '本月目的地单量分布',
            subtext: '销售月单量',
            x: 'center',
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              if (typeof(params.value)[2] == "undefined") {
                return params.name + ' : ' + params.value;
              } else {
                return params.name + ' : ' + params.value[2];
              }
            }
          },
          legend: {
            orient: 'vertical',
            y: 'bottom',
            x: 'right',
            data: ['sell_area'],
            textStyle: {
              color: '#fff'
            }
          },
          visualMap: {
            show: false,
            min: 0,
            max: 500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [1],
            inRange: {
              // color: ['#3B5077', '#031525'] // 蓝黑
              // color: ['#ffc0cb', '#800080'] // 红紫
              // color: ['#3C3B3F', '#605C3C'] // 黑绿
              color: ['#0f0c29', '#302b63', '#24243e'] // 黑紫黑
              // color: ['#23074d', '#cc5333'] // 紫红
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#1488CC', '#2B32B2'] // 浅蓝
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#00467F', '#A5CC82'] // 蓝绿
              // color: ['#00467F', '#A5CC82'] // 蓝绿

            }
          },
          // toolbox: {
          //     show: true,
          //     orient: 'vertical',
          //     left: 'right',
          //     top: 'center',
          //     feature: {
          //             dataView: {readOnly: false},
          //             restore: {},
          //             saveAsImage: {}
          //             }
          // },
          geo: {
            show: false,//true 两只鸡
            map: 'zhongguo',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
              }
            },
            roam: true,//true
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077',
              },
              emphasis: {
                areaColor: '#2B91B7',
              }
            }
          },
          series: [{
            name: 'credit_pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: function(val) {
              return val[2] / 10000;
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: false //.treu
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#05C3F9'
              }
            }
          },
            {
              type: 'map',
              map: 'zhongguo',
              geoIndex: 1,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: true, // true存在legend时显示
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              roam: false,//true 移动 大小变换
              itemStyle: {
                normal: {
                  areaColor: '#031525',
                  borderColor: '#3B5077',
                },
                emphasis: {
                  areaColor: '#2B91B7'
                }
              },
              animation: true,
              data: data
            },
            {
              name: '点',
              type: 'scatter',
              coordinateSystem: 'geo',
              symbol: 'pin',
              symbolSize: function(val) {
                let a = (maxSize4Pin - minSize4Pin) / (max - min);
                let b = minSize4Pin - a * min;
                b = maxSize4Pin - a * max;
                return a * val[2] + b;
              },
              label: {
                normal: {
                  show: false,//true
                  textStyle: {
                    color: '#fff',
                    fontSize: 9,
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#0f0c29', //标志颜色
                }
              },
              zlevel: 6,
              data: convertData(data),
            },
            {
              name: 'Top 5',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: convertData(data.sort(function(a, b) {
                return b.value - a.value;
              }).slice(0, 5)),
              symbolSize: function(val) {
                return val[2] / 5000;
              },
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: true,
                }
              },
              itemStyle: {
                normal: {
                  color: '#05C3F9',
                  shadowBlur: 10,
                  shadowColor: '#05C3F9'
                }
              },
              zlevel: 1
            },

          ]
        };
        myChart.setOption(option);

      },
      getTime(){
        $axios.request({
          url:'/express/total/getTime',
          method:'get',
          _this:this,
          statu:1,
          success:res=>{
            this.month = res.data


            this.getMonthInfo();
            this.createMap();
            this.getEveryDayNum();
          },
          fail:res=>{
            console.log(res)
          }
        })
      }

    },
    mounted(){
      //this.getNowDate(new Date())
      this.getTime();
      this.getNotice();





    }
  }
</script>

<style scoped lang="less">
  .kd-index-header {
    width: 100%;
    margin-left: 5px;
    margin-right: 5px;
    .kd-index-header-card {
      height: 140px;
      box-sizing: border-box;
      margin-top:5px;
      position: relative;
      .kd-index-header-left-time{
        display: inline-block;
        width: 28%;
        position: absolute;
        left: 20px;
      }
      .kd-index-header-right{
        display: inline-block;
        width: 70%;
        margin-left: 28%;
        .kd-index-header-card-item{
          height: 100px;
          margin-left: 15px;
          border: 1px solid #ededed;
          .kd-index-header-card-item-left{

            width: 100%;
            height: 100px;
            text-align: center;
            line-height: 120px;
            color: #ffffff;
            .kd-index-header-card-item-left-icon{
              font-size: 40px;

            }
          }
            .kd-index-header-card-item-right{
            text-align: center;
            margin-top: 30px;
          }
          .kd-index-header-card-item-right p:nth-child(1){
            text-align: center;
            font-size: 30px;
            font-weight: 700;
          }
          .kd-index-header-card-item-right p:nth-child(2){
            font-size: 12px;
            font-weight: 500;
            color: #999;
            margin-top: 12px;
          }
        }
      }

    }


  }
  .kd-index-header-card-notice{
    margin-top:5px;
    margin-left: 5px;
    height: 530px;
    .kd-index-header-notice{
      width: 100%;
      height: 410px;
      font-size: 18px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }


  .kd-index-zx{
    width: 100%;
    height: 400px;
  }
  .kd-index-right-item {
    width: 100%;
    line-height: 40px;
    margin-bottom: 20px;
    margin-left: 10px;
    position: relative;
  }
  .kd-index-right-city {
    .city-accounted {
      display: inline-block;
      width: 420px;
      height: 420px;
      color: #495060;
      font-size: 15px;
      font-weight: bold;
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
  .kd-index-footer{
    width: 100%;
    height: 420px;
  }
  .kd-index-card{
    margin-left:5px;
    margin-top: 5px;
  }
  .kd-index-title{
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
  }
  .city-accounted-item-cl{
    position: relative;
    span{
      position: absolute;
      display: inline-block;
      top: 15px;
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
  .city-china{
    overflow-y: auto;
    overflow-x: auto;
  }


</style>
