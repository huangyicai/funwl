<template>
  <section class="clearfix">
    <div class="kdPro-analysis-container">
      <div class="kdPro-analysis-left">
        <div class="kdPro-analysis-left-title">
          <span class="el-icon-tickets">用户列表</span>
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
                  <span class="iconfont icon-iconset0450  kdPro-data-ana" v-if="data.platformId!==3">  &nbsp{{ node.label }}</span>
                  <span class="iconfont icon-addressbook_fill kdPro-data-ana" v-if="data.platformId===3">  &nbsp{{ node.label }}</span>
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
        <div class="kdPro-analysis-right-all  clearfix"  v-loading="kdDataLoading"  >
          <div class="kdPro-analysis-right-time">
            <span class="el-icon-date"  style="font-size: 14px">  时间 : </span>
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
          <el-row>
            <el-col :span="3">
              <div  style="font-size: 14px;">
                <el-tag type="waring">￥应收:{{profitsData.totalOffer}}</el-tag>
                </div>
            </el-col>
            <el-col :span="3">
              <div  style="font-size: 14px">
                <el-tag type="success">￥实收:{{profitsData.totalPaid}}</el-tag>
              </div>
            </el-col>
            <el-col :span="3">

              <div  style="font-size: 14px">
                <el-tag type="danger">￥{{radio!='已完成'?'未结清':'差异'}}:{{(profitsData.totalOffer-profitsData.totalPaid).toFixed(2)}}</el-tag>
              </div>
            </el-col>
            <el-col :span="15">
              <div style="margin-top: 20px">
                <el-radio-group v-model="radio" size="small" @change="statusChange" >
                  <el-radio-button value="0" label="全部"></el-radio-button>
                  <el-radio-button value="2" label="待付款"></el-radio-button>
                  <el-radio-button value="3" label="待确认"></el-radio-button>
                  <el-radio-button value="5" label="部分付款"></el-radio-button>
                  <el-radio-button value="4" label="已完成"></el-radio-button>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%;margin-top: 10px">
            <el-table-column
              prop="name"
              label="账单名称"
              width="250">
            </el-table-column>

            <el-table-column
              prop="totalTime"
              label="账单时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="nameNick"
              label="客户账号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="personInCharge"
              label="联系人">
            </el-table-column>
            <el-table-column
              prop="telephone"
              label="联系号码">
            </el-table-column>
            <el-table-column
              prop="totalOffer"
              label="应收(￥)">
            </el-table-column>
            <el-table-column
              prop="totalPaid"
              label="实收(￥)">
            </el-table-column>
            <el-table-column
              label="凭证">
              <template slot-scope="scope">
                <a :href="item " v-if="scope.row.totalCredentialsUrl" v-for="(item,index) in scope.row.imgArr"
                   style="display:block;color: #3a8ee6" target="_blank">凭证{{index+1}}</a>
                <p v-if="!scope.row.totalCredentialsUrl">暂无凭证</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="totalState"
              label=状态>
              <template slot-scope="scope">
                <el-tag v-if="scope.row.totalState===2" type="danger" size="small">未付款</el-tag>
                <el-tag v-if="scope.row.totalState===3" type="waring" size="small">已付款</el-tag>
                <el-tag v-if="scope.row.totalState===4" type="success" size="small">已完成</el-tag>
                <el-tag v-if="scope.row.totalState===5" type="waring" size="small">未结清</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            border
            style="margin-top: 10px"
            class="fr"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
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
        radio:'全部',
        tabPosition: '收银管理',
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
        profitsData:{},
        tableData: [],
        currentPage:1,
        pageSize:10,
        totalNum:0,
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

            if (res.data.length>0){
              this.treeData = res.data;
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
        console.log(data);
      },
      getInfo(arr){
        let status = 0;
        switch (this.radio){
          case '全部':
            status = 0;
            break;
          case '待付款':
            status = 2;
            break;
          case '待确认':
            status = 3;
            break;
          case '已完成':
            status = 4;
            break;
          case '部分付款':
            status = 5;
            break;
        }
        $axios.request({
          url:'/express/total/list/'+status,
          method:'get',
          data:{
            page:this.currentPage,
            size:this.pageSize,
            date:this.month,
            endDate:this.monthEnd,
            userId:arr.join()
          },
          _this:this,
          statu:2,
          success:res=>{
            res.data.billDetails.records.forEach(v => {
              if (v.totalCredentialsUrl) {
                v.imgArr = v.totalCredentialsUrl.split('$$$')
              }
            });
            this.tableData = res.data.billDetails.records;
            this.totalNum = res.data.billDetails.total;
            this.profitsData =res.data.sum;
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
          this.profitsData=[];
          this.tableData = [];
          setTimeout(()=>{
            this.kdDataLoading = false;
          },200)
          return false
        }
        this.getInfo(this.checkedKeysData);
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
            type:'warning',
            message:'请先在侧边栏选择客户',
            duration:500,
          })
          return false
        }
        this.getInfo(this.checkedKeysData)
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
      getNowDate(date){

        let nowDate = date;
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth()+1;
        month = month<10? '0'+month:month;
        this.month = year+'-'+month;
      },
      getEndDate(date){
        let nowDate = date;
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth()+1;
        month = month<10? '0'+month:month;
        this.monthEnd = year+'-'+month;
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
      handleSizeChange(val){
        this.pageSize =val;
               this.getInfo( this.checkedKeysData)

      },
      handleCurrentChange(val){
        this.currentPage = val
                  this.getInfo( this.checkedKeysData)


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
              this.checkedKeysData = arr
              this.getInfo( this.checkedKeysData)
            }
          },
          fail: error => {

          }
        })
      },
      statusChange(val){
        this.getInfo(this.checkedKeysData);
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
      this.getTime();
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
          letter-spacing: 2px;
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
      background-color: #ffffff;
      box-shadow: -10px 0px 5px -5px #dddddd;
      font-size: 17px;
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
        height: 780px;
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
        box-sizing: border-box;
        padding: 0 50px;
        margin-top: 20px;
        width: 100%;
        height: 270px;
        .kdPro-analysis-right-header-item {
          display: inline-block;
          width: 49%;
          height: 75px;
          line-height: 70px;
        }
      }
      .kdPro-analysis-right-main {
        /*width: 90%;*/
        height: 130px;
        padding: 0 50px;
        margin-top: 20px;
        .kdPro-analysis-right-main-item {
          display: inline-block;
          width: 32%;
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
  .kong{
    height: 10px;
  }
</style>
