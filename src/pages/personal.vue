<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <span class="personal-header-title">个人中心</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="dialogFormVisible=true"
                   v-if="userStatus!==0">注册
        </el-button>
      </div>
      <div class="personal-top">
        <el-row>
          <el-col :span="10">
            <div class="personal-top-left">
              <p > <i class="el-icon-document"></i>&nbsp;公司名称：{{userInfoData.companyName}}</p>
              <p ><i class="el-icon-location-outline"></i> &nbsp;公司地址：{{userInfoData.address}}</p>
              <p ><i class="el-icon-location-outline"></i> &nbsp;所在省市区：{{userInfoData.province}}{{userInfoData.city}}{{userInfoData.area}}</p>
              <p ><i class="el-icon-phone-outline"></i> &nbsp;联系号码：{{userInfoData.telephone}}</p>
              <p ><i class="el-icon-message"></i> &nbsp;邮箱：{{userInfoData.email}}</p>
              <p ><i class="el-icon-star-off"></i> &nbsp;用户名：{{userInfoData.name}}</p>
              <p ><i class="iconfont icon-ren"></i> &nbsp;账号：{{userData.username}}</p>
              <p ><i class="iconfont icon-mima1"></i> &nbsp;密码：{{userData.password}} &nbsp;<el-button type="text" size="small"
                                                                                              @click="changePsd"
                                                                                              v-if="!changePassword">
                修改密码
              </el-button>
              </p>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="personal-top-left" style="margin-left: 10px" v-if="userStatus!==0">
              <el-table
                :data="accountData"
                style="width: 100%"
                height="250">
                <el-table-column
                  fixed
                  prop="name"
                  label="用户名"
                  >
                </el-table-column>
                <el-table-column
                  prop="companyName"
                  label="账号"
                 >
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
                  prop="accountStatus"
                  label="账号类型"
                  >
                  <template slot-scope="scope">
                      <el-tag type="success"  v-if="scope.row.accountStatus===1">运营号</el-tag>
                    <el-tag type="warning"  v-if="scope.row.accountStatus===2">客服号</el-tag>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="caozuo"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button   type="danger"  size="mini" :loading="kdBillLoading"  plain   class="kd-bill-type-btn "  icon="el-icon-delete" @click="delExpress(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>

            </div>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        title="修改密码"
        :visible.sync="changePassword"
        width="450px"
      >
        <el-form :model="csRuleForm" :rules="csRules" ref="csRuleForm" label-width="80px" size="medium"
                 status-icon v-if="changePassword">
          <el-form-item label="新密码" prop="pass" class="personal-form-item">
            <el-input type="password" v-model="csRuleForm.password" auto-complete="off" placeholder="请输入密码"
                      prefix-icon="iconfont icon-mima1"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" class="personal-form-item">
            <el-input type="password" v-model="csRuleForm.checkPass" auto-complete="off" placeholder="请再次输入密码"
                      prefix-icon="iconfont icon-mima1"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" class="personal-form-item clearfix">
            <el-input v-model="csRuleForm.code" placeholder="请输入验证码" prefix-icon="iconfont icon-ren" class="fl"
                      style="width: 55%"></el-input>
            <el-button type="primary" size="small" class="" style="margin-top: 3px;margin-left: 23px"
                       @click="submitCode"
                       :loading="submitCodeLoading" :disabled="codeDisable">{{submitCodeText}}
            </el-button>

          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
    <el-button @click="changePassword = false" size="small">取 消</el-button>
    <el-button type="primary" @click="csSubmitForm('csRuleForm')" size="small">确 定</el-button>
  </span>
      </el-dialog>


    </el-card>
    <el-card  class="personal-main" v-if="userStatus!==0">
      <div slot="header" class="clearfix">
        <span class="personal-header-title">添加成本定价组</span>
        <el-tooltip content="自动计算成本" placement="top" class="fr">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="openAndOff"
            active-text="开启"
            inactive-text="关闭"
            @change="openAndOffChange"
          >
          </el-switch>
        </el-tooltip>
        <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="item.provinceName" :name="item.id.toString()" v-for="item in cityPriceData">
            <span slot="label" v-if="item.status" style="color: #00a0f0"><i class="el-icon-success"></i> {{item.provinceName}}</span>
            <div  v-loading="priceLoading">
              <div class="personal-collapse-select clearfix" >
                <el-select v-model="historyData" clearable placeholder="请选择相同省份定价组"  class="fr" v-if="replaceStatus===true" style="margin-bottom: 10px;margin-right: 20px;"  @change="historyCityChange">
                  <el-option
                    v-for="item in historyOptions"
                    :key="item.provinceName"
                    :label="item.provinceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="personal-collapse-content clearfix ">
                <div class="personal-collapse fl" style="width: 39%">
                  <div class="personal-collapse-title  clearfix" >区间定价组
                    <el-button type="primary" size="mini"  class="fr"  style="margin-top: 10px;margin-right: 10px"  v-if="replaceStatus===true" @click="addPriceList(1)">添加</el-button>
                  </div>
                  <el-table :data="firstTableData" style="width: 100%">
                    <el-table-column prop="name" label="重量区间(KG)" >
                      <template slot-scope="scope"  >
                        <span v-if="replaceStatus===false">{{scope.row.areaBegin}}-{{scope.row.areaEnd}}</span>
                        <div  v-if="replaceStatus===true" class="clearfix">
                          <p class="fl"  style="width: 50px;height: 32px;line-height: 32px"  size="small">{{scope.row.areaBegin}}</p>
                          <p class="fl" style="width: 50px;height: 32px;line-height: 32px">-</p>
                          <el-input v-model="scope.row.areaEnd" class="fl weight-input-width-first  "    size="small" @change="cityEndChange(scope.$index,scope.row.areaEnd,scope.row.areaBegin)"></el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" label="金额(元)" width="100">
                      <template slot-scope="scope"  >
                        <span v-if="replaceStatus===false">{{scope.row.price}}</span>
                        <el-input v-model="scope.row.price" v-if="replaceStatus===true" size="small" class="weight-input-width"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="replaceStatus" width="100">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="danger"
                          @click="priceDel(scope.$index,1,scope.row)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="personal-collapse fl" style="width: 59%">
                  <div class="personal-collapse-title  clearfix" >首重+续重-区间定价组（末区间峰值“~”默认为无穷）
                    <el-button type="primary" size="mini"  class="fr"  style="margin-top: 10px;margin-right: 10px"   v-if="replaceStatus===true&&firstTableData.length>0"  @click="addPriceList(2)">添加</el-button>
                  </div>
                  <el-table :data="thenTableData" style="width: 100%">
                    <el-table-column prop="name" label="重量区间(KG)" width="200">
                      <template slot-scope="scope" >
                        <span v-if="replaceStatus===false">{{scope.row.areaBegin}}-{{scope.row.areaEnd===1000000?"~":scope.row.areaEnd}}</span>
                        <div  v-if="replaceStatus===true" class="clearfix">
                          <p class="fl"  style="width: 50px;height: 32px;line-height: 32px"  size="small">{{scope.row.areaBegin}}</p>
                          <p class="fl" style="width: 50px;height: 32px;line-height: 32px">-</p>
                          <el-input v-model="scope.row.areaEnd===1000000?'~' :scope.row.areaEnd" class="fl  weight-input-width-first"    size="small" @change="continueChange(scope.$index,scope.row.areaEnd,scope.row.areaBegin)"></el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="firstWeight" label="首重(KG)">
                      <template slot-scope="scope"  >
                        <span v-if="replaceStatus===false">{{scope.row.firstWeight}}</span>
                        <el-input v-model="scope.row.firstWeight" v-if="replaceStatus===true"  class="weight-input-width"  size="small"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="firstWeightPrice" label="首重金额(元)">
                      <template slot-scope="scope"  >
                        <span v-if="replaceStatus===false">{{scope.row.firstWeightPrice}}</span>
                        <el-input v-model="scope.row.firstWeightPrice" v-if="replaceStatus===true"  class="weight-input-width"  size="small"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="weightStandard" label="续重进制单位(KG)" >
                      <template slot-scope="scope" >
                        <span v-if="replaceStatus===false">{{scope.row.weightStandard}}</span>
                        <el-input v-model="scope.row.weightStandard" v-if="replaceStatus===true"  class="weight-input-width"  size="small"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="续重进制金额(元)">
                      <template slot-scope="scope"  >
                        <span v-if="replaceStatus===false">{{scope.row.price}}</span>
                        <el-input v-model="scope.row.price" v-if="replaceStatus===true"  class="weight-input-width"  size="small"></el-input>
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" v-if="replaceStatus" width="100">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="danger"
                          @click="priceDel(scope.$index,2,scope.row)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="personal-collapse-btn  clearfix">
                <el-button size="small" type="primary"    style="margin-top: 10px"  v-if="firstTableData.length>0&&replaceStatus===false" @click="replacePrice(1)">修改</el-button>
                <el-button size="small" type="primary"    style="margin-top: 10px"  v-if="firstTableData.length===0&&replaceStatus===false" @click="replacePrice(1)">增加</el-button>
                <el-button size="small" type="primary"  v-if="replaceStatus===true" style="margin-top: 10px"  @click="submitPrice(firstTableData,thenTableData,1)" >提交</el-button>
                <el-button size="small"  v-if="replaceStatus===true"  style="margin-top: 10px"  @click="canelPrice">取消</el-button>
              </div>
            </div>
          </el-tab-pane>

        </el-tabs>


      </div>

    </el-card>
    <el-card  v-if="this.userStatus>=1">
      <div slot="header" class="clearfix">
        <span class="personal-header-title">添加成本特殊定价组</span>
        <el-button type="primary" class="fr" size="mini"  @click="specialDialogFormVisible=true">添加关键词</el-button>
      </div>
      <div class="personal-right-change  clearfix">
        <el-tabs v-model="specialCityListValue"  @tab-click="specialHandleClick">
          <el-tab-pane :label="item.keyName" :name="item.id.toString()"  v-for="(item,index) in specialCityList">
            <div class="personal-collapse-content clearfix " >
              <div class="personal-collapse fl" style="width: 39%">
                <div class="personal-collapse-title  clearfix">首重
                  <el-button type="primary" size="mini" class="fr" style="margin-top: 10px;margin-right: 10px"
                             v-if="replaceStatus===true" @click="addPriceList(1)">添加
                  </el-button>
                </div>
                <el-table :data="firstTableData" style="width: 100%">
                  <el-table-column prop="name" label="重量区间(KG)">
                    <template slot-scope="scope">
                      <span v-if="replaceStatus===false">{{scope.row.areaBegin}}-{{scope.row.areaEnd}}</span>
                      <div v-if="replaceStatus===true" class="clearfix">
                        <p class="fl" style="width: 50px;height: 32px;line-height: 32px" size="small">
                          {{scope.row.areaBegin}}</p>
                        <p class="fl" style="width: 50px;height: 32px;line-height: 32px">-</p>
                        <el-input v-model="scope.row.areaEnd" class="fl weight-input-width-first"  size="small"
                                  @change="cityEndChange(scope.$index,scope.row.areaEnd,scope.row.areaBegin)"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="金额(元)" width="100">
                    <template slot-scope="scope">
                      <span v-if="replaceStatus===false">{{scope.row.price}}</span>
                      <el-input v-model="scope.row.price" v-if="replaceStatus===true" size="small"
                               class="weight-input-width"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" v-if="replaceStatus" width="100">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="priceDel(scope.$index,1,scope.row)"
                      >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="personal-collapse fl" style="width: 59%;">
                <div class="personal-collapse-title  clearfix">续重（末区间峰值“~”默认为无穷）
                  <el-button type="primary" size="mini" class="fr" style="margin-top: 10px;margin-right: 10px"
                             v-if="replaceStatus===true&&firstTableData.length>0" @click="addPriceList(2)">添加
                  </el-button>
                </div>
                <el-table :data="thenTableData" style="width: 100%">
                  <el-table-column prop="name" label="重量区间(KG)" width="200">
                    <template slot-scope="scope">
                      <span v-if="replaceStatus===false">{{scope.row.areaBegin}}-{{scope.row.areaEnd===1000000?"~":scope.row.areaEnd}}</span>
                      <div v-if="replaceStatus===true" class="clearfix">
                        <p class="fl" style="width: 50px;height: 32px;line-height: 32px" size="small">
                          {{scope.row.areaBegin}}</p>
                        <p class="fl" style="width: 50px;height: 32px;line-height: 32px">-</p>
                        <el-input v-model="scope.row.areaEnd===1000000?'~' :scope.row.areaEnd" class="fl  weight-input-width-first"
                                 size="small"
                                  @change="continueChange(scope.$index,scope.row.areaEnd,scope.row.areaBegin)"></el-input>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="首重(KG)">
                    <template slot-scope="scope">
                      <span v-if="replaceStatus===false">{{scope.row.firstWeight}}</span>
                      <el-input v-model="scope.row.firstWeight" v-if="replaceStatus===true" class="weight-input-width"
                                size="small"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="firstWeight" label="首重金额(元)">
                    <template slot-scope="scope">
                      <span v-if="replaceStatus===false">{{scope.row.firstWeightPrice}}</span>
                      <el-input v-model="scope.row.firstWeightPrice" v-if="replaceStatus===true" class="weight-input-width"
                                size="small"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="weightStandard" label="续重进制单位(KG)">
                    <template slot-scope="scope">
                      <span v-if="replaceStatus===false">{{scope.row.weightStandard}}</span>
                      <el-input v-model="scope.row.weightStandard" v-if="replaceStatus===true" class="weight-input-width"
                                size="small"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column prop="price" label="续重进制金额(元)">
                    <template slot-scope="scope">
                      <span v-if="replaceStatus===false">{{scope.row.price}}</span>
                      <el-input v-model="scope.row.price" v-if="replaceStatus===true" class="weight-input-width"
                                size="small"></el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" v-if="replaceStatus" width="100">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="priceDel(scope.$index,2,scope.row)"
                      >删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="personal-collapse-btn  clearfix">
              <el-button size="small" type="primary" style="margin-top: 10px"
                         v-if="firstTableData.length>0&&replaceStatus===false" @click="replacePrice(2)">修改
              </el-button>
              <el-button size="small" type="primary" style="margin-top: 10px"
                         v-if="firstTableData.length===0&&replaceStatus===false" @click="replacePrice(1)">增加
              </el-button>
              <el-button size="small" type="primary" v-if="replaceStatus===true" style="margin-top: 10px"
                         @click="submitPrice(firstTableData,thenTableData,2)">提交
              </el-button>
              <el-button size="small" v-if="replaceStatus===true" style="margin-top: 10px" @click="canelPrice">取消
              </el-button>
              <el-button  size="small" type="danger"  @click="deleteSpecial(index)" :loading="deleteSpecialLoading">删除</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>


    <el-dialog title="注册" :visible.sync="dialogFormVisible">
      <div class="register">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="box" size="medium"
                 status-icon>
          <el-form-item label="账号" prop="username" class="fn-user-form-item">
            <el-input v-model="ruleForm2.username" placeholder="请输入账号" prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name" class="fn-user-form-item">
            <el-input v-model="ruleForm2.name" placeholder="请输入用户名" prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone" class="fn-user-form-item">
            <el-input v-model="ruleForm2.telephone" placeholder="请输入联系号码" class="wid"
                      prefix-icon="el-icon-phone"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email" class="fn-user-form-item">
            <el-input v-model="ruleForm2.email" placeholder="请输入用户邮箱" prefix-icon="el-icon-share"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="personInCharge" class="fn-user-form-item">
            <el-input v-model="ruleForm2.personInCharge" placeholder="请输入用户公司负责人"
                      prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="账号类型" prop="level" class="fn-user-form-item">
            <el-radio-group v-model="ruleForm2.level">
              <el-radio label="客服号" name="1"></el-radio>
              <el-radio label="运营号" name="2"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码" prop="pass" class="fn-user-form-item">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码"
                      class="wid" prefix-icon="iconfont icon-mima1"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" class="fn-user-form-item">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="请再次输入密码"
                      class="wid" prefix-icon="iconfont icon-mima1"></el-input>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm2')" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="特殊定价组关键词" :visible.sync="specialDialogFormVisible"   width="30%">
      <el-form :model="specialForm" :rules="specialRules" ref="specialForm" >
        <el-form-item label="关键词名称" :label-width="formLabelWidth" prop="specialName">
          <el-input v-model="specialForm.specialName" autocomplete="off"  placeholder="请输入特殊定价组关键词"></el-input>
        </el-form-item>
        <el-form-item label="特殊定价方式" :label-width="formLabelWidth">
          <el-radio-group v-model="radioPrice" size="medium">
            <el-radio border label="1">取代定价</el-radio>
            <el-radio border label="2">追加定价</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="specialDialogFormVisible = false"  size="small">取 消</el-button>
        <el-button type="primary" @click="addSpecialCity('specialForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>

  </section>

