<template>
  <section class="kd-customer-container " v-loading="customerLoading">
    <div class="kd-customer-right">
      <div class="kd-customer-right-header">
        <el-row>
          <el-col :span="9">
            <div class="kong"></div>
          </el-col>
          <el-col :span="7">
            <el-radio-group v-model="customerTabName" @change="radioChange">
              <el-radio-button label="全部工单" icon="el-icon-news"></el-radio-button>
              <el-radio-button label="我处理的" icon="el-icon-news"></el-radio-button>
              <el-radio-button label="工单统计" icon="el-icon-news" v-if="display!=0"></el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
            <div class="kong"></div>
          </el-col>
        </el-row>
      </div>
      <div class="kd-customer-content clearfix" v-if="customerTabName=='工单统计'&&display!=0">
        <div  style="width: 80%">

          <el-date-picker
            v-model="serviceDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            @change="serviceDateChange"
            value-format="yyyy-MM-dd HH:mm:ss"
          style="margin-left: 43%;margin-top: 30px;">
          </el-date-picker>

          <div  class="kd-index-header-right">
            <el-row style="margin-top: 20px">
              <el-col :span="6">
                <div  class="kd-index-header-card-item">
                  <el-row>
                    <el-col :span="8">
                      <div  class="kd-index-header-card-item-left "  style="background-color:#F56C6C ;">
                        <i class="el-icon-tickets  kd-index-header-card-item-left-icon"></i>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div  class="kd-index-header-card-item-right">
                        <p  style="color:#F56C6C">{{replyMap.totalallNum}}</p>
                        <p style="font-size:16px">工单总数</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="6">
                <div  class="kd-index-header-card-item">
                  <el-row>
                    <el-col :span="8">
                      <div  class="kd-index-header-card-item-left " style="background-color:#909399 ;">
                        <i class="el-icon-time  kd-index-header-card-item-left-icon"></i>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div  class="kd-index-header-card-item-right">
                        <p  style="color:#909399">{{replyMap.noHandleNum}}</p>
                        <p style="font-size:16px">未处理工单数</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="6">
                <div  class="kd-index-header-card-item">
                  <el-row>
                    <el-col :span="8">
                      <div  class="kd-index-header-card-item-left " style="background-color:#E6A23C ">
                        <i class="el-icon-edit-outline  kd-index-header-card-item-left-icon"></i>

                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div  class="kd-index-header-card-item-right">
                        <p  style="color: #E6A23C;">{{replyMap.handleingNum}}</p>
                        <p style="font-size:16px">处理中工单数</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :span="6">
                <div  class="kd-index-header-card-item" >
                  <el-row>
                    <el-col :span="8">
                      <div  class="kd-index-header-card-item-left"  style="background-color:#67C23A; ">

                        <i class="el-icon-circle-check  kd-index-header-card-item-left-icon"></i>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div  class="kd-index-header-card-item-right">
                        <p   style="color: #67C23A;"> {{replyMap.handledNum}}</p>
                        <p style="font-size:16px">完结工单数</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>

            </el-row>

          </div>
        </div>

        <el-table
          :data="replyServiceList"
          border
          style="width: 100% ;margin-top: 30px;text-align: center">
          <el-table-column
            label="标签"
            align="center">
            <template slot-scope="scope">
              <el-tag
              v-if="scope.row.display === 0"
              type="primary"
              disable-transitions>客服</el-tag>
              <el-tag
                v-if="scope.row.display === 1"
                type="success"
                disable-transitions>老板</el-tag>
              <el-tag
                v-if="scope.row.display === 2"
                type="info"
                disable-transitions>运营</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="昵称"
            align="center">
          </el-table-column>
          <el-table-column
            align="center"
            prop="personInCharge"
            label="客服">
          </el-table-column>
          <el-table-column
            align="center"
            prop="totalallNum"
            sortable
            label="工单总数">
          </el-table-column>
          <el-table-column
            sortable
            align="center"
            prop="handleingNum"
            label="处理中工单数">
          </el-table-column>
          <el-table-column
            sortable
            align="center"
            prop="handledNum"
            label="完结工单数">
          </el-table-column>
          <el-table-column label="分配" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.display !== 1"
                size="mini"
                type="danger"
                @click="distributionUser(scope.row)">分配客户</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="kd-customer-content clearfix" v-else>
        <el-card class="kd-customer-search">
          <div slot="header" class="clearfix">
            <span class="kd-customer-search-title el-icon-search">搜索</span>
          </div>
          <div class="kd-customer-search-form" >
            <el-form ref="ruleForm" :model="ruleForm" :inline="true"  class="demo-form-inline" style="margin-left:15%" label-width="80px" size="small">
              <el-form-item label="错误类型">
                <el-select v-model="ruleForm.typeId" placeholder="请选择咨询类型" size="small"
                           class="search-title-width">
                  <el-option
                    v-for="item in errorTypeData"
                    :key="item.id"
                    :label="item.typeName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工单状态">
                <el-select v-model="ruleForm.customerErrorType" placeholder="请选择工单状态" size="small"
                           class="search-title-width">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="起止日期" size="large">
                <el-date-picker
                  v-model="ruleForm.timeRangeData"
                  type="datetimerange"
                  size="large"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="search-title-width"
                  @change="timeRangeDataChange">
                </el-date-picker>
              </el-form-item>
              <br><br>
              <el-form-item label="运单号">
                <el-input v-model="ruleForm.waybillNumber"
                          class="search-title-width"
                          placeholder="请输入运单号查询" prefix-icon="el-icon-search" size="small"></el-input>
              </el-form-item>

              <el-form-item label="商户名">
                <el-input v-model="ruleForm.keyName"
                          class="search-title-width"
                          placeholder="请输入商户名" prefix-icon="el-icon-search" size="small"></el-input>
              </el-form-item>
              <el-form-item label="处理人" v-if="customerTabName=='全部工单'">
                <el-select multiple v-model="ruleForm.accountUserList" placeholder="请选择处理人" size="small"
                           class="search-title-width">
                  <el-option
                    v-for="item in accountList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <!--<el-form-item label="接单耗时" v-if="customerTabName=='全部工单'&&display!=0">
                <el-select v-model="ruleForm.receiveSolt" placeholder="请选择">
                  <el-option label="10分钟内" value="10"></el-option>
                  <el-option label="30分钟内" value="30"></el-option>
                  <el-option label="1小时内" value="60"></el-option>
                  <el-option label="3小时内" value="180"></el-option>
                  <el-option label="6小时内" value="360"></el-option>
                  <el-option label="1天内" value="1440"></el-option>
                  <el-option label="3天内" value="4320"></el-option>
                  <el-option label="3天以上" value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="完结耗时" v-if="customerTabName=='全部工单'&&display!=0">
                <el-select v-model="ruleForm.endSolt" placeholder="请选择">
                  <el-option label="10分钟内" value="10"></el-option>
                  <el-option label="30分钟内" value="30"></el-option>
                  <el-option label="1小时内" value="60"></el-option>
                  <el-option label="3小时内" value="180"></el-option>
                  <el-option label="6小时内" value="360"></el-option>
                  <el-option label="1天内" value="1440"></el-option>
                  <el-option label="3天内" value="4320"></el-option>
                  <el-option label="3天以上" value="0"></el-option>
                </el-select>
              </el-form-item>-->
              <br/><br/>
              <el-form-item style="margin-left: 30%">
                <el-button type="primary" @click="submitForm('ruleForm')" size="small" :loading="submitRuleFormLoading">
                  确定
                </el-button>
                <el-button @click="resetFormRule('ruleForm')" size="small">重置</el-button>
                <a :href="downloadExcelUrl"><el-button type="primary"  size="small">导出工单</el-button></a>

              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card class="kd-customer-main  clearfix">
          <div slot="header" class="clearfix">
            <span class="kd-customer-main-title el-icon-service">{{customerTabName}}</span>&nbsp;&nbsp;&nbsp;
            <el-button @click='refreshService()' type="primary" icon="el-icon-refresh" size="small" v-if="customerTabName=='全部工单'">
              刷新
            </el-button>
            <el-button @click='forwarding(serviceId)' type="primary" icon="el-icon-sort" size="small" v-if="customerTabName=='全部工单'">
              批量分配
            </el-button>

            <el-button @click='batchReplyBefore(serviceId)' type="primary" icon="el-icon-sort" size="small" v-if="customerTabName=='我处理的'">
              批量回复
            </el-button>
            <el-button @click='batchfinish(serviceId)' type="primary" icon="el-icon-sort" size="small" v-if="customerTabName=='我处理的'">
              批量完结
            </el-button>
          </div>
          <div class="kd-customer-main-all">
            <el-table
              :data="customerData"
              style="width: 100%;"
              @selection-change="handleSelectionChange"
              :default-sort = "{prop: 'createTime', order: 'descending'}"
            >
              <el-table-column
                type="selection"
                width="55"
              >
              </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <div class="kd-customer-item-main" v-if="props.row.status>1">
                    <el-row>
                      <el-col :span="18" >
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
                      </el-col>
                      <el-col :span="6">
                        <div style="text-align: left;line-height: 30px;">
                          <p>
                            <el-alert
                              title=""
                              type="success"
                              :closable="false">
                              接单时间：{{props.row.receiveTime==''?'暂无':props.row.receiveTime}}
                            </el-alert>
                          </p>
                          <p>
                            <el-alert
                              title=""
                              type="warning"
                              :closable="false">
                              接单所耗时间：{{props.row.receiveTime==''?'暂无':props.row.receiveTimeSolt}}
                            </el-alert>
                          </p>
                          <p>
                            <el-alert
                              title=""
                              type="info"
                              :closable="false">
                              {{props.row.status<3?'完结时间：未完结':'完结时间：'+props.row.endTime}}
                            </el-alert>
                          </p>
                          <p>
                            <el-alert
                              title=""
                              type="error"
                              :closable="false">
                              {{props.row.status<3?'完结所耗时间：未完结':'完结所耗时间：'+props.row.endTimeSolt}}
                            </el-alert>
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="kd-customer-item-main" v-else>
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

                label="运单号(点击查看物流信息)"
                >
                <template slot-scope="scope">
                  <el-button type="text" :loading="loading" @click="autonumber(scope.row.waybillNumber)"><u>{{scope.row.waybillNumber}}</u></el-button>
                </template>

              </el-table-column>
              <el-table-column

                label="问题类型"
                >
                <template slot-scope="scope">
                  <el-tag size="small" type="danger" v-if="scope.row.typeId===1">{{scope.row.typeName}}</el-tag>
                  <el-tag size="small" type="success" v-if="scope.row.typeId===2">{{scope.row.typeName}}</el-tag>
                  <el-tag size="small" type="info" v-if="scope.row.typeId!=2&&scope.row.typeId!=1">{{scope.row.typeName}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column

                label="商户名"
                prop="userKey">
              </el-table-column>
              <el-table-column
                label="状态"
                >
                <template slot-scope="scope">
                  <el-tag size="small" type="info" v-if="scope.row.status===1">{{scope.row.statusName}}</el-tag>
                  <el-tag size="small" type="warning" v-if="scope.row.status===2">{{scope.row.statusName}}</el-tag>
                  <el-tag size="small" type="success" v-if="scope.row.status===3">{{scope.row.statusName}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="工单创建时间"
                sortable
                prop="createTime"
                width="300">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="300">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" v-if="scope.row.status===1" @click="handleOrder(scope.row.id)">我来处理
                  </el-button>
                  <el-button size="mini" type="primary" v-if="scope.row.status===1"
                             @click="forwarding(scope.row.id)">分配工单
                  </el-button>
                  <el-button size="mini" type="primary" v-if="scope.row.status===2&&customerTabName==='我处理的'&&scope.row.receiveTime!==''"
                             @click='completeService(scope.row.id)'>完结
                  </el-button>
                  <el-badge :is-dot="scope.row.replyNum==0?false:true"  type="warning" v-if="customerTabName==='我处理的'">
                    <el-button size="mini" type="primary" @click="chat(scope.row.id,scope.row.userId,scope.row.content)">
                      {{scope.row.status===2?'工单回复':'查看'}}
                    </el-button>
                  </el-badge>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            background
            class="client-customer-pag  fr"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </el-card>
      </div>
    </div>
    <el-dialog :title="'物流信息'" :visible.sync="dialogTableVisible" center>
          <div  v-if="information.status==200">
            <img src="https://funwl.oss-cn-hangzhou.aliyuncs.com/images/le93cd5an8" alt="" width="100%" height="6px">
            <el-steps direction="vertical" :active="1" process-status="error ">
              <el-step v-for="(item,index) in information.data" :status="index!=0?'finish ':'error'" icon='el-icon-caret-top' :title="item.context" :description="item.time"></el-step>
            </el-steps>
          </div>
          <div v-else>
            <img src="https://funwl.oss-cn-hangzhou.aliyuncs.com/images/le93cd5an8" alt="" width="100%" height="6px">
            <div class="error-img"><img src="../../assets/images/error.png" alt="" width="40%" height="200px" style="margin-left: 30%"></div>
            <p style="margin-left: 30%;color: #F56C6C;font-size: 16px;font-weight: bold"><!--{{information.message}}-->单号错误或单号不存在！
              <a href="http://www.kuaidi100.com/" target="view_window" style="font-size:14px;color: #00a0f0" >&nbsp;&nbsp;<u>去快递100查询</u></a>
            </p>
          </div>
    </el-dialog>
    <el-dialog :visible.sync="transferUser" @close="noUserListData" :title="user.name" center width="65%">

      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已绑定的客户:{{usersListBinding.length}}位</span>
            </div>
            <div style="overflow:auto;height: 350px;">
            <div v-for="o in usersListBinding" :key="o.id" >

              <el-row>
                <el-col :span="18">{{o.name}}</el-col>
                <el-col :span="6"><el-button type="text" icon="el-icon-error" @click="deleteCustomerUser(o.id)" size="mini">解绑</el-button></el-col>
              </el-row>
            </div>
            </div>
          </el-card>
        </div></el-col>
        <el-col :span="16">
          <div style="margin-left: 15%">
            <!--<p style="font: 16px Extra large;font-weight: bold;text-align: center"><i class="el-icon-edit"></i>请选择需转移的客户归属的分支</p>-->
            <div  style="padding-top: 30px;padding-bottom: 15px;margin-left: 0%" >
              选择分支：
              <el-cascader
                expand-trigger="hover"
                :props="defaultProps"
                :options="expressUsersList"
                :show-all-levels="false"
                filterable
                :change-on-select="true"
                v-model="selectedUserOptions"
                @change="handleChangeExpressUsersList">
              </el-cascader>
            </div>
            <!--<p style="font: 16px Extra large;font-weight: bold"><i class="el-icon-edit"></i>请选择需移动的客户</p>-->
            <div style="padding-top: 20px;padding-bottom: 35px">
              <el-transfer
                filterable
                filter-placeholder="请输入客户拼音"
                :titles="['客户', '已选客户']"
                v-model="valueUser"
                :props="UserListProps"
                :data="UserListData">
              </el-transfer>
            </div>
          </div>
        </el-col>
      </el-row>


      <div slot="footer" class="dialog-footer">
        <el-button @click="noUserListData" size="small">取 消</el-button>
        <el-button type="primary" @click="yesUserListData()"  size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="批量回复"
      :visible.sync="batchReply"
      width="30%"
    >
      回复内容：
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="textareaBatchReply">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchReplyBtn(textareaBatchReply)" size="small" :loading="submitLoading">发送</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="转发工单"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="formData" label-width="80px" :rules="rules">
        <el-form-item label="客服人员" prop="customerName">
          <el-select v-model="formData.customerName" placeholder="请选择要转发的客服" filterable>
            <el-option :label="item.name" :value="item.id" v-for="item in  customerUserList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('form')" size="small">取 消</el-button>
    <el-button type="primary" @click="submitForm('form')" size="small" :loading="submitLoading">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="完结工单"
      :visible.sync="dialogVisibleReply"
      width="30%"
    >
      <el-form ref="replyFrom" :model="replyData" label-width="50px" :rules="replyRules">
        <el-form-item label="备注" prop="textInfo">
          <el-input
            type="textarea"
            :rows="7"
            placeholder=""
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
      title="工单回复"
      :visible.sync="dialogVisibleChat"
      width="700px"
      @close="textarea=''"
    >
      <div class="kd-customer-service">
        <div class="kd-customer-service-main  clearfix" ref="main" @keyup.enter="chatEnd">
          <div   class="kh-customer-service-main-item clearfix">
            <img :src="imgLeft"  style="width: 40px;height: 40px" alt="" :class="imgClassLeft" >
            <span :class="classLeft">
                          问题描述：{{handleErrorVal}}
                    </span>
          </div>

          <div v-for="item in chatData" class="kd-customer-service-main-item clearfix">
            <img :src="item.userId===senderId?imgLeft:imgRight" style="width: 40px;height: 40px" alt=""
                 :class="item.userId===senderId?imgClassLeft:imgClassRight">
            <span :class="item.userId===senderId?classLeft:classRight">
                          {{item.content}}
                    </span>
          </div>
        </div>
        <div class="kd-customer-service-footer">
          <el-input
            type="textarea"
            :rows="7"
            placeholder=""
            v-model="textarea">
          </el-input>
          <el-button type="primary" @click="chatEnd" size="mini" class="kd-customer-service-footer-btn">发送</el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import $axios from '../../api/api'
  import qs from 'qs'
  import {changeDate,dateCompare} from "../../assets/js/changeDate";
  import {baseSrc} from '../../api/api'

  export default {
    name: "customerService",
    data() {
      return {
        textareaBatchReply:'',
        batchReply:false,


        dialogTableVisible:false,
        information:{status:''},
        loading:false,

        serviceId:'',
        transferUser:false,
        usersListBinding:[],
        defaultProps: {
          children: 'sysUserInfos',
          label: 'name',
          value: 'id',

        },
        user:'',
        expressUsersList:[],
        selectedUserOptions:[],
        UserListData:[],
        valueUser:[],
        UserListProps:{
          label: 'name',
          key: 'id',
          pinyin: 'name',
          disabled:'status'
        },
        handleErrorVal:'',
        replyMap:{},
        replyServiceList:[],
        downloadExcelUrl:'',
        display:sessionStorage.getItem('funwlDisplay'),
        submitRuleFormLoading: false,
        customerTabName: '全部工单',
        serviceDate:'',
        timeRangeData: '',
        errorTypeData: [],
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
        pageSize: 30,
        currentPage: 1,
        totalNum: 0,
        customerData: [],
        customerLoading: false,
        ruleForm: {
          accountUserList:[],
          customerErrorType: '0',
          waybillNumber: '',
          typeId: '',
          createTime: '',
          endTime: '',
          keyName:'',
          receiveSolt:"",
          endSolt:""
        },
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
        dialogVisible: false,
        formData: {
          customerName: ''
        },
        customerUserList: [],
        rules: {
          customerName: [
            {required: true, message: '请选择客服', trigger: 'change'}
          ],
        },
        replyRules: {
          textInfo: [
            {required: true, message: '备注不能为空', trigger: 'change'}]
        },

        handleId: '',
        accountList:[],
        submitLoading: false,
        replyData: {
          textInfo: ''
        },
        dialogVisibleReply: false,
        completeServiceId: '',
        dialogVisibleChat: false,
        textarea: '',
        chatData: [],
        senderId: '',
        classLeft: 'kd-customer-sercive-text  kd-customer-sercive-text-left',
        classRight: 'kd-customer-sercive-text  kd-customer-sercive-text-right  fr',
        imgClassLeft: 'fl kh-customer-sercive-img-left ',
        imgClassRight: 'fr',
        avatarImgRight: '../../assets/images/zzw.jpg',
        avatarImgLeft: '../../assets/images/hyc.jpg',
        imgLeft: 'https://funwl.oss-cn-hangzhou.aliyuncs.com/images/pgvfmyr3s7',
        // imgRight:'https://funwl.oss-cn-hangzhou.aliyuncs.com/images/l9mdx微信图片_20181022180840.jpg',
        imgRight: 'https://funwl.oss-cn-hangzhou.aliyuncs.com/images/vrwl6cmsat',

      };
    },
    methods: {
      handleChangeExpressUsersList(value){
        if(value.length<1){
          value=[-1]
        }
        let id = value[value.length - 1]
        $axios.request({
          url: '/express/customerUser/branchUsers/' +id,
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            let redata = res.data;
            redata.forEach(v=>{
              v.status==1? v.status=true: v.status=false
            })
            this.UserListData = redata
          },
          fail: r => {
            console.log(r)
          }
        })
      },
      noUserListData(){
        this.transferUser = false;
        //需要转移
        this.selectedUserOptions=[]
        this.UserListData=[]
        this.valueUser=[]
      },
      //解绑
      deleteCustomerUser(id){
        $axios.request({
          url: '/express/customerUser/deleteCustomerUser/'+id,
          method: 'delete',
          _this: this,
          statu: 1,
          success: res => {
            this.$message({
              type: 'success',
              message: '已解除',
              duration: 500,
            });
            this.getBinding(this.user);
          },
          fail: res => {
          }
        })
      },
      yesUserListData(){

        let user =this.selectedUserOptions
        if(user.length<1){
          this.$message({
            type: 'warning',
            message: '请选择分支!',
            duration:800,
          });
          return
        }
        if(this.valueUser.length<1){
          this.$message({
            type: 'warning',
            message: '请选择转移的客户!',
            duration:800,
          });
          return
        }
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        $axios.request({
          url: '/express/customerUser/addCustomerUser/'+this.valueUser.join()+"/"+this.user.user_id,
          method: 'post',
          _this: this,
          statu: 2,
          success: res => {
            this.$message({
              type: 'success',
              message: '添加成功!',
              duration:800,
            });
            this.selectedUserOptions=[]
            this.UserListData=[]
            this.valueUser=[]
            this.getBinding(this.user);
            loading.close();
          },
          fail: res => {
            loading.close();
          }
        })
      },
      distributionUser(val){
        this.user = val
        this.transferUser = true;
        this.getBranch();
        this.getBinding(val);
      },
      //获取分支
      getBranch(){
        $axios.request({
          url: '/express/branch',
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.expressUsersList = res.data;
          },
          fail: res => {
            console.log(res);
          }
        })
      },
      //获取绑定客户
      getBinding(val){
        $axios.request({
          url: '/express/customerUser/getCustomerUserList/'+val.user_id,
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.usersListBinding = res.data;
          },
          fail: res => {
            console.log(res);
          }
        })
      },
      serviceDateChange(){
        this.getAllReplys()
        this.getAllReplysByService()
      },
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
      //刷新全部工单
      refreshService(){
        this.getCustomerInfo({
          page: this.currentPage,
          size: this.pageSize,
          type: this.ruleForm.typeId,
          status: this.ruleForm.customerErrorType,
          waybillNumber: this.ruleForm.waybillNumber,
          keyName:this.ruleForm.keyName,
          accountUserList:[],
          createTime: this.ruleForm.createTime,
          endTime: this.ruleForm.endTime,
          receiveSolt: this.ruleForm.receiveSolt,
          endSolt: this.ruleForm.endSolt
        })
      },
      //get
      getCustomerInfo({
                        page: page,
                        size: size,
                        waybillNumber: waybillNumber,
                        keyName:keyName,
                        accountUserList:accountUserList,
                        createTime: createTime,
                        endTime: endTime,
                        status: status,
                        type: type,
                        receiveSolt:receiveSolt,
                        endSolt:endSolt
                      }) {
        let url = '';
        let param = {
          waybillNumber: waybillNumber,
          keyName:keyName,
          accountUserList:accountUserList,
          page: page,
          size: size,
          status: status,
          type: type,
          receiveSolt:receiveSolt,
          endSolt:endSolt,
          createTime : createTime,
          endTime : endTime,
          token:sessionStorage.getItem('funwlToken')
        };
        //下载工单路径
        this.downloadExcelUrl = baseSrc+'/express/service/ExportOrder?'+qs.stringify(param)

        if (this.customerTabName === '全部工单') {
          url = 'express/service/list';
        } else if (this.customerTabName === '我处理的') {
          url = 'express/service/self/list'
        }

        this.customerLoading = true;
        $axios.request({
          url: url,
          method: 'get',
          statu: 1,
          data: param,
          _this: this,
          success: res => {
            this.totalNum = res.data.total;
            if (res.data.records) {
              res.data.records.forEach(v => {
                v.imgUploadSrcList = v.enclosure.split(",")
                if(v.imgUploadSrcList.length==1&&v.imgUploadSrcList[0]==""){
                  v.imgUploadSrcList=[]
                }
                v.receiveTimeSolt = dateCompare(v.createTime,v.receiveTime);
                v.endTimeSolt = dateCompare(v.createTime,v.endTime);
                switch (v.status) {
                  case 1:
                    v.statusName = '未处理';
                    break;
                  case 2:
                    v.statusName = '处理中';
                    break;
                  case 3:
                    v.statusName = '处理完毕';
                    break
                }
              })
            }
            ;
            this.customerData = res.data.records;
            this.customerLoading = false;
          },
          fail: e => {
            console.log(e);
            this.customerLoading = false;

          }
        })
      },
      getErrorType() {
        $axios.request({
          url: '/public/types',
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.errorTypeData = res.data;
          },
          fail: error => {
            console.log(error)
          }
        })
      },
      //分页
      handleSizeChange(val) {
        this.pageSize = val;
        this.getCustomerInfo({
          page: this.currentPage,
          size: this.pageSize,
          type: this.ruleForm.typeId,
          status: this.ruleForm.customerErrorType,
          waybillNumber: this.ruleForm.waybillNumber,
          keyName:this.ruleForm.keyName,
          accountUserList:this.ruleForm.accountUserList.join(),
          createTime: this.ruleForm.createTime,
          endTime: this.ruleForm.endTime,
          receiveSolt:this.ruleForm.receiveSolt,
          endSolt:this.ruleForm.endSolt
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getCustomerInfo({
          page: this.currentPage,
          size: this.pageSize,
          type: this.ruleForm.typeId,
          status: this.ruleForm.customerErrorType,
          waybillNumber: this.ruleForm.waybillNumber,
          keyName:this.ruleForm.keyName,
          accountUserList:this.ruleForm.accountUserList.join(),
          createTime: this.ruleForm.createTime,
          endTime: this.ruleForm.endTime,
          receiveSolt:this.ruleForm.receiveSolt,
          endSolt:this.ruleForm.endSolt
        })
      },
      //change
      timeRangeDataChange(val) {
        if (val) {
          this.ruleForm.createTime = changeDate(val[0]);
          this.ruleForm.endTime = changeDate(val[1]);
        }
      },
      radioChange() {
        if(this.customerTabName=='工单统计'){
          this.getAllReplys()
          this.getAllReplysByService()
          return
        }
        this.getCustomerInfo({
          page: this.currentPage,
          size: this.pageSize,
          type: this.ruleForm.typeId,
          status: this.ruleForm.customerErrorType,
          waybillNumber: this.ruleForm.waybillNumber,
          keyName:this.ruleForm.keyName,
          accountUserList:this.ruleForm.accountUserList.join(),
          createTime: this.ruleForm.createTime,
          endTime: this.ruleForm.endTime,
          receiveSolt:this.ruleForm.receiveSolt,
          endSolt:this.ruleForm.endSolt
        })

      },
      //获取统计列表
      getAllReplysByService(){
        let dateBegin =''
        let dateEnd =''
        if(this.serviceDate!=''&&this.serviceDate!=null){
          dateBegin=this.serviceDate[0]
          dateEnd = this.serviceDate[1]
        }
        let params = {
          dateBegin:dateBegin,
          dateEnd:dateEnd
        }
        $axios.request({
          url: '/express/service/reply/byService',
          method: 'get',
          statu: 1,
          data:params,
          _this: this,
          success: res => {
            this.replyServiceList = res.data;
          },
          fail: e => {

          }
        })
      },
      //获取总工单统计
      getAllReplys(){
        let dateBegin =''
        let dateEnd =''
        if(this.serviceDate!=''&&this.serviceDate!=null){
          dateBegin=this.serviceDate[0]
          dateEnd = this.serviceDate[1]
        }
        let params = {
          dateBegin:dateBegin,
          dateEnd:dateEnd
        }
        $axios.request({
          url: '/express/service/reply/all',
          method: 'get',
          statu: 1,
          data:params,
          _this: this,
          success: res => {
            this.replyMap = res.data;
          },
          fail: e => {

          }
        })
      },
      autonumber(val){
        this.loading=true
        this.getWaybill(val)
      },
      getWaybill(val){
        if(val==''||val==null){
          return
        }
        $axios.request({
          url:'/public/express/autonumber/'+val,
          method:'post',
          statu:2,
          _this:this,
          success:res=>{
            console.log("autonumber")
            console.log(res)
            if(res.data.auto.length<1){
              //this.$message.error('运单号错误或不存在');
              this.information.status='100';
              this.dialogTableVisible=true
              this.loading=false
            }else{
              this.queryNum(val,res.data.auto[0].comCode)
            }
          },
          fail:e=>{
            this.loading=false
          }
        })
      },
      queryNum(num,str){
        $axios.request({
          url:'/public/express/query/'+str+'/'+num,
          method:'post',
          statu:2,
          _this:this,
          success:res=>{
            if(res.data){
              this.information = res.data
            }
            else {
              this.information.status='100';
            }

            this.loading=false
            this.dialogTableVisible=true
          },
          fail:e=>{
            this.loading=false
            this.dialogTableVisible=false
          }
        })
      },
      handleSelectionChange(val) {
        let arr = [];
        if (val.length > 0) {
          val.forEach(v => {
            arr.push(v.id)
          });
        }
        this.serviceId = arr.join();
      },
      //未处理工单数
      nohandle(){
        $axios.request({
          url: '/express/service/noHandle',
          _this: this,
          method: 'get',
          statu: 1,
          success: res => {
            this.$store.state.serviceNum=res.data;
          },
        })
      },
      //我来处理
      handleOrder(id) {
        $axios.request({
          url: '/express/service/handle/' + id,
          method: 'post',
          statu: 2,
          _this: this,
          success: res => {
            if(res.code==10020){
              this.$message({
                type: 'warning',
                message: res.info,
                duration: 100,
              });
              this.getCustomerInfo({
                page: this.currentPage,
                size: this.pageSize,
                type: this.ruleForm.typeId,
                status: this.ruleForm.customerErrorType,
                waybillNumber: this.ruleForm.waybillNumber,
                keyName:this.ruleForm.keyName,
                accountUserList:this.ruleForm.accountUserList.join(),
                createTime: this.ruleForm.createTime,
                endTime: this.ruleForm.endTime,
                receiveSolt:this.ruleForm.receiveSolt,
                endSolt:this.ruleForm.endSolt
              })
              return;
            }
            this.$message({
              type: 'success',
              message: '操作成功',
              duration: 500,
            });
            //this.$store.state.serviceNum = this.$store.state.serviceNum-1;

            this.nohandle()
            this.getCustomerInfo({
              page: this.currentPage,
              size: this.pageSize,
              type: this.ruleForm.typeId,
              status: this.ruleForm.customerErrorType,
              waybillNumber: this.ruleForm.waybillNumber,
              keyName:this.ruleForm.keyName,
              accountUserList:this.ruleForm.accountUserList.join(),
              createTime: this.ruleForm.createTime,
              endTime: this.ruleForm.endTime,
              receiveSolt:this.ruleForm.receiveSolt,
              endSolt:this.ruleForm.endSolt
            })
          },
          fail: e => {
            console.log(e);
          }

        })
      },
      getAccount(){
        $axios.request({
          url: '/express/service/getAccounts',
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.accountList = res.data;
          },
          fail: res => {
            console.log(res);
          }
        })
      },
      //转发
      forwarding(id) {
        if(id==''){
          this.$message.error({
            message: '请选择工单',
            duration: 1000,
          })
          return;
        }
        this.handleId = id;
        this.dialogVisible = true;
        $axios.request({
          url: '/express/service/customers',
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.customerUserList = res.data;
          },
          fail: res => {
            console.log(res);
          }
        })
      },
      //完成
      completeService(id) {
        this.completeServiceId = id
        this.dialogVisibleReply = true;
      },
      submitForm(formName) {
        let _this = this;
        function forwardingSubmit(formName) {
          $axios.request({
            url: '/express/service/forward/' + _this.handleId + '/' + _this.formData.customerName,
            method: 'post',
            statu: 2,
            _this: _this,
            success: () => {
              _this.nohandle()
              _this.$message({
                type: 'success',
                message: '操作成功',
                duration: 500,
              });
              _this.submitLoading = false
              _this.resetForm(formName);
              _this.getCustomerInfo({
                page: _this.currentPage,
                size: _this.pageSize,
                type: _this.ruleForm.typeId,
                status: _this.ruleForm.customerErrorType,
                waybillNumber: _this.ruleForm.waybillNumber,
                keyName: _this.ruleForm.keyName,
                accountUserList:_this.ruleForm.accountUserList.join(),
                createTime: _this.ruleForm.createTime,
                endTime: _this.ruleForm.endTime,
                receiveSolt:_this.ruleForm.receiveSolt,
                endSolt:_this.ruleForm.endSolt
              })
            },
            fail: e => {
              console.log(e);
              _this.submitLoading = false
            }
          })
        };

        function completeServiceSubmit(formName) {
          $axios.request({
            url: '/express/service/finish/' + _this.completeServiceId,
            method: 'get',
            statu: 1,
            _this: _this,
            data: {
              remarks: _this.replyData.textInfo
            },
            success: res => {
              _this.$message({
                type: 'success',
                message: '操作成功',
                duration: 500,
              });
              /*_this.customerData.forEach(v=>{
                if( v.id==res.data.id){
                  v.endTimeSolt =dateCompare(res.data.createTime,res.data.endTime);
                  v.endTime = res.data.endTime
                  v.status = 3
                }
              })*/

              _this.submitLoading = false
              _this.resetForm(formName);
              _this.getCustomerInfo({
                page: _this.currentPage,
                size: _this.pageSize,
                type: _this.ruleForm.typeId,
                status: _this.ruleForm.customerErrorType,
                waybillNumber: _this.ruleForm.waybillNumber,
                keyName: _this.ruleForm.keyName,
                accountUserList:_this.ruleForm.accountUserList.join(),
                createTime: _this.ruleForm.createTime,
                endTime: _this.ruleForm.endTime,
                receiveSolt:_this.ruleForm.receiveSolt,
                endSolt:_this.ruleForm.endSolt
              })
            },
            fail: () => {
              _this.submitLoading = false
            }
          })
        };


        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            switch (formName) {
              case 'form':
                forwardingSubmit('form');
                break;
              case 'replyFrom':
                completeServiceSubmit('replyFrom');
                break;
              case 'ruleForm':
                this.getCustomerInfo({
                  page: this.currentPage,
                  size: this.pageSize,
                  type: this.ruleForm.typeId,
                  status: this.ruleForm.customerErrorType,
                  waybillNumber: this.ruleForm.waybillNumber,
                  keyName:this.ruleForm.keyName,
                  accountUserList:this.ruleForm.accountUserList.join(),
                  createTime: this.ruleForm.createTime,
                  endTime: this.ruleForm.endTime,
                  receiveSolt:this.ruleForm.receiveSolt,
                  endSolt:this.ruleForm.endSolt
                });
            }


          } else {
            return false;
          }

        });
      },
      //批量完结
      batchfinish(ids){
        let _this = this
        this.$confirm('此操作将完结所选工单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.request({
            url: '/express/service/batch/finish/',
            method: 'get',
            statu: 1,
            _this: _this,
            data: {
              handleId: ids
            },
            success: res => {
              _this.$message({
                type: 'success',
                message: '操作成功',
                duration: 500,
              });
              _this.getCustomerInfo({
                page: _this.currentPage,
                size: _this.pageSize,
                type: _this.ruleForm.typeId,
                status: _this.ruleForm.customerErrorType,
                waybillNumber: _this.ruleForm.waybillNumber,
                keyName: _this.ruleForm.keyName,
                accountUserList:_this.ruleForm.accountUserList.join(),
                createTime: _this.ruleForm.createTime,
                endTime: _this.ruleForm.endTime,
                receiveSolt:_this.ruleForm.receiveSolt,
                endSolt:_this.ruleForm.endSolt
              })
            },
            fail: () => {
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      batchReplyBefore(ids){
        if(ids==''){
          this.$message.error({
            message: '请选择工单',
            duration: 1000,
          })
          return;
        }
        this.handleId = ids;
        this.batchReply = true;
      },
      //批量回复工单
      batchReplyBtn(val){
        this.submitLoading=true

        let param = {
          handleId:this.handleId,
          content:val
        }
        $axios.request({
          url: '/express/service/batch/reply',
          method: 'post',
          data: param,
          statu: 2,
          _this: this,
          success: res => {
            this.submitLoading=false
            this.batchReply = false;
            this.$message({
              type: 'success',
              message: '回复成功',
              duration: 1000,
            })
            this.textareaBatchReply=''
          },
          fail: res => {
            this.batchReply = false;
            this.submitLoading=false
            console.log(res);
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible = false;
        this.dialogVisibleReply = false
      },
      resetFormRule(formName) {
        this.ruleForm = {
          customerErrorType: '0',
          accountUserList:[],
          waybillNumber: '',
          typeId: '',
          createTime: '',
          endTime: '',
          receiveSolt:"",
          endSolt:"",
        }
        this.getCustomerInfo({
          page: this.currentPage,
          size: this.pageSize,
          type: this.ruleForm.typeId,
          status: this.ruleForm.customerErrorType,
          waybillNumber: this.ruleForm.waybillNumber,
          keyName:this.ruleForm.keyName,
          accountUserList:this.ruleForm.accountUserList.join(),
          createTime: this.ruleForm.createTime,
          endTime: this.ruleForm.endTime,
          receiveSolt:this.ruleForm.receiveSolt,
          endSolt:this.ruleForm.endSolt
        })
      },
      chat(id, sender,val) {

        this.handleId = id;
        this.senderId = sender;
        this.dialogVisibleChat = true;
        this.handleErrorVal= val
        this.getChatInfo(id);


      },
      getChatInfo(id) {
        $axios.request({
          url: '/express/service/reply/' + id,
          method: 'get',
          data: {
            page: 1,
            size: 1000000,
          },
          statu: 1,
          _this: this,
          success: res => {
            this.chatData = res.data.records;
            this.chatData.reverse();
            setTimeout(() => {
              this.$refs.main.scrollTop = this.$refs.main.scrollHeight + 40;
            }, 100)
            this.customerData.forEach(v=>{
              if(id==v.id){
                v.replyNum=0;
              }
            })
          },
          fail: e => {
            console.log(e);
          }
        })
      },
      chatEnd() {
        if (this.textarea === '' || this.textarea === null || this.textarea === undefined) {
          this.$message({
            type: 'warning',
            message: '回复内容不能为空',
            duration: 500,
          });
        } else {
          $axios.request({
            url: '/express/service/reply/' + this.handleId,
            method: 'post',
            _this: this,
            statu: 2,
            data: {
              content: this.textarea
            },
            success: res => {
              this.getChatInfo(this.handleId);

              this.customerData.forEach(v=>{
                if( v.id==res.data.id){
                 v.receiveTimeSolt =dateCompare(res.data.createTime,res.data.receiveTime);
                  v.receiveTime = res.data.receiveTime
                }
              })

              this.textarea = '';
              setTimeout(() => {
                this.$refs.main.scrollTop = this.$refs.main.scrollHeight + 40;
              }, 100)
            },
            fail: () => {

            }
          })
        }
      },
    },
    mounted() {
      this.getErrorType()
      this.getAccount()
      this.getCustomerInfo({
        page: this.currentPage,
        size: this.pageSize,
        type: this.ruleForm.typeId,
        status: this.ruleForm.customerErrorType,
        waybillNumber: this.ruleForm.waybillNumber,
        keyName:this.ruleForm.keyName,
        accountUserList:this.ruleForm.accountUserList.join(),
        createTime: this.ruleForm.createTime,
        endTime: this.ruleForm.endTime,
        receiveSolt: this.ruleForm.receiveSolt,
        endSolt: this.ruleForm.endSolt
      })
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

  .kd-index-header-right{
    display: inline-block;
    width: 70%;
    margin-left: 28%;
    .kd-index-header-card-item{
      height: 80px;
      margin-left: 15px;
      border: 1px solid #ededed;
      .kd-index-header-card-item-left{

        width: 100%;
        height: 80px;
        text-align: center;
        line-height: 100px;
        color: #ffffff;
        .kd-index-header-card-item-left-icon{
          font-size: 40px;

        }
      }
      .kd-index-header-card-item-right{
        text-align: center;
        margin-top: 20px;
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



  .kd-customer-container {
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .kd-customer-right {
    box-sizing: border-box;
    background-color: #fff;
    height: 890px;
    padding: 5px 10px 0px 20px;
    .kd-customer-right-header {
      margin-bottom: 5px;
    }
    .kd-customer-content {
      width: 100%;
      height: 630px;
      .kd-customer-main {
        margin-top: 3px;
        .kd-customer-main-all {
          height: 700px;
          overflow-y: auto;
          overflow-x: hidden;
          box-sizing: border-box;
          padding-left: 10px;
          color: #555555;
        }
        .kd-customer-right-title {
          font-size: 15px;
          font-weight: 700;
        }
        .client-customer-pag {
          margin-top: 10px;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        .kd-customer-item {
          margin-top: 20px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          border-radius: 5px;
          box-shadow: 0 2px 12px 1px rgba(0, 0, 0, .2);
          padding: 0 0 5px 0;
          .kd-customer-item-main {
            padding: 10px;
            line-height: 25px;
            min-height: 100px;
            letter-spacing: 1px;

          }
          .kd-customer-footer {
            border-top: 1px solid #ededed;
            margin-top: 5px;
            text-align: center;
            box-sizing: border-box;
            padding-top: 5px;
          }
          .kd-customer-item-title {
            background-color: #f5f7fa;
            height: 40px;
            line-height: 40px;
            font-weight: 700;
            padding-left: 10px;
          }

          p {
            font-size: 13px;
          }
        }
      }
      .kd-customer-search {
        width: 100%;
        .kd-customer-search-title {
          font-size: 14px;
          font-weight: 700;
        }
        .search-title-width {
          width: 250px;
        }
      }
    }

  }

  .kd-customer-main-title {
    font-size: 14px;
    font-weight: 700;
  }

  .kong {
    width: 100%;
    height: 30px;
  }

  .kd-customer-service {
    height: 550px;
    border: 1px solid #ededed;
    .kd-customer-service-main {
      height: 430px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      background-color: #f5f5f5;
      padding: 10px 20px 10px 20px;
      margin-top: -30px;
      .kd-customer-service-main-item {
        margin-top: 10px;
      }
      .kd-customer-sercive-text {
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
      .kd-customer-sercive-text-left {
        background-color: #fff;
      }
      .kd-customer-sercive-text-right {
        background-color: #9eea6a;
        margin-right: 5px;
      }
    }
    .kd-customer-service-footer {
      height: 150px;
      position: relative;
      .kd-customer-service-footer-btn {
        position: absolute;
        bottom: 5px;
        right: 20px;
      }
    }
  }

  .kh-customer-sercive-img-left {
    margin-right: 5px;
  }
</style>
