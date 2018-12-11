<template>
    <section  class="kh-customer-container  clearfix" v-loading="customerLoading">
    <div class="kh-customer-left fl">
      <p  class="kh-customer-left-title el-icon-service">聊天/工单</p>
      <div class="kh-customer-left-form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="咨询类型" prop="typeId">
            <el-radio-group v-model="ruleForm.typeId">
              <el-radio :label="item.id"  v-for="item in errorTypeData">{{item.typeName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运单号" prop="waybillNumber">
            <el-input v-model="ruleForm.waybillNumber"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="ruleForm.contacts"></el-input>
          </el-form-item>
          <el-form-item label="商户名" prop="contacts">
            <el-select v-model="userKey" placeholder="请选择">
              <el-option
                v-for="item in userKeys"
                :key="item.id"
                :label="item.keyword"
                :value="item.keyword">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题描述" prop="content">
            <el-input type="textarea" v-model="ruleForm.content"  :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="附件上传" >

            <el-upload
              ref="upload"
              list-type="picture-card"
              :action="uploadSrc"
              :headers="headers"
              :on-success="uploadSuccess"
              :on-remove="uploadRemove">
              <i class="el-icon-plus"></i>
            </el-upload>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitLoading"  size="medium">提交工单</el-button>
            <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="kh-customer-right fl">
      <div  class="clearfix kh-customer-right-header">
        <p  class="kh-customer-right-title  fl  el-icon-service">以往问题</p>
        <el-button @click="resetButton" type="primary" size="medium" style="margin-top: -12px;margin-left: 10px" class="fr">重置</el-button>
        <el-select v-model="customerStatus" placeholder="请选择工单状态"  class="fr" size="small"  style="margin-top: -10px" @change="selectChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="errorTypeName" placeholder="请选择问题类型"  class="fr" size="small"  style="margin-top: -10px" @change="selectTypeChange">
          <el-option
            v-for="item in errorTypeData"
            :key="item.id"
            :label="item.typeName"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="waybillNumber" style="margin-top: -10px;width: 200px;margin-right: 10px" size="small"  placeholder="请输入运单号查询"  class="fr"  @change="waybillNumberChange"></el-input>

      </div>
      <div class="kh-customer-main">
        <!--<div  class="kh-customer-item"  v-for="item in customerData ">
          <p  class="kh-customer-item-title clearfix">运单号：{{item.waybillNumber}}&nbsp;
            <span class="fr"  style="margin-right: 10px">{{item.createTime}}</span>
          </p>
          <div  class="kh-customer-item-main">
                <p>类型：{{item.typeName}}</p>
                <p>状态：{{item.statusName}} </p>
                <p>联系人：{{item.contacts}}</p>
                <p>联系电话：{{item.phone}}</p>
                <p  v-if="item.imgUploadSrcList.length>0">
                  附件：<a :href="ind"  v-for="(ind,index) in item.imgUploadSrcList" target="_blank">&nbsp;&nbsp;<span style="color: #3a8ee6;text-decoration: underline" >查看({{index+1}})</span></a>
                </p>
                <p>问题描述：{{item.content}}</p>
                <p  v-if="item.remarks" style="color: #67c23a;">完结备注：{{item.remarks}}</p>
                <p v-if="item.handleName">处理人:{{item.handleName}}</p>
          </div>
          <div class="kh-customer-footer">
            <el-badge :value="item.replyNum" type="warning" v-if="item.status!=3">
            <el-button  size="mini" type="primary"   @click="chat(item.id,item.userId)">工单回复</el-button>
            </el-badge>
          </div>
        </div>-->

        <el-table
          :data="customerData"

          style="width: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="kd-customer-item-main">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="状态：">
                    <el-tag size="small" type="info" v-if="props.row.status===1">{{props.row.statusName}}</el-tag>
                    <el-tag size="small" type="warning" v-if="props.row.status===2">{{props.row.statusName}}</el-tag>
                    <el-tag size="small" type="success" v-if="props.row.status===3">{{props.row.statusName}}</el-tag>
                  </el-form-item>
                  <el-form-item label="类型：">
                    <span>{{ props.row.typeName }}</span>
                  </el-form-item>
                  <el-form-item label="联系人：">
                    <span>{{ props.row.contacts }}</span>
                  </el-form-item>
                  <el-form-item label="联系电话：">
                    <span>{{ props.row.phone }}</span>
                  </el-form-item>
                  <el-form-item label="附件：" v-if="props.row.imgUploadSrcList.length>0">
                    <a :href="ind" v-for="(ind,index) in props.row.imgUploadSrcList" target="_blank">&nbsp;&nbsp;<span
                      style="color: #3a8ee6;text-decoration: underline">查看({{index+1}})</span></a>
                  </el-form-item>
                  <el-form-item label="问题描述：">
                    <span>{{ props.row.content }}</span>
                  </el-form-item>
                  <el-form-item label="完结备注：" v-if="props.row.remarks">
                    <span  style="color: #67c23a;">{{ props.row.remarks }}</span>
                  </el-form-item>
                  <el-form-item label="处理人：">
                    <span>{{ props.row.handleName }}</span>
                  </el-form-item>
                </el-form>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="运单号"
            prop="waybillNumber">
          </el-table-column>
          <el-table-column
            width="120"
            label="问题类型"
          >
            <template slot-scope="scope">
              <el-tag size="small" type="danger" v-if="scope.row.typeId===1">{{scope.row.typeName}}</el-tag>
              <el-tag size="small" type="success" v-if="scope.row.typeId===2">{{scope.row.typeName}}</el-tag>
              <el-tag size="small" type="info" v-if="scope.row.typeId!==2&&scope.row.typeId!==1">{{scope.row.typeName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="商户名"
            prop="userKey">
          </el-table-column>
          <el-table-column
            label="状态"
            width="120">
            <template slot-scope="scope">
              <el-tag size="small" type="info" v-if="scope.row.status===1">{{scope.row.statusName}}</el-tag>
              <el-tag size="small" type="warning" v-if="scope.row.status===2">{{scope.row.statusName}}</el-tag>
              <el-tag size="small" type="success" v-if="scope.row.status===3">{{scope.row.statusName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="工单创建时间"
            width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-badge  :is-dot="scope.row.replyNum==0?false:true" style="margin-top: 5px" type="warning" v-if="scope.row.status>=2" >
                <el-button  size="mini" type="primary"   @click="chat(scope.row.id,scope.row.userId,scope.row.content)">
                  {{scope.row.status===2?'工单回复':'查看'}}
                </el-button>
              </el-badge>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <el-pagination
          background
          class="client-customer-pag"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>

    </div>
      <el-dialog
        title="工单回复"
        :visible.sync="dialogVisibleChat"
        width="700px"
      >

        <div class="kh-customer-service">
          <div class="kh-customer-service-main  clearfix" ref="main">
            <div   class="kh-customer-service-main-item clearfix">
              <img :src="imgLeft"  style="width: 40px;height: 40px" alt="" :class="imgClassRight" >
              <span :class="classRight">
                          问题描述：{{handleErrorVal}}
                    </span>
            </div>
            <div  v-for="item in chatData"  class="kh-customer-service-main-item clearfix">
              <img :src="item.userId===senderId?imgLeft:imgRight"  style="width: 40px;height: 40px" alt="" :class="item.userId!==senderId?imgClassLeft:imgClassRight" >
              <span :class="item.userId!==senderId?classLeft:classRight">
                          {{item.content}}
                    </span>
            </div>
          </div>
          <div class="kh-customer-service-footer">
            <el-input
              type="textarea"
              :rows="7"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
            <el-button type="primary" @click="chatEnd"  size="mini"  class="kh-customer-service-footer-btn">发送</el-button>
          </div>
        </div>
      </el-dialog>
  </section>
</template>

<script>
  import $axios from  '../../api/api'
  import {isvalidPhone} from '../../assets/js/validate'
  import {baseSrc} from "../../api/api";


  export default {
    name: "customerService",
    data(){
      let validPhone = (rule, value, callback) => {
        if (value == "") {
          callback(new Error('请输入手机号码'))
        } else {
          if (!isvalidPhone(value)) {
            callback(new Error('请输入正确的手机号码'))
          } else {
            callback()
          }
        }
      };
      return{
        handleErrorVal:'',
        //商户名
        userKey:'',
        userKeys:[],
        uploadSrc:baseSrc+'/public/uploadFile',
        ruleForm: {
          phone:sessionStorage.getItem('funwlTelephone'),
          contacts:sessionStorage.getItem('funwlPerson'),
          enclosure:this.imgUploadSrc,
        },
        rules: {
          waybillNumber: [
            { required: true, message: '运单号不能为空哦！', trigger: 'blur' },
          ],
          typeId: [
            { required: true, message: '请选择咨询类型哦！', trigger: 'change' }
          ],
          content: [
            { required: true, message: '问题描述不能为空哦！', trigger: 'blur' }
          ],
          phone:[
            {required: true, validator: validPhone, trigger: 'change'}


          ],
          contacts:[
            { required: true, message: '联系人不能为空哦！', trigger: 'blur' }
          ],
        },
        errorTypeData:[],
        fileList:[],
        headers:{
          'Authorization': sessionStorage.getItem('funwlToken')
        },
        imgUploadSrc:'',
        submitLoading:false,
        customerStatus:'',
        errorTypeName:'',
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '未处理'
        }, {
          value: '2',
          label: '处理中'
        }, {
          value: '3',
          label: '处理完毕'
        }],
        pageSize:30,
        currentPage:1,
        totalNum:0,
        customerData:[],
        waybillNumber:'',
        customerLoading:false,
        dialogVisibleChat:false,
        textarea:'',
        chatData:[],
        senderId:'',
        classLeft:'kh-customer-sercive-text  kh-customer-sercive-text-left  fl',
        classRight:'kh-customer-sercive-text  kh-customer-sercive-text-right  fr',
        imgClassLeft:'fl kh-customer-sercive-img-left ',
        imgClassRight:'fr',
        imgLeft:'https://funwl.oss-cn-hangzhou.aliyuncs.com/images/pgvfmyr3s7',
        // imgRight:'https://funwl.oss-cn-hangzhou.aliyuncs.com/images/l9mdx微信图片_20181022180840.jpg',
        imgRight:'https://funwl.oss-cn-hangzhou.aliyuncs.com/images/vrwl6cmsat',
      };
    },
    methods:{
      tableRowClassName({row, rowIndex}) {
        let back = {}
        if (row.typeId === 1) {
          back = {
            'background':'#F56C6C'
          }
        }
        else if (row.typeId === 3) {
          back = {
            'background':'#67C23A'
          }
        }
        return back;
      },
      uploadRemove(file, fileList) {
        this.$refs.upload.clearFiles();
        this.imgUploadSrc=''
        console.log(file, fileList);
      },
      //get
      getErrorType(){
        $axios.request({
          url:'/public/types',
          method:'get',
          _this:this,
          statu:1,
          success:res=>{
            console.log(res);
            this.errorTypeData=res.data;
            //this.errorTypeData.push({id:0,typeName:'全部'})
          },
          fail:error=>{
            console.log(error)
          }
        })
      },
      getCustomerInfo(page,size,errorId,id,waybillNumber){
        if(errorId==''){
          errorId=0
        }
        if(id==''){
          id=0
        }
        this.customerLoading = true;
          $axios.request({
            url:'/customer/service/list/'+id+'/'+errorId,
            method:'get',
            statu:1,
            data:{
              page:page,
              size:size,
              waybillNumber:waybillNumber,
            },
            _this:this,
            success:res=>{
              console.log(res);
              this.totalNum = res.data.total;
              if (res.data.records) {
                res.data.records.forEach(v=>{

                  v.imgUploadSrcList = v.enclosure.split(",")
                  if(v.imgUploadSrcList.length==1&&v.imgUploadSrcList[0]==""){
                    v.imgUploadSrcList=[]
                  }
                  switch (v.status) {
                    case 1:
                      v.statusName = '未处理'
                          break;
                    case 2:
                      v.statusName = '处理中'
                          break;
                    case 3:
                      v.statusName = '处理完毕'
                          break
                  }
                })
              };
              this.customerData = res.data.records;
              this.customerLoading = false;
            },
            fail:e=>{
              this.customerLoading = false;

            }
          })
      },
      uploadSuccess(res){
        let imgUploadSrcs = this.imgUploadSrc
        if (res.code===0){
          if(imgUploadSrcs){
            this.imgUploadSrc =imgUploadSrcs+","+res.data;
          }else {
            this.imgUploadSrc=res.data
          }
          this.fileList = [];
        } else{
          this.$message({
            type:'error',
            message:'上传失败！',
            duration:500,
          })
        }
      },
      submitForm(formName) {
        let param =this.ruleForm;
        param.enclosure = this.imgUploadSrc;
        param.userKey = this.userKey
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            $axios.request({
              url:'/customer/service',
              method:'post',
              statu:2,
              _this:this,
              data:param,
              success:res=>{
                this.$message({
                  type:'success',
                  message:'提交成功！',
                  duration:500,
                })
                this.customerData.imgUploadSrcList=[]
                this.imgUploadSrc=""
                this.resetForm(formName);
                this. ruleForm={
                  phone:sessionStorage.getItem('funwlTelephone'),
                  contacts:sessionStorage.getItem('funwlPerson'),
                  enclosure:this.imgUploadSrc,
                };
                this.submitLoading = false;
                this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)

              },
              fail:res=>{
                this.submitLoading = false;

              }
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs.upload.clearFiles();
        this.$refs[formName].resetFields();
        this.ruleForm={
          phone:sessionStorage.getItem('funwlTelephone'),
          contacts:sessionStorage.getItem('funwlPerson'),
          enclosure:this.imgUploadSrc,
        };
      },
      //分页
      handleSizeChange(val){
        this.pageSize = val;
        this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)
      },

      resetButton(){
        this.currentPage=1
        this.pageSize=30
        this.errorTypeName=''
        this.customerStatus=''
        this.waybillNumber=''
        this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)
      },
      //change
      waybillNumberChange(){
        this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)
      },
      selectChange(){
        this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)
      },
      selectTypeChange(){
        this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)
      },
      chat(id,sender,val){

        this.handleId = id;
        this.senderId = sender;
        this.dialogVisibleChat =  true;
        this.handleErrorVal= val
        this.getChatInfo(id);

      },
      getChatInfo(id){
        $axios.request({
          url:'/express/service/reply/'+id,
          method:'get',
          data:{
            page:1,
            size:1000000,
          },
          statu:1,
          _this:this,
          success:res=>{
            this.chatData = res.data.records;
            this.chatData.reverse();
            setTimeout(()=>{
              this.$refs.main.scrollTop = this.$refs.main.scrollHeight+40;
            },100)
            this.customerData.forEach(v=>{
              if(id==v.id){
                v.replyNum=0;
              }
            })
          },
          fail:e=>{
          }
        })
      },
      chatEnd(){
        if (this.textarea===''||this.textarea===null||this.textarea===undefined){
          this.$message({
            type:'warning',
            message:'回复内容不能为空！',
            duration:500,
          })

        } else {
          $axios.request({
            url:'/express/service/reply/'+this.handleId,
            method:'post',
            _this:this,
            statu:2,
            data:{
              content:this.textarea
            },
            success:res=>{
              this.getChatInfo(this.handleId);
              this.textarea = '';
              setTimeout(()=>{
                this.$refs.main.scrollTop = this.$refs.main.scrollHeight+40;
              },100)
              console.log(this.$refs.main.scrollHeight)
              console.log(this.$refs.main.scrollTop)
            },
            fail:()=>{

            }
          })
        }
      },
      getUserKey(){
        $axios.request({
          url:'/customer/service/userKeys',
          method:'get',
          _this:this,
          statu:1,
          success:res=>{
            this.userKeys = res.data;
            if(res.data.length>0) this.userKey = res.data[0].keyword
          },
          fail:()=>{

          }
        })
      },
    },

    mounted(){
      this.getErrorType();
      this.getUserKey();
      this.getCustomerInfo(this.currentPage,this.pageSize,this.errorTypeName,this.customerStatus,this.waybillNumber)
    }
  }