</template>

<script>
  import {isvalidPhone} from '../assets/js/validate'
  import $axios from '../api/api'
  import city from '../assets/city/city.js';

  export default {
    name: "personal",

    data() {
      let validateChina = (rule,value,callback)=>{
        let pattern = /^[\u4E00-\u9FA5]{1,5}$/;
        if (value==''){
          callback(new Error('账号不能为空'));
        }else if (pattern.test(value)) {
          callback(new Error('账号不能为中文字符'));
        }else {
          callback();
        }
      };
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
          if (this.csRuleForm.checkPass !== '') {
            this.$refs.csRuleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.csRuleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let validatePassZh = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePassZh2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      return {
        openAndOff:false,
        formLabelWidth:'100px',
        userInfoData: {},
        userData: {},
        csRuleForm: {},
        csRules: {
          telephone: [
            {required: true, validator: validPhone, trigger: 'change'}
          ],
          password: [
            {required: true, validator: validatePass, trigger: 'change'}
          ],
          checkPass: [
            {required: true, validator: validatePass2, trigger: 'change'}
          ],
        },
        changePassword: false,
        submitCodeLoading: false,
        submitCodeText: '发送验证码',
        codeDisable: false,
        dialogFormVisible: false,
        ruleForm2: {
          checkPass: '',
        },
        rules2: {
          level: [
            {required: true, message: '请选择账号类型', trigger: 'change'}
          ],
          username: [
            {required: true,validator: validateChina, trigger: 'change'},
          ],
          name: [
            {required: true, message: '用户名不能为空哦！', trigger: 'change'}
          ],
          email: [
            {required: true, message: '邮箱地址不能为空哦', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
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
            {validator: validatePassZh, trigger: 'change'}
          ],
          checkPass: [
            {validator: validatePassZh2, trigger: 'blur'}
          ],

        },
        props: {
          value: 'label',
          children: 'cities'
        },
        options: [],
        userData: [],
        userStatus: 0,
        accountData: [],
        activeName: '1',
        //
        cityPriceData:[],
        priceLoading:false,
        cityInfoId:0,
        historyData:'',
        firstTableData:[],
        thenTableData:[],
        historyOptions: [],
        replaceStatus:false,
        id:0,
        //特殊定价组
        specialCityList:[],
        specialCityListValue:'1',
        specialDialogFormVisible:false,
        specialForm:{},
        radioPrice:'1',
        specialRules:{
          specialName: [
            {required: true, message: '关键词不能为空哦', trigger: 'change'}
          ],
        },
        specialStatus:1,
        deleteSpecialLoading:false,
        kdBillLoading:false
      }
    },
    methods: {
      //获取自动计算成本功能
      getPricingStatus(){
        $axios.request({
          url:'/express/userCenter/getPricingStatus',
          method:'get',
          statu:1,
          _this:this,
          success:res=>{
            console.log(res)
            if(res.data.pricingStatus===0){
              this.openAndOff=false
            }else {
              this.openAndOff=true
            }
          },
          fail:e=>{
            console.log(e);
          }
        });
      },
      //开启自动计算成本功能
      openAndOffChange(){
        $axios.request({
          url:'/public/updatePricingStatus',
          method:'put',
          statu:2,
          _this:this,
          success:res=>{
              this.$message({
                type: 'success',
                message: '设置成功!',
                duration:1000,
              });
          },
          fail:e=>{
            this.openAndOff=false;
          }
        });
      },
      delExpress(id){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.kdBillLoading=true
          $axios.request({
            url:'/express/user/'+id,
            method:'delete',
            statu:1,
            _this:this,
            success:res=>{
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration:500,
              });
              this.getKdUser();
              this.kdBillLoading=false
            },
            fail:e=>{
              console.log(e);
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration:500,

          });
        });
      },
      //public
      getUserInfo() {
        $axios.request({
          url: '/public/user',
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.userInfoData = res.data.userInfo;
            this.userData = res.data.user;
            this.userStatus = res.data.userInfo.display;
            if (res.data.userInfo.display !== 0) {
              this.getPricingStatus()
              this.getKdUser();
              this.getPriceCity()
            }
          },
          fail: error => {
            console.log(error)
          }
        })
      },
      changePsd() {
        this.changePassword = true;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.changePassword = false;
        this.dialogFormVisible = false;
      },
      csSubmitForm(formName) {
        let _this = this;
        let list = this.csRuleForm;
        let params = {};
        this.$refs[formName].validate((valid) => {
          if (valid) {
            params = {
              onePassword: list.password,
              twoPassword: list.checkPass
            };
            $axios.request({
              url: '/public/user/password/' + list.code,
              method: 'put',
              _this: _this,
              statu: 2,
              data: params,
              success: res => {
                _this.changePassword = false;
                _this.$message({
                  type: 'success',
                  duration:500,
                  message: '修改成功!'
                });
                _this.resetForm(formName);
              },
              fail: error => {
                console.log(error)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      submitCode() {
        let text = '已发送';
        let index = 60;
        this.submitCodeLoading = true;
        $axios.request({
          url: '/public/getCode/' + this.userInfoData.telephone,
          statu: 2,
          _this: this,
          method: 'post',
          success: res => {
              this.submitCodeLoading = false;
            let timer = setInterval(() => {
              this.codeDisable = true;
              index--
              this.submitCodeText = text + index + 'S'
              if (index === 0) {
                clearInterval(timer);
                this.codeDisable = false;
                return
              }
            }, 1000)
          },
          fail: error => {
            console.log(error)
            this.submitCodeLoading = false;
          }
        })
      },

      getKdUser() {
        $axios.request({
          url: '/express/userCenter',
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.accountData = [];
            res.data.userOperate.forEach(v=>{
              v.accountStatus  = 1;
              this.accountData.push(v)
            })
            res.data.userService.forEach(v=>{
              v.accountStatus  = 2;
              this.accountData.push(v)

            })

          },
          fail: res => {
          }
        })
      },
      submitForm(formName) {
        let _this = this;
        let list = this.ruleForm2;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              username: list.username,
              password: list.password,
              name: list.name,
              email: list.email,
              telephone: list.telephone,
              personInCharge: list.personInCharge,
            };
            if (list.level === '运营号') {
              list.level = 1;
            } else {

              list.level = 2;
            }
            $axios.request({
              url: '/express/userCenter/register/' + list.level,
              method: 'post',
              _this: _this,
              statu: 2,
              data: params,
              success: res => {
                this.dialogFormVisible = false;
                _this.$message.success("注册成功!");
                _this.resetForm(formName);
                //
                this.getKdUser();
              },
              fail: error => {
                console.log(error)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleClick(tab, event) {
        console.log(tab)
        this.getCityListInfo(tab.name)
        this.replaceStatus = false;
      },
      getPriceCity(){
        $axios.request({
          url:'/express/pricingGroup/cityList/'+this.userInfoData.id,
          method:'get',
          _this:this,
          statu:1,
          success:res=>{
            this.cityPriceData = res.data;
            this.getCityListInfo(res.data[this.activeName-1].id)
          },
          fail:res=>{
            console.log(res);
          }
        })
      },
      getHistoryInfo(){
        $axios.request({
          url:'/express/pricingGroup/upload/'+this.id,
          method:'get',
          statu:1,
          _this:this,
          success:res=>{
            this.historyOptions = res.data;
          },
          fail:error=>{
            console.log(error);
          }
        })
      },
      getCityListInfo(id){
        if (id){
          this.priceLoading =true;
          this.cityInfoId = id;
          this.historyData ='';
          this.getHistoryInfo();
          $axios.request({
            url:'/express/pricingGroup/'+0+'/'+id,
            method:'get',
            _this:this,
            statu:1,
            success:res=>{
              this.firstTableData = res.data.firstWeight;
              res.data.continuedWeight.forEach(v=>{
                if (v.areaEnd == 1000000) {
                  v.areaEnd = '~'
                }
              });
              this.thenTableData = res.data.continuedWeight;

              this.priceLoading = false;
            },
            fail:r=>{
              console.log(r)
              this.priceLoading = false;
            }
          })
        }
      },
      replacePrice(val) {
        this.replaceStatus = true;
        this.specialStatus = val;
      },
      canelPrice(){
        this.priceLoading = true;
        $axios.request({
          url:'/express/pricingGroup/'+this.id+'/'+this.cityInfoId,
          method:'get',
          _this:this,
          statu:1,
          success:res=>{
            this.firstTableData = res.data.firstWeight;

            res.data.continuedWeight.forEach(v => {
              if (v.areaEnd == 1000000) {
                v.areaEnd = '~'
              }
            });
            this.thenTableData = res.data.continuedWeight;
            this.replaceStatus = false;
            this.priceLoading = false;
          },
          fail:r=>{
            console.log(r)
            this.priceLoading = false;
          }
        })

      },
      addPriceList(status){
        if (status===1){
          let dataArr = this.firstTableData;
          let num = 0;
          if (dataArr.length>0){
            if (dataArr[dataArr.length-1].areaEnd===''||dataArr[dataArr.length-1].areaEnd===null||dataArr[dataArr.length-1].areaEnd===undefined||dataArr[dataArr.length-1].areaEnd===NaN){
              this.$message.error("请先填写完整的重量区间！")
              return false;
            }else if (dataArr[dataArr.length-1].price===''||dataArr[dataArr.length-1].price===null||dataArr[dataArr.length-1].price===undefined||dataArr[dataArr.length-1].price===NaN) {
              this.$message.error("请先填写金额！")
              return false;
            }
            num = (dataArr[dataArr.length-1].areaEnd)*1000000+10000;
            num = num/1000000;
          } else {
            num=0;
          }
          this.firstTableData.push({
            areaBegin:num,
            firstOrContinued:1,
            weightStandard:1,
            firstWeight:0,
            firstWeightPrice:0,
          });
        } else{
          let thenData = this.thenTableData;
          let thenNum = 0;
          let thenLength = thenData.length;
          if (thenLength>0){
            if (thenData[thenLength-1].areaEnd===''||thenData[thenLength-1].areaEnd===null||thenData[thenLength-1].areaEnd===undefined||thenData[thenLength-1].areaEnd===NaN||thenData[thenLength-1].areaEnd==='~'){
              this.$message.error("请先填写完整的重量区间！")
              return false;
            }else if (thenData[thenLength-1].price===''||thenData[thenLength-1].price===null||thenData[thenLength-1].price===undefined||thenData[thenLength-1].price===NaN) {
              this.$message.error("请先填写金额！")
              return false;
            }
            thenNum = (thenData[thenLength-1].areaEnd)*1000000+10000;
            thenNum = thenNum/1000000;

          } else{
            if (this.firstTableData[this.firstTableData.length-1].areaEnd===''||this.firstTableData[this.firstTableData.length-1].areaEnd===null||this.firstTableData[this.firstTableData.length-1].areaEnd===undefined||this.firstTableData[this.firstTableData.length-1].areaEnd===NaN){
              this.$message.error("请先填写完整的重量区间！")
              return false;
            }
            thenNum = (this.firstTableData[this.firstTableData.length-1].areaEnd)*100+1;
            thenNum = thenNum/100;
          }
          this.thenTableData.push({
            areaBegin:thenNum,
            areaEnd:'~',
            weightStandard:1,
            firstOrContinued:2,
            firstWeightPrice:0,
            firstWeight:0,
          });
        }

      },
      cityEndChange(index,val,start){
        let firstData = this.firstTableData;
        let continueData = this.thenTableData;
        let begin =(val*100+1)/100;
        let changeIndex= index+1;
        if (start>=val) {
          this.$message.error("范围值填写有误！");
          this.firstTableData[index].areaEnd = '';
          return false;
        }
        if (firstData.length>changeIndex){
          this.firstTableData[changeIndex].areaBegin = begin;
        } else{
          if (continueData.length>0){
            this.thenTableData[0].areaBegin = begin;
          }
        }

      },
      continueChange(index,val,start){
        let continueData = this.thenTableData;
        let begin =(val*100+1)/100;
        let changeIndex= index+1;
        if (start>=val) {
          this.$message.error("范围值填写有误！");
          this.thenTableData[index].areaEnd = '';
          return false;
        }
        if (continueData.length>changeIndex){
          this.thenTableData[changeIndex].areaBegin = begin;
        }
      },
      priceDel(index,status,val){
        let firstData = this.firstTableData;
        let continueData = this.thenTableData;
        let begin =val.areaBegin;
        let changeIndex= index+1;
        if (status===1){

          if (firstData.length>changeIndex) {
            this.firstTableData[changeIndex].areaBegin = begin;
          }else {
            if (continueData.length>0){
              this.thenTableData[0].areaBegin = begin;
            }
          }
          this.firstTableData.splice(index,1);
          if (this.firstTableData.length===0) {
            this.thenTableData = [];
          }
        } else {
          if (continueData.length>changeIndex) {
            this.thenTableData[changeIndex].areaBegin = begin;
          }
          this.thenTableData.splice(index,1)
        }
      },
      historyCityChange(val){
        $axios.request({
          url:'/express/pricingGroup/'+this.id+'/'+val,
          method:'get',
          _this:this,
          statu:1,
          success:res=>{
            this.firstTableData = res.data.firstWeight;
            this.thenTableData = res.data.continuedWeight;
            console.log(res);
          },
          fail:r=>{
            console.log(r)
          }
        })
      },
      submitPrice(a, b,c) {
        this.priceLoading = true;
        let pricingGroups = [];
        if (a.length > 0) {
          a.forEach(v => {
            pricingGroups.push(v);
          })
        }
        if (b.length > 0) {
          b.forEach(t => {
            if (t.areaEnd === '~') {
              t.areaEnd = 1000000;
            }
            pricingGroups.push(t);
          })
        }
        if (c===1&& this.specialStatus ===1){
          $axios.request({
            url: '/express/pricingGroup/' + this.id + '/' + this.cityInfoId,
            method: 'post',
            statu: 2,
            data: pricingGroups,
            _this: this,
            success: res => {
              this.priceLoading = false;
              this.replaceStatus = false;
              this.getPriceCity();
              this.$message.success('提交成功！')

            },
            fail: e => {
              console.log(e);
              this.priceLoading = false;
            }

          })
        } else if (c===2&&this.specialStatus ===1) {
          $axios.request({
            url:'/express/pricingGroup/special/'+ this.specialCityListValue+'/'+this.id,
            method:'post',
            statu:2,
            data:pricingGroups,
            success:res=>{
              this.priceLoading = false;
              this.replaceStatus = false;
              this.getSpecialCityInfo();
              this.$message.success('提交成功！')
            },
            fail:()=>{
              this.priceLoading = false;
            }

          })


        }else if (c===2&&this.specialStatus ===2) {
          $axios.request({
            url:'/express/pricingGroup/'+this.specialCityListValue,
            method:'put',
            statu:2,
            data:pricingGroups,
            success:res=>{
              this.priceLoading = false;
              this.replaceStatus = false;
              this.getSpecialCityInfo();
              this.$message.success('修改成功！')
            } ,
            fail:()=>{
              this.priceLoading = false;

            }
          })
        }
      },

      appendPricingGroup(){
        this.addStatus = false;
        this.getUserListInfo();
      },
      appendPricingGroupChange(val){
        this.$confirm('此操作将与您选择客户的定价组一致, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.request({
            url:'/express/pricingGroup/customer/'+this.id+'/'+val,
            method:'post',
            _this:this,
            statu:2,
            success:res=>{
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.addStatus=true;
              this.addUserClassSelect = '';
              this.getPriceCity();
            },
            fail:e=>{

            }

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      //特殊定价组
      //获取特殊定价组关键字
      getSpecialCityList(){
        $axios.request({
          url:'/express/pricingGroup/specialKey/0',
          method:'get',
          statu:1,
          success:res=>{
            console.log(res);
            this.specialCityList = res.data
          },
          fail:e=>{
            console.log(e);
          }
        })
      },
      getSpecialCityInfo(){
        this.priceLoading = true;
        $axios.request({
          url:'/express/pricingGroup/special/'+this.specialCityListValue,
          method:'get',
          statu:1,
          success:res=>{
            this.firstTableData = res.data.firstWeight;
            res.data.continuedWeight.forEach(v => {
              if (v.areaEnd == 1000000) {
                v.areaEnd = '~'
              }
            });
            this.thenTableData = res.data.continuedWeight;

            this.priceLoading = false;
          },
          fail:res=>{
            this.priceLoading = false;
          }

        })
      },

      specialHandleClick(a,b){
        this.getSpecialCityInfo();
      },
      addTab(targetName) {

      },
      addSpecialCity(formName){
        let _this = this;
        let param = {
          keyName:this.specialForm.specialName
        };
        this.$refs[formName].validate((valid) => {
          if (valid) {
            $axios.request({
              url: '/express/pricingGroup/special/key/' + this.id+"/"+_this.radioPrice ,
              method: 'post',
              statu: 2,
              data:param,
              success: res => {
                this.specialCityList.push({
                  id:res.data.id,
                  keyName:res.data.keyName
                })
                _this.specialDialogFormVisible = false;
                _this.$message.success("操作成功!");
                _this.resetForm(formName);
              },
              fail: error => {
                console.log(error)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //删除特殊定价组
      deleteSpecial(index){
        this.deleteSpecialLoading = true;
        $axios.request({
          url:'/express/pricingGroup/'+this.specialCityListValue,
          method:'delete',
          statu:1,
          success:res=>{
            this.$message({
              type: 'success',
              duration:500,
              message: '删除成功!'
            });
            this.specialCityList.splice(index,1);
            this.deleteSpecialLoading = false;
          },
          fail:e=>{
            this.deleteSpecialLoading = false;
          }

        })
      },

    },
    created(){
      this.getUserInfo();
    },
    mounted() {
      if ( this.userStatus<1){
          return false
      } else {

        this.getCityListInfo(this.activeName)
        this.getSpecialCityList();
      }
    }
  }
</script>

<style scoped lang="less">
  .personal-top-left {
    border-right: 1px solid #eeeeee;
    width: 100%;
    position: relative;
    height: 100%;
    p {
      font-size: 13px;
      width: 49%;
      display: inline-block;
      line-height: 50px;
    }
    .personal-form-item {
      width: 400px;
      display: inline-block;
      p {
        line-height: 30px;
      }
    }
    .personal-top-left-btn {
    }
  }

  .personal-header-title {
    font-size: 14px;
    font-weight: 700;
  }

  .fn-user-form-item {
    display: inline-block;
    width: 49%;
  }

  .wid {
    width: 100%;
  }
  .personal-main{
    margin-top: 10px;
  }
  .personal-collapse{
    border:1px solid #eee;
    .personal-collapse-title{
      text-align: center;
      background-color: #f5f7fa;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 2px;

    }
  }
  .personal-collapse-select{
    width: 100%;

  }
  .weight-input-width{
    width:100%
  }
  .weight-input-width-first{
    width: 40%;
  }

</style>
