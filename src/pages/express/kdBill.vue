<template>
  <section class="kd-bill-container">
    <div class="kd-bill-top  clearfix">
    </div>
    <el-card class="kd-bill-left" v-if="retract">
      <div slot="header" class="clearfix">
        <span class="iconfont icon-users  kd-bill-search-title">客户列表</span>
        <el-button icon="el-icon-upload" type="primary"size="mini" style="float: right; padding: 5px"  @click="toUpload">上传总账单</el-button>
      </div>
      <el-input
        placeholder="输入客户名查询"
        v-model="filterText"
        prefix-icon="el-icon-search"
        style="width: 90%;margin-left: 5%;height: 30px"
      >
      </el-input>
      <br><br>
      <div>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :indent="indetNum"
          :highlight-current="true"
          node-key="id"
          :default-expanded-keys="arrUserList"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="tree2"
        >
                <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="iconfont icon-iconset0450  kd-bill-size" v-if="data.platformId!==3">  &nbsp{{ node.label }}</span>
                    <span class="iconfont icon-addressbook_fill kd-bill-size" v-if="data.platformId===3">  &nbsp{{ node.label }}</span>
        <span>

        </span>
      </span>

        </el-tree>
      </div>
    </el-card>
    <el-card :class="retract?'kd-bill-card':''">
      <div slot="header" class="clearfix">
        <el-button type="text" icon="el-icon-rank" style="font-size: 23px" class="transitionClass" @click="retract=!retract"></el-button>
        &nbsp;&nbsp;&nbsp;
        <span class="el-icon-document kd-bill-title">账单信息 <span class="kd-bill-title-span">
          &nbsp;{{customerName==''?'全部账单':customerName}}
          </span>
        </span>
        <el-upload
          class="fr"
          style="margin-left: 20px"
          :action="zjUploadSrc+userId+'/'+uploadTime"
          :headers="headers"
          :on-success="zjUploadSuccess"
          :before-upload="zjUploadBefore"
          :file-list="fileList">
          <el-button class="fr" type="primary" size="mini" :loading="zjBillLoading" icon="el-icon-upload"
                     v-if="customerName&&userId!=-1&&userId!=''">上传客户账单
          </el-button>
        </el-upload>

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
          height="715px"
          v-loading="kdBillLoading"
          :stripe="true"
          center
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          disable>
          </el-table-column>
          <el-table-column
            prop="date"
            label="批量操作"
            width="250">
            <template slot-scope="scope">
              <div class="kd-bill-type">
                <span class="kd-bill-type-order-no">{{scope.row.orderNo }}</span>
                <div class="kd-bill-type-box">
                </div>
                <p>账户名:
                  {{scope.row.payee}}
                </p>
                <p>收款机构:{{scope.row.typeName}}</p>
                <p>收款账号:{{scope.row.paymentAccount}}</p>
                <p v-if="scope.row.asOfTime">截止付款日期:{{scope.row.asOfTime}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="账单数据"
          >
            <template slot-scope="scope">
              <a :href="scope.row.totalUrl" style="display: inline-block">
                <img src="../../assets/images/excel.png" alt="" style="width:60px;height: 70px;margin: 0 auto;">
                <span style="font-size: 12px">(点击下载)</span>
                <p style="width:150px;font-size: 14px;margin-top: 5px;color: #3a8ee6;text-decoration: underline">
                  {{scope.row.name}}
                </p>
              </a>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="费用详情"
          >
            <template slot-scope="scope">
              <div class="kd-bill-type">
                <p>总单量:{{scope.row.totalNumber }}</p>
                <p>总重量:{{scope.row.totalWeight }}Kg</p>
                <p>平均重量:{{(scope.row.totalWeight/scope.row.totalNumber).toFixed(2)  }}Kg</p>
                <p v-if="scope.row.totalState!==-1">平均价格:{{(scope.row.totalOffer/scope.row.totalNumber).toFixed(2)  }}元/单</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="账单应付"
            width="180"
            align="left">
            <template slot-scope="scope">
              <div style="color: #67c23a" v-if="scope.row.state===4" class="kd-bill-type">
                <p>账单应付:￥{{scope.row.totalOffer }}</p>
                <p>账单实收:￥{{scope.row.totalPaid }}</p>
                <p>账单成本:￥{{scope.row.totalCost }}</p>
                <p>额外收款:￥{{scope.row.totalAdditional}}</p>
              </div>
              <div style="color: #f56c6c" v-else class="kd-bill-type">
                <el-tag size="mini" type='success'>账单应付:￥{{scope.row.totalOffer }}</el-tag>
                <el-tag size="mini" type='warning'>账单实收:￥{{scope.row.totalPaid }}</el-tag>
                <el-tag size="mini">账单成本:￥{{scope.row.totalCost }}</el-tag>
                <p style="font-size: 13px">额外收款:￥{{scope.row.totalAdditional}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="180"
            align="center"
            header-align="center">
            <template slot-scope="scope">
              <div>
                <el-button type="info" size="mini" :loading="kdBillLoading" plain
                           v-if="scope.row.totalState==-1&&userId!=-1" class="kd-bill-type-btn"
                           icon="el-icon-edit-outline" @click="doPrice(scope.row.totalId)">定价
                </el-button>

                <el-upload
                  v-if="scope.row.totalState<2&&userId!=-1"
                  :action="uploadSrc+scope.row.totalId"
                  :headers="headers"
                  :on-success="uploadSuccess"
                  :before-upload="uploadBefore"
                  :file-list="fileList">
                  <el-button type="warning" size="mini" :loading="kdBillLoading" plain class="kd-bill-type-btn"
                             icon="el-icon-upload2">替换
                  </el-button>
                </el-upload>
                <el-button type="primary" size="mini" :loading="kdBillLoading" plain
                           v-if="scope.row.totalState===1&&userId!=-1" class="kd-bill-type-btn  " icon="el-icon-share"
                           @click="sendBill(scope.row.totalId)">发送
                </el-button>
                <el-button type="success" size="mini" :loading="kdBillLoading" plain
                           v-if="(scope.row.totalState===3||scope.row.totalState===5)&&userId!=-1" class="kd-bill-type-btn"
                           @click="aaa(scope.row)">确认收款
                </el-button>
                <el-button type="warning" size="mini" :loading="kdBillLoading" plain
                           v-if="scope.row.totalState>=2&&scope.row.totalState!==4&&userId!=-1" class="kd-bill-type-btn"
                           @click="dialogSelfPriceBut(scope.row)">自我结款
                </el-button>
                <el-button type="success" size="mini" :loading="kdBillLoading" plain v-if="userId==-1"
                           class="kd-bill-type-btn " icon="el-icon-share" @click="sendBill(scope.row.totalId)">转发
                </el-button>
                <el-button type="danger" size="mini" :loading="kdBillLoading" plain class="kd-bill-type-btn "
                           icon="el-icon-delete" @click="delBill(scope.row.totalId)">删除
                </el-button>

              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="totalRemark"
            label="其他">
            <template slot-scope="scope">
              <span>账单状态:</span>
              <el-tag size="small" v-if="scope.row.totalState===-1">未定价</el-tag>
              <el-tag size="small" type="danger" v-if="scope.row.totalState===1">未发送</el-tag>
              <el-tag size="small" type="info" v-if="scope.row.totalState===2">待确认</el-tag>
              <el-tag size="small" type="warning" v-if="scope.row.totalState===3">对方已付款</el-tag>
              <el-tag size="small" type="success" v-if="scope.row.totalState===4">已完结收款</el-tag>
              <el-tag size="small" type="warning" v-if="scope.row.totalState===5">部分付款</el-tag>
              <p>账单备注:{{scope.row.totalRemark}}</p>

            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="付款凭证"
            align="center"
            header-align="center"
            center>
            <template slot-scope="scope">

              <el-carousel :autoplay="false" :interval="4000" type="card" height="130px" v-if="scope.row.totalCredentialsUrl">
                <el-carousel-item   v-for="(item,index) in scope.row.imgArr" :key="item" style="text-align: center;font-size: 9px">
                 凭证{{index+1}}<br>
                  <a :href="item " target="_blank">
                    <img :src="item" alt="" style="width: 110px;height: 130px">
                  </a>
                </el-carousel-item>
              </el-carousel>
              <p v-if="!scope.row.totalCredentialsUrl">暂无凭证</p>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          v-if="userId!=-1"
          size="mini"
          type="primary"
          class="fl"
          style="margin-top: 20px"
          icon="el-icon-printer"
          @click="sendAllBill"
        >发送
        </el-button>
        <el-button
          v-if="userId!=-1"
          size="mini"
          type="success"
          class="fl"
          style="margin-top: 20px"
          icon="el-icon-edit-outline"
          @click="sendAllBillPrice"
        >定价
        </el-button>

        <el-button
          v-else
          size="mini"
          type="success"
          class="fl"
          style="margin-top: 20px"
          icon="el-icon-share"
          @click="sendAllBill"
        >转发
        </el-button>
        <el-button
          size="mini"
          type="danger"
          class="fl"
          style="margin-top: 20px"
          icon="el-icon-delete"
          @click="delBillBatch"
        >删除
        </el-button>
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
      title="账单发送"
      :visible.sync="dialogVisibleReply"
      width="30%"
    >
      <el-form ref="replyFrom" :model="replyData" label-width="110px" :rules="replyRules">
        <el-form-item label="付款截止日期" prop="endDate">
          <el-date-picker
            @change = 'changeReplyDate'
            v-model="replyData.endDate"
            type="date"
            format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="额外金额" prop="totalAdditional">
          <el-input v-model="replyData.totalAdditional"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="textInfo">
          <el-input
            type="textarea"
            :rows="5"
            v-model="replyData.textInfo">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('replyFrom')" size="small">取 消</el-button>
    <el-button type="primary" @click="submitForm('replyFrom')" size="small" :loading="submitLoading">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="确认收款"
      :visible.sync="dialogPrice"
      width="30%"
    >
      <el-form ref="priceFrom" :model="priceData" label-width="80px" :rules="priceRules">
        <el-form-item label="收款金额" prop="priceNum">
          <el-input
            v-model.number="priceData.priceNum" @blur="priceBillInp">
          </el-input>
        </el-form-item>
      </el-form>
     <div style="margin-left: 10px;">
        是否结款：
        <el-radio v-model="priceIsFinish" label="1" border>已结清</el-radio>
        <el-radio v-model="priceIsFinish" label="2" border>未结清</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('priceFrom')" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('priceFrom')" size="small" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="自我结款"
      :visible.sync="dialogSelfPrice"
      width="30%"
      @close="clearVal('priceFrom')"
    >
      <el-form ref="priceFrom" :model="priceData" label-width="80px" :rules="priceRules">
        <el-form-item label="收款金额" prop="priceNum">
          <el-input
            v-model.number="priceData.priceNum" @blur="priceBillInp">
          </el-input>
        </el-form-item>
        <el-form-item label="附件凭证" >

          <el-upload
            ref="upload"
            list-type="picture-card"
            :action="uploadFinishSrc"
            :headers="headers"
            :on-success="uploadFinishSuccess"
            :on-remove="uploadRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="margin-left: 10px;">
        是否结款：
        <el-radio v-model="priceIsFinish" label="1" border>已结清</el-radio>
        <el-radio v-model="priceIsFinish" label="2" border>未结清</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('priceFrom')" size="small">取 消</el-button>
        <el-button type="primary" @click="submitSelfForm('priceFrom')" size="small" :loading="submitLoading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="转发账单"
      :visible.sync="dialogOther"
      width="30%"
    >
      <el-form ref="otherFrom" :model="otherFromData" label-width="80px" :rules="otherRules">
        <el-form-item label="转发至" prop="others">
          <el-select v-model="otherFromData.others" filterable placeholder="请选择">
            <el-option
              v-for="item in addCustomersOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('otherFrom')" size="small">取 消</el-button>
    <el-button type="primary" @click="submitForm('otherFrom')" size="small" :loading="submitLoading">确 定</el-button>
  </span>
    </el-dialog>

    <!--<el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="20%"
      center>
      <p style="text-align: center;font-size: 17px;">是否需要成本定价?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doPrice(1)">不需要</el-button>
        <el-button type="primary" @click="doPrice(2)">需要</el-button>
      </span>
    </el-dialog>-->
  </section>
</template>
<script>
  import {changeDate} from "../../assets/js/changeDate";
  import $axios from '../../api/api'
  import {baseSrc} from "../../api/api";

  export default {
    name: "bill",
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {
        retract:true,
        imgUploadSrc:[],
        //判断是否已经结清
        priceIsFinish:'2',
        filterText:'',
        centerDialogVisible: false,
        zjBillLoading: false,
        dialogVisible: false,
        tableData: [],
        searchForm: {},
        kdBillLoading: false,
        uploadTime: '',
        treeData: [],
        arrUserList:[],
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
        },
          {
            value: '-1',
            label: '未定价'
          },
          {
            value: '1',
            label: '未发送'
          },{
          value: '-10',
          label: '未完结'
        }, {
          value: '4',
          label: '已完结'
        }],
        killStatus: '0',
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
        userId: '',
        kdBillLoading: false,
        uploadSrc: baseSrc + '/express/total/againSet/',
        uploadFinishSrc:baseSrc+'/public/uploadFile',
        headers: {
          'Authorization': sessionStorage.getItem('funwlToken')
        },
        zjUploadSrc: baseSrc + '/express/total/additionalSet/',
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
        priceData: {},
        priceRules: {
          priceNum: [
            {required: true, message: '收款金额不能为空', trigger: 'change'},
            {type: 'number', message: '收款金额必须为数字值'}]
        },
        dialogPrice: false,
        dialogSelfPrice:false,
        priceId: '',
        billPrice:0,
        dialogOther: false,
        otherFromData: {
          others: '',
        },
        otherRules: {
          others:
            [
              {required: true, message: '请选择要转发的客户', trigger: 'change'}
            ]
        },
        addCustomersOptions: [],


      };
    },
    methods: {
      filterNode(value, data) {
        console.log(data)
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //账单发送时间验证
      changeReplyDate(){
        //选择的时间与当前时间做对比
        if(changeDate(this.replyData.endDate)<changeDate(new Date())){
          this.replyData={}
          this.$message({
            type: 'warning',
            message: '选择时间小于当前时间，重新选择！',
            duration: 2500,
          })
        }
      },
      getCustomersInfo() {
        $axios.request({
          url: '/express/pricingGroup/customers',
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.addCustomersOptions = res.data;
          },
          fail: error => {

          }
        })
      },
      getUserList() {
        $axios.request({
          url: '/express/cusmoters',
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.treeData = res.data;
            this.arrUserList.push(res.data[0].id)
            this.treeData.push({
              id: -1,
              name: '其他',
              platformId: 3
            })

          },
          fail: res => {
            console.log(res);
          }
        })
      },
      getBillList(page, size, date, statu, userId) {
        this.kdBillLoading = true;
        $axios.request({
          url: '/express/total/getBill',
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
            res.data.records.forEach(v => {
              if (v.totalCredentialsUrl) {
                v.imgArr = v.totalCredentialsUrl.split('$$$')
              }


            });

            if (res.data.records.length > 0) {
              res.data.records.forEach(v => {
                if (v.asOfTime) {
                  v.asOfTime = changeDate(v.asOfTime)
                }

              })
            }
            this.tableData = res.data.records;
            this.kdBillLoading = false;

          },
          fail: e => {
            this.kdBillLoading = false;

          }
        })
      },
      handleNodeClick(data) {
        this.id = data.id;
        console.log(data)

        if (data.platformId === 3) {
          this.platformId = 3;
          this.userId = data.id;
          this.uploadTime = ''
        } else {
          this.platformId = -1
          this.userId = '';
        }
        this.customerName = data.name;
        this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, data.id)
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
        this.$router.push('/kdBillsUpload')
      },
      //play
      getNowDate(date) {
        if(date==null||date==''){
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
        console.log(7777)
        console.log(val)

        this.getNowDate(val);
      },
      stateChange() {
        this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
      },
      uploadBefore() {
        this.kdBillLoading = true;
      },
      uploadSuccess(res) {
        this.kdBillLoading = false;
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '替换成功！',
            duration: 500,
          })
          this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
          this.fileList = [];
        } else {
          let str =''
          res.data.forEach(v=>{
            str+="<p  style='font-weight: bold;text-align: left;color: red;font-size: 15px;overflow: hidden;" +
              "text-overflow:ellipsis;" +
              "white-space: nowrap;'>"+ v+"<p>"
          })
          this.$alert("<div>"+str+"</div>", '表格错误', {
            dangerouslyUseHTMLString: true,
            type: 'warning',
            center: true
          });
        }
        this.fileList = [];
      },
      uploadRemove(file, fileList) {
        this.$refs.upload.clearFiles();
        this.imgUploadSrc=[]
        console.log(file, fileList);
      },
      //自我结款上传凭证
      uploadFinishSuccess(res, file, list) {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '上传成功！',
            duration: 500,
          })
          this.imgUploadSrc = list;
        } else {
          this.$message({
            type: 'error',
            message: '上传失败！',
            duration: 500,
          })
        }
      },
      doPrice(id) {
        let _this = this;
        _this.kdBillLoading = true;
        $axios.request({
          url: '/express/total/getPricing/' + id,
          method: 'get',
          statu: 2,
          success: res => {
            _this.kdBillLoading = false;
            _this.$message({
              type: 'success',
              message: '定价成功',
              duration: 500,
            })
            _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
          },
          fail: e => {
            _this.kdBillLoading = false;
          }
        })
        _this.centerDialogVisible = false
      },
      //定价
      /*pricing(id) {
        let _this = this;
        _this.centerDialogVisible = true
        _this.pricingId = id
        function doPrice(type, id) {
          _this.kdBillLoading = true;
          $axios.request({
            url: '/express/total/getPricing/' + id + '/' + type,
            method: 'get',
            statu: 2,
            success: res => {
              _this.kdBillLoading = false;
              _this.$message({
                type: 'success',
                message: '定价成功',
                duration: 500,
              })
              _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
            },
            fail: e => {
              _this.kdBillLoading = false;
            }
          })
        }

        _this.$confirm('', '是否需要成本定价?', {
          distinguishCancelAndClose: true,
          confirmButtonText: '要滴',
          cancelButtonText: '不需要',
          center: true,
          type: 'warning'
        }).then((res) => {
          /!*console.log(7777)
          console.log(res)*!/
           doPrice(2, id)
        }).catch((res) => {
          console.log(6666)
          console.log(res)
          /!*res === 'cancel'
            ? doPrice(1, id)
            : console.log(6666)*!/
          //doPrice(1, id)
        });

      },*/
      //发送dio
      submitForm(formName) {
        let _this = this;

        this.$refs[formName].validate((valid) => {
          if (valid) {
            function submitReplyFrom(formName) {
              $axios.request({
                url: '/express/total/sendAll',
                method: 'put',
                statu: 2,
                _this: _this,
                data: {
                  date: changeDate(_this.replyData.endDate),
                  totalId: _this.sendBillId,
                  totalAdditional: _this.replyData.totalAdditional,
                  totalRemark: _this.replyData.textInfo ? _this.replyData.textInfo : '',
                },
                success: res => {
                  _this.$message({
                    type: 'success',
                    message: '发送成功',
                    duration: 500,
                  })
                  _this.resetForm(formName);
                  _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
                },
                fail: e => {
                  console.log(e);
                }

              })
            };

            function submitPriceFrom(formName) {
              $axios.request({
                url: '/express/total/update/' + _this.priceId+'/'+_this.priceIsFinish,
                method: 'get',
                statu: 1,
                data: {
                  money: _this.priceData.priceNum,
                },
                _this: _this,
                success: res => {
                  _this.dialogPrice = false;
                  _this.resetForm(formName)
                  _this.$message({
                    type: 'success',
                    message: '操作成功',
                    duration: 500,
                  })
                  _this.getCollection()
                  _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
                },
                fail: () => {
                  this.submitLoading=false;
                }
              })
            };

            function submitOtherFrom(formName) {
              $axios.request({
                url: '/express/total/bill/forward/' + _this.otherFromData.others,
                method: 'get',
                _this: _this,
                statu: 1,
                data: {
                  billIds: _this.sendBillId,
                },
                success: () => {
                  _this.$message({
                    type: 'success',
                    message: '转发成功',
                    duration: 500,
                  })
                  _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
                  _this.resetForm(formName)
                },
                fail: () => {

                }
              })
            }

            switch (formName) {
              case 'replyFrom':
                submitReplyFrom(formName);
                break;
              case 'priceFrom':
                submitPriceFrom(formName);
                break;
              case 'otherFrom':
                submitOtherFrom(formName);

            }


          } else {
            console.log('error submit!!');
            return false;
          }

        });
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
              //this.$store.state.notifyClasses.push(notifyClass)
            }
          },
        })
      },
      submitSelfForm(formName){
        let _this = this
        this.$refs[formName].validate((valid) => {
            if (valid) {
              let arr = this.imgUploadSrc;
              let newArr = [];
              if (arr.length <= 0) {
                this.$message({
                  type: 'error',
                  message: '凭证未上传！',
                  duration: 1000,
                })
                return false;
              }
              arr.forEach(v => {
                newArr.push(v.response.data)
              })
              this.submitLoading = true;

              $axios.request({
                url: '/express/total/selfCollection/' + _this.priceId + '/' + _this.priceIsFinish,
                method: 'get',
                statu: 1,
                data: {
                  money: _this.priceData.priceNum,
                  totalCredentialsUrl: newArr.join('$$$')
                },
                _this: _this,
                success: res => {
                  _this.resetForm('priceFrom')
                  _this.$refs.upload.clearFiles();
                  _this.$message({
                    type: 'success',
                    message: '操作成功',
                    duration: 500,
                  })
                  _this.getCollection()
                  _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
                },
                fail: () => {

                }
              })
            }else{
              this.submitLoading=false;
            }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisibleReply = false
        this.dialogPrice = false;
        this.submitLoading=false;
        this.dialogSelfPrice=false;
        this.dialogOther = false;
        this.clearVal(formName);
        this.imgUploadSrc=[]
      },
      clearVal(val){
        if(val=='priceFrom'){
          this.$refs.upload.clearFiles();
        }
        this.priceData.priceNum = ''

      },
      sendBill(id) {
        this.sendBillId = id.toString();
        if (this.userId == -1) {
          this.getCustomersInfo();
          this.dialogOther = true;
        } else {
          this.dialogVisibleReply = true;
        }
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelectionArr = val;
        let arr = [];
        if (val.length > 0) {
          val.forEach(v => {
            arr.push(v.totalId)
          });
        }
        this.sendBillId = arr.join();

      },
      sendAllBillPrice(){
        let _this = this

        console.log(this.multipleSelectionArr)
        if (this.multipleSelectionArr.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择账单',
            duration: 1000,
          })
          return false;
        }
        let arr = []
        let all = 0;
        this.multipleSelectionArr.forEach(v=>{
          if(v.totalState==-1){
            arr.push(v.totalId)
          }else{
            all = 1;
          }
        })
        if(all==1){
          this.$message({
            type: 'error',
            message: '您选择的账单中有已定价账单或其他账单！',
            duration: 2000,
          })
          return
        }

        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        $axios.request({
          url: '/express/total/keyPricing',
          method: 'get',
          statu: 1,
          data: {totalId: arr.join()},
          _this: this,
          success: res => {
            let str=''
            res.data.forEach(val=>{
              if(val.code!==0){
                str += '<p style="color:#F56C6C">'+val.data.name+'账单--<span style="font-weight: bold;font-size:15px">('+val.info+')</span>'+'</p>'
              }
            })
            if(str==''){
              _this.$message({
                type: 'success',
                message: '定价成功',
                duration: 500,
              })
            }else{
              this.$confirm(str, '账单有误', {
                confirmButtonText: '确定',
                type: 'warning',
                showCancelButton:false,
                dangerouslyUseHTMLString: true,
                center: true
              })
            }
            _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
            loading.close();
          },
          fail: e => {
            console.log(e);
            loading.close();
          }
        })
      },
      sendAllBill() {
        if (this.multipleSelectionArr.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择账单',
            duration: 1500,
          })
          return false;
        }
        if (this.userId == -1) {
          this.getCustomersInfo();
          this.dialogOther = true;
        } else {
          this.dialogVisibleReply = true;
          let str = ''
          this.multipleSelectionArr.forEach(v=>{
              str = str + "," +v.totalId
          })
          this.sendBillId = str
        }

      },

      //确认收款
      aaa(val) {
        this.priceId = val.totalId;
        this.billPrice = val.totalOffer;
        this.dialogPrice = true;
      },
      //自我结款
      dialogSelfPriceBut(val){
        console.log(val)
        this.priceId = val.totalId;
        this.billPrice = val.totalOffer;
        this.dialogSelfPrice = true;
      },

      priceBillInp(){
        if(this.priceData.priceNum>this.billPrice){
          this.$confirm('输入金额已大于应付金额', '提示', {
            confirmButtonText: '确定',
            showCancelButton:false,
            type: 'warning'
          })
        }
      },
      delBillBatch(){
        this.delBill(this.sendBillId)
      },
      //删除
      delBill(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.request({
            url: '/express/total/deleteTotal/' + id,
            method: 'delete',
            statu: 1,
            _this: this,
            success: res => {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 500,
              });
              this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)

            },
            fail: e => {
              console.log(e);
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 500,

          });
        });
      },
      //追加
      zjUploadSuccess(res) {
        let _this = this;
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '上传成功',
            duration: 500,
          })
          _this.getBillList(_this.currentPage, _this.pageSize, _this.uploadTime, _this.killStatus, _this.userId)
        } else {
          let str =''
          res.data.forEach(v=>{
            str+="<p  style='font-weight: bold;text-align: left;color: red;font-size: 15px;overflow: hidden;" +
              "text-overflow:ellipsis;" +
              "white-space: nowrap;'>"+ v+"<p>"
          })
          this.$alert("<div>"+str+"</div>", '表格错误', {
            dangerouslyUseHTMLString: true,
            type: 'warning',
            center: true
          });
        }

        setTimeout(() => {
          this.fileList = [];
        }, 200)
        this.zjBillLoading = false;

      },
      zjUploadBefore() {
        if(this.uploadTime==''||this.uploadTime==null){
          this.$message({
            type: 'error',
            message: '请先选择时间',
            duration: 1000,
          })
          return false;
        }
        this.zjBillLoading = true;
      },

    },
    mounted() {
      this.getUserList();
      this.getBillList(this.currentPage, this.pageSize, this.uploadTime, this.killStatus, this.userId)
      //this.getNowDate(new Date());
    }
  }