</script>

<style scoped lang="less">

  .demo-table-expand {
    font-size: 0;
    color: #99a9bf;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    color: #99a9bf;
  }
  .kh-customer-container{
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }
  .kh-customer-left, .kh-customer-right{
    box-sizing: border-box;
    background-color: #fff;
    height:850px;
    padding: 20px 10px 10px 20px;
    .kh-customer-footer{
      border-top: 1px solid #ededed;
      margin-top: 5px;
      text-align: center;
      box-sizing: border-box;
      padding-top: 5px;
    }
    .kh-customer-right-title{
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .kh-customer-item{
      margin-top: 20px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      box-shadow: 0 2px 12px 1px rgba(0,0,0,.2);
      padding: 0 0 5px 0;

      p{
        font-size: 13px;
        /*letter-spacing: 1px;*/
      }
    }
  }
  .kh-customer-left{
    width: 46%;

    .kh-customer-left-title{
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .kh-customer-left-form{
      padding: 10px 100px  10px 80px;
    }
  }
  .kh-customer-right{
    width: 53%;
    box-shadow: -10px 0 5px -5px #dddddd;
    .kh-customer-right-header{
      border-bottom: 1px solid #ededed;
      margin-bottom: 10px ;
    }
    .kh-customer-main{
      width: 100%;
      height: 740px;
      padding: 10px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
    }
    .client-customer-pag{
      position: absolute;
      bottom: 5px;
      right: 15px;
    }
    .kh-customer-item-title{
      background-color: #f5f7fa;
      height: 40px;
      line-height: 40px;
      font-weight: 700;
      padding-left: 10px;
    }
    .kh-customer-item-main{
      padding:  10px;
      line-height: 25px;
      letter-spacing: 1px;

    }
  }
  .kong{
    width: 100%;
    height: 30px;
  }
  .kh-customer-service{
    height: 550px;
    border: 1px solid #ededed;
    .kh-customer-service-main{
      height: 430px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      background-color: #f5f5f5;
      padding: 10px  20px  10px 20px;
      margin-top: -30px;
      .kh-customer-service-main-item{
        margin-top: 10px;
      }
      .kh-customer-sercive-text{
        display: inline-block;
        border: 1px solid #ededed;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        font-size: 13px;
        letter-spacing: 1px;
        line-height: 30px;
        padding: 3px 15px;
        max-width: 500px;
      }
      .kh-customer-sercive-text-left{
        background-color: #fff;
      }
      .kh-customer-sercive-text-right{
        background-color: #9eea6a;
        margin-right: 5px;
      }
    }
    .kh-customer-service-footer{
      height: 150px;
      position: relative;
      .kh-customer-service-footer-btn{
        position: absolute;
        bottom: 5px;
        right: 20px;
      }
    }
  }
  .kh-customer-sercive-img-left{
    margin-right:5px;
  }
</style>
