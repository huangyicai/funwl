<template>
  <el-card class="fun-user-container">
    <div slot="header" class="clearfix">
      <span class="fun-user-title iconfont  icon-users">用户管理</span>
      <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-edit" @click="dialogFormVisible = true">
        注册用户
      </el-button>
    </div>
    <div class="fun-user-table  clearfix">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          >
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="公司名称"
          >
        </el-table-column>
        <el-table-column
          label="地址"
          >
          <template slot-scope="scope">
            <div>
              <p>
                {{scope.row.province+scope.row.city+scope.row.address}}
              </p>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column
          prop="city"
          label="城市"
          >
        </el-table-column>-->
        <el-table-column
          prop="createTime"
          label="注册日期"
          width="200">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          >
        </el-table-column>
        <el-table-column
          prop="personInCharge"
          label="负责人"
         >
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="联系电话"
          width="130">
        </el-table-column>
        <el-table-column
          label="客户使用情况"
          width="250"
        >
          <template slot-scope="scope">
            <p style="margin-top: 5px">最近登录时间：
              <el-tag size="small" type="danger">{{scope.row.loginTime}}</el-tag>
            </p>
            <p style="margin-top: 5px">注册商户数量：
              <el-tag size="small">{{scope.row.platformId}}家</el-tag>
            </p>
            <p style="margin-top: 5px">总账单数量&nbsp;&nbsp;&nbsp; ：
              <el-tag size="small" type="warning">{{scope.row.parentId}}个</el-tag>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="200">
          <template slot-scope='scope'>
            <el-switch
              @change="onSwitch(scope.row)"
              v-model="scope.row.status"
              active-text="正常"
              :active-value="1"
              inactive-text="冻结"
              :inactive-value="0"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClickDel(scope.row)" type="text" size="small">删除</el-button>
            <!--<el-button type="text" size="small" @click="handleClickEdit(scope.row)" >编辑</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fr fun-user-pageination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    <el-dialog title="注册" :visible.sync="dialogFormVisible">
      <div class="register">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="box" size="medium"
                 status-icon>
          <el-form-item label="快递类型" prop="resource">
            <el-radio-group v-model="ruleForm2.resource">
              <el-radio :label="item.id" v-for="item in expressData"  value="item.id">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="账号" prop="username" class="fn-user-form-item" >
            <el-input v-model="ruleForm2.username" placeholder="请输入账号"   prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName" class="fn-user-form-item">
            <el-input v-model="ruleForm2.companyName" placeholder="请输入用户公司名称"  prefix-icon="iconfont icon-users"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name"  class="fn-user-form-item">
            <el-input v-model="ruleForm2.name" placeholder="请输入昵称"  prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone" class="fn-user-form-item">
            <el-input v-model="ruleForm2.telephone" placeholder="请输入联系号码" class="wid" prefix-icon="el-icon-phone"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="personInCharge" class="fn-user-form-item">
            <el-input v-model="ruleForm2.personInCharge" placeholder="请输入用户公司负责人"  prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email" class="fn-user-form-item">
            <el-input v-model="ruleForm2.email" placeholder="请输入用户邮箱"  prefix-icon="el-icon-share"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password"  class="fn-user-form-item">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码"
                      class="wid" prefix-icon="iconfont icon-mima1"></el-input>
          </el-form-item>
          <el-form-item label="所在区域" prop="cityList"  class="fn-user-form-item">
            <div class="block">
              <el-cascader
                prefix-icon="el-icon-location-outline"
                size="medium"
                expand-trigger="hover"
                :options="options"
                v-model="ruleForm2.cityList"
                @active-item-change="handleItemChange"
                :props="props"
                @change="handleChange"
                class="city-width">
              </el-cascader>
            </div>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPass" class="fn-user-form-item">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入密码"
                      class="wid" prefix-icon="iconfont icon-mima1"></el-input>
          </el-form-item>

          <el-form-item label="详细地址" prop="address" class="fn-user-form-item">
            <el-input v-model="ruleForm2.address" placeholder="请输入详细地址" prefix-icon="el-icon-location"></el-input>
          </el-form-item>
          <el-form-item label="服务客服" class="fn-user-form-item">
            <el-select v-model="contactsValue" placeholder="请选择">
              <el-option :label="item.name" :value="item.id" v-for="item in contactsData"></el-option>
            </el-select>
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