</script>

<style scoped lang="less">
  .kd-bill-container {
    padding-top: 10px;
    position: relative;
  }

  .kd-bill-title {
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
  }
  .kd-bill-title-span {
    font-size: 16px;
    color: #1c2438;
    font-weight: 700;
  }

  .transitionClass {
    transition: All 0.4s ease-in-out;
    -webkit-transition: All 0.4s ease-in-out;
    -moz-transition: All 0.4s ease-in-out;
    -o-transition: All 0.4s ease-in-out;
  }

  .transitionClass:hover {
    transform: rotate(360deg) scale(1.4);
    -webkit-transform: rotate(360deg) scale(1.4);
    -moz-transform: rotate(360deg) scale(1.4);
    -o-transform: rotate(360deg) scale(1.4);
    -ms-transform: rotate(360deg) scale(1.4);

  }
  .kd-bill-card {
   margin-left: 305px;
  }

  .kd-bill-btn {
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

  .kd-bill-search-title {
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
  }
  .zIndex{
    z-index: -10;
  }
  .kd-bill-left {
    position: absolute;
    top: 10px;
    width: 300px;
    height: 880px;
    overflow-y: auto;
    overflow-x: hidden;

  }

  .kd-bill-size {
    font-size: 13px;
  }

  .kd-bill-type p {
    line-height: 23px;
    font-size: 14px;
    color: #606266;
  }

  .kd-bill-type-order-no {
    font-size: 19px;
    font-weight: 700;

  }

  .kd-bill-type-box {
    width: 10%;
    height: 1px;
    border: 2px solid #999;
    margin-bottom: 5px;
    margin-top: 2px;
  }

  .kd-bill-type-btn {
    margin-bottom: 5px;
    margin-left: 10px;
  }

</style>
