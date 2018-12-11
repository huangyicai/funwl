<template>
    <section  class="kd-notice-container">
      <el-radio-group v-model="tabPosition" style="margin-bottom: 10px;margin-left: 45%">
        <el-radio-button label="通知">通知</el-radio-button>
        <el-radio-button label="公告">公告</el-radio-button>
      </el-radio-group>


     <el-card  shadow="hover" v-if="tabPosition=='公告'" class="clearfix  kd-notice-content">
      <div slot="header" class="clearfix">
        <span class="kd-notice-title  el-icon-bell" >公告发布</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="dialogFormVisible=true" icon="el-icon-edit">发布公告</el-button>
      </div>
      <div  class="clearfix">
        <el-table
          v-loading="tableDataLoading"
          :data="tableData"
          border
          height="680px"
          style="width: 100%">
          <el-table-column
            fixed
            prop="createTime"
            label="日期"
            width="200">
          </el-table-column>
          <el-table-column
            prop="title"
            label="通知标题"
            width="200">
          </el-table-column>
          <el-table-column
            prop="content"
            label="通知内容"
            >

          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button type="danger" size="mini"  @click="del(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin: 20px 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
          class="fr"
          background="">
        </el-pagination>
      </div>
    </el-card>
      <el-card  shadow="hover" v-if="tabPosition=='通知'" class="clearfix  kd-notice-content">
        <div slot="header" class="clearfix">
          <span class="kd-notice-title  el-icon-bell" >公告发布</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="dialogFormVisibleNew=true" icon="el-icon-edit">发布通知</el-button>
        </div>

        <el-row :gutter="20" style="margin-top: 40px">
          <el-col :span="6" v-for="item in noticeVals"><div><el-card class="box-card" style="height:400px;margin-bottom: 20px;overflow-y:scroll">
            <div slot="header" class="clearfix">
              <span>{{item.title}}</span>
              <el-button style="float: right; padding: 3px 0;color: #F56C6C" type="text" @click="delMessage(item.id)">删除</el-button>
            </div>
            <div style="text-indent:25px">
              {{item.content}}
            </div>

            <hr style="margin-top: 100px">
            <span>通知客户（红：未读，绿：已读）</span>
            <hr>
            <el-tag style="margin-left: 3%;margin-top: 5px" v-for="ar in item.userMessageVo" type="success" v-if="ar.state==0">{{ar.name}}</el-tag>
            <el-tag style="margin-left: 3%;margin-top: 5px" v-for="ar in item.userMessageVo" type="danger" v-if="ar.state!=0">{{ar.name}}</el-tag>
          </el-card>
          </div>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog title="发布通知" :visible.sync="dialogFormVisibleNew">
        <el-form :model="ruleForm"  :rules="rules"  ref="ruleForm" >
          <el-form-item label="通知标题" :label-width="formLabelWidth"  prop="title">
            <el-input v-model="ruleForm.title" autocomplete="off" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="通知内容" :label-width="formLabelWidth"  prop="content">
            <el-input v-model="ruleForm.content" autocomplete="off"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <p style="font-weight: bold;font-size: 15px;">选择通知的客户</p><br>
        <el-tree
          style="z-index: 999 ;"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="selectedNode"
          show-checkbox
          @check="handleCheckChange"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span class="iconfont icon-iconset0450  kdPro-data-ana" v-if="data.platformId!==3">  &nbsp{{ node.label }}</span>
                  <span class="iconfont icon-addressbook_fill kdPro-data-ana" v-if="data.platformId===3">  &nbsp{{ node.label }}</span>
            </span>
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')" size="small">取 消</el-button>
          <el-button type="primary"  @click="saveMessage('ruleForm')" :loading="isloading" size="small">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="发布公告" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm"  :rules="rules"  ref="ruleForm" >
          <el-form-item label="通知标题" :label-width="formLabelWidth"  prop="title">
            <el-input v-model="ruleForm.title" autocomplete="off" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="通知内容" :label-width="formLabelWidth"  prop="content">
            <el-input v-model="ruleForm.content" autocomplete="off"
                      type="textarea"
                      :rows="7"
                      placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('ruleForm')" size="small">取 消</el-button>
          <el-button type="primary"  @click="submitForm('ruleForm')" :loading="isloading" size="small">确 定</el-button>
        </div>
      </el-dialog>

    </section>