<script>
  import city from '../../assets/city/city.js';
  import {isvalidPhone} from '../../assets/js/validate'
  import $axios from '../../api/api'

  export default {
    name: 'fn-user',
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

      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass!== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let validateChina = (rule,value,callback)=>{
        let pattern = /^[\u4E00-\u9FA5]{1,5}$/;
        if (value==''){
          callback(new Error('账号不能为空'));
        }else {
          callback();
        }
      };
      return {
        contactsValue:"",
        contactsData:[],
        tableLoading:false,
        ruleForm2: {
          password:'',
          checkPass:'',
        },
        expressData:[],
        rules2: {
          resource: [
            { required: true, message: '请选择快递类型', trigger: 'change' }
          ],
          username: [
            {required: true,validator: validateChina, trigger: 'change'},

          ],
          name: [
            {required: true, message: '昵称不能为空哦！', trigger: 'change'}
          ],
         /* email: [
              {required: true, message: '邮箱地址不能为空哦', trigger: 'blur'},
              {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
            ],*/
          companyName: [
            {required: true, message: '用户公司名称不能为空哦！', trigger: 'change'}
          ],
          personInCharge: [
            {required: true, message: '用户公司负责人不能为空哦！', trigger: 'change'}
          ],
          cityList: [
            {required: true, message: '请选择所在区域', trigger: 'change'}
          ],
          address: [
            {required: true, message: '详细地址不能为空哦！', trigger: 'change'},
          ],
          telephone: [
            {required: true, validator: validPhone, trigger: 'change'}
          ],
          password: [
            {required: true,validator: validatePass, trigger: 'change'}
          ],
          checkPass: [
            {required: true,validator: validatePass2, trigger: 'blur'}
          ],

        },
        options: [],
        props: {
          value: 'label',
          children: 'cities'
        },
        dialogFormVisible: false,
        tableData: [],
        form: {},
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
      }
    },
    methods: {
      getCity() {
        let smallObj = {};
        let bigObj = {};
        city.forEach(v=>{
          bigObj = {
            label:v.name,
            value:v.name,
            cities:[],
          };
          v.city.forEach(n=>{
            smallObj =
              {
                label:n.name,
                value:n.name,
                cities:[],
              }
            ;
              n.area.forEach(k=>{
                smallObj.cities.push({
                  label:k,
                  value:k,
                })
              })
            bigObj.cities.push(smallObj)
          })
         this.options.push(bigObj);
        });
      },
      handleItemChange(val) {
        // console.log('active item:', val);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getList()
      },
      handleChange(value) {
        console.log(value);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
      },
      submitForm(formName) {

        let _this = this;
        let list = this.ruleForm2;
        this.$refs[formName].validate((valid) => {
          if (valid) {
              console.log(this.ruleForm2)
            list.province = list.cityList[0];
            list.city = list.cityList[1];
            list.area = list.cityList[2];
              let params = {
                username:list.username,
                password:list.password,
                name:list.name,
                email:list.email,
                companyName:list.companyName,
                province:list.province,
                city:list.city,
                area:list.area,
                address:list.address,
                telephone:list.telephone,
                personInCharge:list.personInCharge,
                courierId:list.resource
              };
              console.log(_this.contactsValue+"***********************************************")
            $axios.request({
                url:'/fn/register/'+_this.contactsValue,
                method: 'post',
                _this:_this,
                statu:2,
                data:params,
                success:res=>{
                  this.dialogFormVisible = false;
                  _this.$message({
                    type: 'success',
                    duration:500,
                    message: '注册成功!'
                  });
                  _this.resetForm(formName);
                  _this.ruleForm2.password = '';
                  _this.getList();
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
      getList(){
        this.tableLoading = true;
        let pages = {
          page:this.currentPage,
          size:this.pageSize
        }
        $axios.request({
          url:'/fn/companys',
          method:'get',
          _this:this,
          data:pages,
          statu:2,
          success:res=>{
            console.log(res);
            this.tableData = res.data.records;
            this.tableLoading = false;
            this.totalNum = res.data.total;
          },
          fail:res=>{
            this.tableLoading = false;
          }
        })
      },
      handleClickDel(val){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.request({
            url:'/fn/user/'+val.id,
            method:'delete',
            statu:1,
            _this:this,
            success:res=>{
              this.getList();
              this.$message({
                type: 'success',
                duration:500,
                message: '删除成功!'
              });
            },
            fail:res=>{
              console.log(res);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            duration:500,
            message: '已取消删除'
          });
        })
      },
      handleClickEdit(val){
          // this.ruleForm2 = val;
          // this.dialogFormVisible = true;

      },
      onSwitch(val){
          $axios.request({
            url:'/fn/user/frozen/'+val.id,
            method:'post',
            statu:2,
            _this:this,
            success:res=>{
              this.getList();
            },
            fail:e=>{

            }

          })
      },
      getExpress(){
          $axios.request({
            url:'/fn/express/list',
            method:'get',
            _this:this,
            statu:1,
            success:res=>{
              console.log(res);
              this.expressData = res.data
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
            this.contactsData = res.data
            if(this.contactsData.length>0) this.contactsValue = res.data[0].id
          },
          fail:r=>{
            console.log(r)
          }
        })
      }
    },
    mounted() {
      this.getCity();
      this.getList();
      this.getExpress();
      this.getContacts();
    },

  }
</script>

<style scoped>
  .fun-user-container{
    min-height: 880px;
  }

  .fun-user-pageination {
    margin: 20px 20px 10px 20px;
  }
  .city-width{
    width: 100%;
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
