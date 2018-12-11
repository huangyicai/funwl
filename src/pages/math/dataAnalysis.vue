<template>
  <section>
    <el-row class="data-analysis-container">
      <el-col :span="4">
        <div class="data-analysis-left">
          <div class="data-analysis-left-title">
            <span class="el-icon-tickets">用户列表</span>
          </div>
          <div class="data-analysis-left-content">
            <el-tree
              :data="data"
              :props="defaultProps"
              accordion
              @node-click="handleNodeClick">
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="data-analysis-right">
          <el-row class="data-analysis-right-item data-analysis-right-time">
            <el-col :span="1">时间 : </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="month"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row class="data-analysis-right-item">
            <el-col :span="4">
              <span>总单量：131719</span>
            </el-col>
            <el-col :span="8">
              <span>每日单量：4249</span>
            </el-col>
          </el-row>
          <el-row class="data-analysis-right-item">
            <el-col :span="4">
              <span>总重量(kg)：94540</span>
            </el-col>
            <el-col :span="8">
              <span>平均重量(kg)：0.72</span>
            </el-col>
          </el-row>
          <el-row class="data-analysis-right-item">
            <el-col :span="2">
              重量占比：
            </el-col>
            <el-col :span="10">
              <div class="data-right-weight">
                <p  class="data-right-weight-item">
                  <span> 0.01-0.5kg</span>
                  <span> 55252</span>
                  <span>43.63%</span>
                </p>
                <p>
                  <span> 0.01-0.5kg</span>
                  <span> 55252</span>
                  <span>43.63%</span>
                </p>
                <p>
                  <span> 0.01-0.5kg</span>
                  <span> 55252</span>
                  <span>43.63%</span>
                </p>
              </div>
            </el-col>
          </el-row>
          <el-row class="data-analysis-right-item data-analysis-right-accounted">
            <el-col :span="2">
                <span>搜索占比</span>
            </el-col>
            <el-col :span="3">
                <div class="accounted-weight">
                    <span>4 <i>kg</i></span>
                  <span>5 <i>kg</i></span>
                </div>
            </el-col>
            <el-col :span="7">
                <span class="accounted-data">
                  803 0.6%
                </span>
            </el-col>
          </el-row>
          <el-row class="data-analysis-right-item data-analysis-right-city">
            <el-col :span="2">省份占比</el-col>
            <el-col :span="22">
                <div class="city-accounted">
                    <div class="city-accounted-item">
                          <p>省份</p>
                          <p>江苏省</p>
                          <p>山东省</p>
                          <p>上海市</p>
                          <p>四川省</p>
                          <p>北京市</p>
                    </div>
                  <div class="city-accounted-item">
                      <p>单量</p>
                      <p>12012</p>
                      <p>7443</p>
                      <p>6513</p>
                      <p>6418</p>
                      <p>5742</p>

                  </div>
                  <div class="city-accounted-item">
                      <p>比例</p>
                      <p>9.12%</p>
                      <p>5.65%</p>
                      <p>4.94%</p>
                      <p>4.67%</p>
                      <p>4.36%</p>

                  </div>
                </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        data: [

          {
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        month:'',
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    }
  };
</script>

<style scoped lang="less">
  .data-analysis-container {
    width: 100%;
    /*左边*/
    .data-analysis-left {
      box-sizing: border-box;
      width: 100%;
      min-height: 1000px;
      padding: 10px 40px 20px 20px;
      .data-analysis-left-title {
        span {
          font-size: 19px;
          height: 60px;
          font-weight: 700;
          color: black;
          line-height: 60px;
          letter-spacing: 2px;
        }
        border-bottom: 1px solid #000000;
        margin-bottom: 30px;

      }

    }
    /*右边*/
    .data-analysis-right {
      padding: 30px 40px 20px 70px;
      box-sizing: border-box;
      min-height: 1000px;
      width: 100%;
      background-color: #ffffff;
      box-shadow: -10px 0px 5px -5px #dddddd;
      font-size: 17px;
      color: black;
      .data-analysis-right-item{
        width: 100%;
        line-height: 40px;
        margin-bottom: 20px;
        .accounted-weight{
          display: inline-block;
          width: 170px;
          height: 45px;
          border-radius: 10px;
          border:1px solid #ededed;
          text-align: center;
          font-size: 20px;
          line-height: 45px;
          span{
            display: inline-block;
            width: 47%;
            height: 20px;
            text-align: center;
            line-height: 20px;

            i{
              color: #999999;
            }
          }
        }
        .accounted-weight span:nth-child(1){
          border-right: 1px solid #999999;

        }
        .accounted-weight span:nth-child(2){

        }
      }
      .data-analysis-right-time{
        margin-bottom: 40px;
      }
      .data-analysis-right-accounted{
        margin-top: 30px;
        .accounted-data{
          display: inline-block;
          width: 225px;
          height: 45px;
          line-height: 45px;
          border-radius: 10px;
          border:1px solid #ededed;
          text-align: center;
          box-shadow: 1px 1px 5px 5px #f2f2f2;
        }
      }
      .data-right-weight {
        p {
          width: 410px;
          height: 43px;
          border-radius: 10px;
          box-shadow: 1px 1px 5px 5px #f2f2f2;
          margin-top: 30px;
          text-align: center;
          line-height: 43px;
          span{
            display: inline-block;
            width: 30%;

          }

        }
        .data-right-weight-item{
          margin-top: 10px;
        }

      }
      .data-analysis-right-city{
        margin-top: 60px;
        .city-accounted{
          width: 100%;
          .city-accounted-item{
            display: inline-block;
            width: 133px;
            height: 360px;
            box-shadow: 1px 1px 5px 5px #f2f2f2;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            margin-right: 68px;
            p{
              text-align: center;
              line-height: 50px;

            }


          }
          .city-accounted-item p:nth-child(1){
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
            margin-top: 10px;
          }
        }
      }
    }
  }

</style>
