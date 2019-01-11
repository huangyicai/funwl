<template>
  <section class="k-bill-container">
    <el-card class="kh-bill-card">
      <div slot="header" class="clearfix">
        <span class="el-icon-document kh-bill-title">账单信息 </span>
        <el-date-picker
          class="fr"
          v-model="uploadTime"
          type="month"
          format="yyyy-MM"
          size="medium"
          placeholder="请选择时间"
          @change="changUploadTime">
        </el-date-picker>
        <el-select v-model="killStatus" placeholder="请选择账单状态" class="fr" size="medium" @change="stateChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <section class="clearfix">
        <el-table
          :data="tableData"
          style="width: 100%"
          height="675px"
          v-loading="khBillLoading"
          @selection-change="handleSelectionChange"

        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="date"
            label="类型"
            width="300">
            <template slot-scope="scope">
              <div class="kh-bill-type">
                <span class="kh-bill-type-order-no">{{scope.row.orderNo }}</span>
                <div class="kh-bill-type-box">
                </div>
                <p>账户名:{{scope.row.payee}}</p>
                <p>付款机构:{{scope.row.typeName}}</p>
                <p>付款账号:{{scope.row.paymentAccount}}</p>
                <p>截止日期:{{scope.row.asOfTimes}}</p>

              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            width="150"
            label="账单数据"
          >
            <template slot-scope="scope">
              <a :href="scope.row.totalUrl" style="display: inline-block">
                <img src="../../assets/images/excel.png" alt="" style="width:60px;height: 70px;margin: 0 auto;">
                <p style="font-size: 14px;margin-top: 5px;color: #3a8ee6;text-decoration: underline">
                  {{scope.row.name}}</p>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="费用详情"
            width="220">
            <template slot-scope="scope">
              <div class="kh-bill-type">
                <p>总单量:{{scope.row.totalNumber }}</p>
                <p>总重量:{{scope.row.totalWeight }}Kg</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="账单应付"
            width="220">
            <template slot-scope="scope">
              <div style="color: #67c23a" v-if="scope.row.state===4" class="kh-bill-type">
                <p>账单应付:￥{{scope.row.totalOffer }}</p>
                <p>账单实收:￥{{scope.row.totalPaid }}</p>
                <p>额外金额:￥{{scope.row.totalAdditional}}</p>
              </div>
              <div style="color: #f56c6c" v-else class="kh-bill-type">
                <p>账单应付:￥{{scope.row.totalOffer }}</p>
                <p>账单实收:￥{{scope.row.totalPaid }}</p>
                <p>额外金额:￥{{scope.row.totalAdditional}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="totalRemark"
            label="其他"
            width="220">
            <template slot-scope="scope">
              <span>账单状态:</span>
              <el-tag size="small" v-if="scope.row.totalState===-1">未定价</el-tag>
              <el-tag size="small" type="danger" v-if="scope.row.totalState===1">未发送</el-tag>
              <el-tag size="small" type="info" v-if="scope.row.totalState===2">待确认</el-tag>
              <el-tag size="small" type="warning" v-if="scope.row.totalState===3">已付款</el-tag>
              <el-tag size="small" type="success" v-if="scope.row.totalState===4">已完结</el-tag>
              <el-tag size="small" type="warning" v-if="scope.row.totalState===5">未结清</el-tag>
              <p style="margin-top:10px;color: #F56C6C;" v-if="scope.row.totalState==2||scope.row.totalState==5">到期还剩:{{scope.row.endTimes}}</p>
              <p>账单备注:{{scope.row.totalRemark}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="凭证">
            <template slot-scope="scope">
              <a :href="item " v-if="scope.row.totalState>=3" v-for="(item,index) in scope.row.imgArr"
                 style="display:block;color: #3a8ee6" target="_blank">查看凭证{{index+1}}</a>
              <p v-if="scope.row.totalState<3">暂无凭证</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalRemark"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <div>
                <el-button type="primary" size="mini" :loading="khBillLoading" plain v-if="scope.row.totalState===2||scope.row.totalState===3||scope.row.totalState===5"
                           class="kh-bill-type-btn" icon="el-icon-share" @click="sendBill(scope.row.totalId)">去付款
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fr"
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </section>
    </el-card>
    <el-dialog

      title="上传凭证"
      :visible.sync="dialogVisibleReply"
      width="30%"
    >
      <div class="kh-bill-upload">
        <el-upload
          ref='upload'
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :action="uploadSrc"
          :headers="headers"
          :on-success="uploadSuccess"
          :before-upload="uploadBefore"
          :file-list="fileList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <div class="kh-bill-upload-main">

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('replyFrom')" size="small">取 消</el-button>
    <el-button type="primary" @click="submitForm('replyFrom')" size="small" :loading="submitLoading">确 定</el-button>
  </span>
    </el-dialog>
  </section>
</template>
<script>
  import {changeDate} from "../../assets/js/changeDate";
  import $axios from '../../api/api'
  import {baseSrc} from "../../api/api";

  export default {
    name: "bill",
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        searchForm: {},
        khBillLoading: false,
        uploadTime: '',
        treeData: [],
        defaultProps: {
          children: 'sysUserInfos',
          label: 'name',
          value: 'id'
        },
        indetNum: 23,
        month: '',
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '-10',
          label: '未结清'
        } ,
          {
          value: '4',
          label: '已结清'
        }/*,
          , {
            value: '3',
            label: '已付款'
          },
          {
            value: '5',
            label: '未结清'
          }*/
        ],
        killStatus: '-10',
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        userId: '',
        khBillLoading: false,
        uploadSrc: baseSrc + '/public/uploadFile',
        headers: {
          'Authorization': sessionStorage.getItem('funwlToken')
        },
        fileList: [],
        customerName: '',
        sendBillId: '',
        dialogVisibleReply: false,
        replyData: {},
        replyRules: {
          endDate: [
            {required: true, message: '截止日期不能为空', trigger: 'change'}]
        },
        submitLoading: false,
        multipleSelectionArr: [],
        kdBillLoading: false,
        urlArr: [],

      };
    },
    methods: {
      getBillList(page, size, date, statu, userId) {
        this.khBillLoading = true;
        let _this = this;
        $axios.request({
          url: '/customer/total/getBill',
          method: 'post',
          statu: 2,
          _this: this,
          data: {
            current: page,
            size: size,
            date: date,
            state: statu,
            userId: userId,
          },
          success: res => {
            this.totalNum = res.data.total;
            this.tableData = res.data.records;
            let nowDate = new Date();
            let stepDate = 0;
            this.khBillLoading = false;
            if (res.data.records.length > 0) {
              res.data.records.forEach(v => {
                stepDate = v.asOfTime - nowDate.getTime();
                v.endTimes = stepDate>0?_this.dateTools(stepDate):'账单已到期';
                console.log(stepDate)
                v.asOfTimes = changeDate(v.asOfTime);
                if (v.totalCredentialsUrl) {
                  v.imgArr = v.totalCredentialsUrl.split('$$$')
                }
              })
            }
          },
          fail: e => {
            this.khBillLoading = false;

          }
        })
      },
      dateTools(date) {
        let day = parseInt(date / (1000 * 60 * 60 * 24));
        let tempa = date % (1000 * 60 * 60 * 24);
        let hours = parseInt(tempa / (3600 * 1000));
        let tempb = date % (1000 * 60 * 60);
        let min = parseInt(tempb / (60 * 1000));
        let tempc = date % (1000 * 60);
        let s = parseInt(tempc / 1000);
        day = day >= 10 ? day : '0' + day;
        hours = hours >= 10 ? hours : '0' + hours;
        min = min >= 10 ? min : '0' + min;
        s = s >= 10 ? s : '0' + s;
        return day + '天' + hours + '时' + min + '分' + s + '秒'


      },
      handleNodeClick(data) {
        this.id = data.id;
        if (data.platformId === 3) {
          this.platformId = 3;
          this.userId = data.id;
          this.customerName = data.name;
          this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)

        } else {
          this.platformId = -1
          this.userId = '';
        }
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
      },
      toUpload() {
        this.$router.push('/khBillsUpload')
      },
      //play
      getNowDate(date) {
        if(date==null||date==''||this.uploadTime==''){
          this.getBillList(this.currentPage, this.pageSize, '', this.killStatus, this.userId)
          return;
        }
        let nowDate = date;
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        this.uploadTime = year + '-' + month;
        this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
      },
      changUploadTime(val) {
        this.getNowDate(val);
      },
      stateChange(val) {
        this.getBillList(this.currentPage, this.pageSize, this.uploadTime, val, this.userId)
      },
      //upload price
      uploadBefore(file) {
        this.khBillLoading = true;
      },
      uploadSuccess(res, file, list) {
        this.khBillLoading = false;
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '上传成功！',
            duration: 500,
          })
          this.urlArr = list;
        } else {
          this.$message({
            type: 'error',
            message: '上传失败！',
            duration: 500,
          })
        }
      },
      handlePictureCardPreview() {
        console.log(this.fileList)
      },
      handleRemove(a, b, c) {
        this.urlArr = b;
      },
      //定价
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
                //let i = index + 1
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
      //发送dio
      submitForm() {
        let arr = this.urlArr;
        let newArr = [];
        if (arr.length <= 0) {
          this.$message({
            type: 'error',
            message: '上传失败！',
            duration: 500,
          })
          return false;
        }
        arr.forEach(v => {
          newArr.push(v.response.data)
        })
        this.submitLoading = true;
        $axios.request({
          url: '/customer/total/setCredentials',
          method: 'post',
          statu: 2,
          _this: this,
          data: {
            totalCredentialsUrl: newArr.join('$$$'),
            totalId: this.sendBillId,
          },
          success: res => {

            this.submitLoading = false;
            this.dialogVisibleReply = false;
            this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
            this.$refs.upload.clearFiles();
            this.noPayCollection()
          },
          fail: () => {
            this.submitLoading = false;
          }
        })


      },
      resetForm() {
        this.urlArr = [];
        this.fileList = [];
        this.dialogVisibleReply = false
      },
      sendBill(id) {
        this.sendBillId = id.toString();
        this.dialogVisibleReply = true;
      },
      handleSelectionChange(val) {
        this.multipleSelectionArr = val;
        let arr = [];
        if (val.length > 0) {
          val.forEach(v => {
            arr.push(v.totalId)
          });
        }
        this.sendBillId = arr.join();
        console.log(this.multipleSelection)

      },
      sendAllBill() {
        if (this.multipleSelectionArr.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择要发送的账单！',
            duration: 500,
          })
          return false;
        }
        this.dialogVisibleReply = true;

      },


    },
    created(){
    },
    mounted() {

      if(JSON.stringify(this.$route.params) ==="{}"){
        this.getNowDate(new Date());
      }else{
        console.log(this.uploadTime)
        console.log('-----------------')
        this.uploadTime = this.$route.params.time;
        console.log(this.uploadTime)
        this.killStatus = this.$route.params.status
        this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
      }
    }
  }
</script>

<style scoped lang="less">
  .kh-bill-container {
    padding-top: 10px;
    position: relative;
  }

  .kh-bill-title {
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
  }

  .kh-bill-card {

  }

  .kh-bill-btn {
    width: 80px;
    height: 30px;
    background-color: #62739E;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    text-align: center;
    line-height: 30px;
    color: #ffffff;
    font-size: 12px;
    cursor: pointer;
    margin-right: 10px;
    a {
      color: #ffffff;
    }
  }

  .kh-bill-search-title {
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
  }

  .kh-bill-left {
    position: absolute;
    top: 10px;
    width: 300px;
    min-height: 840px;

  }

  .kh-bill-size {
    font-size: 13px;
  }

  .kh-bill-type p {
    line-height: 23px;
    font-size: 14px;
    color: #606266;
  }

  .kh-bill-type-order-no {
    font-size: 19px;
    font-weight: 700;

  }

  .kh-bill-type-box {
    width: 10%;
    height: 1px;
    border: 2px solid #999;
    margin-bottom: 5px;
    margin-top: 2px;
  }

  .kh-bill-type-btn {
    margin-top: 10px;
  }


</style>
