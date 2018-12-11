<template>
  <el-card class="fun-user-container">
    <div slot="header" class="clearfix">
      <span class="fun-user-title iconfont  icon-users">客服管理</span>
      <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-edit" @click="dialogFormVisible = true">
        添加客服
      </el-button>
    </div>
      <template>
        <el-table
          :data="tableData"
          border
          stripe
          size="small"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="联系方式">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

    <el-dialog title="注册" :visible.sync="dialogFormVisible">
      <div class="register">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="box" size="medium"
                 status-icon>
          <el-form-item label="姓名" prop="name" class="fn-user-form-item">
            <el-input v-model="ruleForm2.name" placeholder="请输入姓名"   prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone" class="fn-user-form-item">
            <el-input v-model="ruleForm2.phone" placeholder="请输入联系方式"  prefix-icon="iconfont icon-users"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm2')"  size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')"   size="small">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script type="text/ecmascript-6">
  import $axios from '../../api/api'
  import {isvalidPhone} from '../../assets/js/validate'
    name: ""
    export default {
        data() {
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
            return {
              ruleForm2: {
                name:'',
                phone:'',
              },
              rules2: {
                phone: [
                  {required: true,validator: validPhone, trigger: 'change'},
                ],
                name: [
                  {required: true, message: '姓名不能为空哦！', trigger: 'change'}
                ]
              },
              dialogFormVisible:false,
              tableData:[]
            }
        },
      methods:{
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.dialogFormVisible = false;
        },
        submitForm(formName) {
          let _this = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let params = {
                name:this.ruleForm2.name,
                phone:this.ruleForm2.phone

              };
              $axios.request({
                url:'/fn/contacts/service',
                method: 'post',
                _this:_this,
                statu:2,
                data:params,
                success:res=>{
                  this.dialogFormVisible = false;
                  _this.$message({
                    type: 'success',
                    duration:100,
                    message: '注册成功!'
                  });
                  this.getContacts();
                  _this.resetForm(formName);

                },
                fail:error=>{
                  console.log(error)
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
          //删除客服
        handleDelete(id){
          $axios.request({
            url:'/fn/contacts/'+id,
            method:'delete',
            _this:this,
            statu:1,
            success:res=>{
              if(res.code==0){
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getContacts();
              }else{
                this.$message.error('恭喜你，这是一条成功消息');
              }

            },
            fail:r=>{
              console.log(r)
            }
          })
        },
        //获取弗恩所有客服
        getContacts(){
          $axios.request({
            url:'/fn/contacts',
            method:'get',
            _this:this,
            statu:1,
            success:res=>{
              console.log(res);
              this.tableData = res.data
            },
            fail:r=>{
              console.log(r)
            }
          })
        }
      },
      mounted() {
        this.getContacts();
      },
    }
</script>
<style scoped>
  .fun-user-container{
    min-height: 880px;
  }
  .fn-user-form-item{
    display: inline-block;
    width: 49%;
  }
  .fun-user-title{
    font-size: 14px;
    font-weight: 700;
  }
</style>