</template>

<script>
  import $axios from '../../api/api'
  export default {

    data() {
      return {
        noticeVals:[],
        treeData: [],
        defaultProps: {
          children: 'sysUserInfos',
          label: 'name',
          value: 'id'
        },
        selectedNode:[],
        tabPosition:'公告',
        tableDataLoading:false,
        currentPage:1,
        pageSize:10,
        totalNum:0,
        tableData: [],
        dialogFormVisible:false,
        dialogFormVisibleNew:false,
        ruleForm:{},
        isloading:false,
        formLabelWidth:'80px',
        userIds:'',
        rules: {
          title: [
            {required: true, message: '通知标题不能为空哦！', trigger: 'change'}
          ],
         content: [
           {required: true, message: '通知内容不能为空哦！', trigger: 'change'}
    ],
        }


        }
    },
    methods:{
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
            }
          },
          fail: res => {
            console.log(res);
          }
        })
      },

      handleCheckChange(val, arr, b) {
        let str = []
        arr.checkedNodes.forEach(v=>{
          if(v.platformId!=-1){
            str.push(v.id)
          }
        })
        this.userIds=str.join();
        console.log(str.join());
      },
      saveMessage(formName){
        this.ruleForm.userId = this.userIds
        console.log(this.ruleForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isloading=true
            $axios.request({
              url:'/express/message/addMessage',
              method:'post',
              statu:2,
              _this:this,
              data:this.ruleForm,
              success:res=>{
                this.$message({
                  type: 'success',
                  message: '发布成功',
                  duration:500,
                });
                this.getMessage()
                this.resetForm(formName);
                this.isloading=false
              },
              fail:e=>{
                console.log(e)
                this.isloading=false
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      delMessage(id){
        $axios.request({
          url:'/express/message/deleteMessage/'+id,
          method:'delete',
          statu:1,
          _this:this,
          success:res=>{
            this.getMessage()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration:1000,
            });

          },
          fail:e=>{
            console.log(e)
          }
        })
      },
      getMessage(){
        $axios.request({
          url:'/express/message/getSendMessage',
          method:'get',
          statu:1,
          _this:this,
          success:res=>{
            console.log(res)
            this.noticeVals = res.data;
          },
          fail:e=>{
          }
        })
      },
  //getInfo
      getInfo(page,size){
        this.tableDataLoading = true;
        $axios.request({
          url:'/public/notice/list',
          method:'get',
          statu:1,
          _this:this,
          data:{
            page:page,
            size:size,

          },
          success:res=>{
            this.tableData = res.data.records;
            this.totalNum = res.data.total;
            this.tableDataLoading = false;

          },
          fail:e=>{
            this.tableDataLoading = false;
          }
        })
      },

//play
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val){
          this.pageSize = val;
        this.getInfo(this.currentPage,this.pageSize);

      },
      handleCurrentChange(val){
            this.currentPage = val;
        this.getInfo(this.currentPage,this.pageSize);

      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isloading=true
            $axios.request({
              url:'/public/notice',
              method:'post',
              statu:2,
              _this:this,
              data:this.ruleForm,
              success:res=>{
                this.$message({
                  type: 'success',
                  message: '发布成功',
                  duration:500,
                });
                this.getInfo(this.currentPage,this.pageSize)
                this.resetForm(formName);
                this.dialogFormVisible = false;
                this.isloading=false
              },
              fail:e=>{
                console.log(e)
                this.isloading=false
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
        this.dialogFormVisibleNew = false;
      },
      del(val){
        $axios.request({
          url:'/public/notice/'+val,
          method:'delete',
          statu:1,
          _this:this,
          success:res=>{
            this.$message({
              type: 'success',
              message: '删除成功',
              duration:500,
            });
            this.getInfo(this.currentPage,this.pageSize)
          },
          fail:e=>{
            console.log(e);
          }
        })
      },
    },
    mounted(){
      this.getUserList()
      this.getMessage();
      this.getInfo(this.currentPage,this.pageSize);
    }
  }
</script>


<style scoped>
  .kd-notice-title{
    font-size: 14px;
    font-weight: 700;
  }
  .kd-notice-container{
    width: 100%;

  }
  .kd-notice-content{
    left: 10px;
    width: 100%;
    height: 850px;
  }

</style>
