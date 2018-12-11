<template>
  <section class="kd-user-container">
    <el-card class="kd-user-left">
      <div slot="header" class="clearfix">
        <span class="iconfont icon-users  kd-user-title">客户列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="transferUserBut">移动客户</el-button>
      </div>
      <div>
        <el-input
          placeholder="输入客户名查询"
          v-model="filterText"
          prefix-icon="el-icon-search"
          style="width: 90%;margin-left: 5%;height: 30px"
        >
        </el-input>
        <br><br>

        <el-tree
          :data="treeData"
          :props="defaultProps"
          :indent="indetNum"
          node-key="id"
          :default-expanded-keys="arrUserList"
          :highlight-current="true"
          accordion
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="tree2"
        >
                <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="iconfont icon-iconset0450  kd-user-size" v-if="data.platformId!==3">  &nbsp{{ node.label }}</span>
                    <span class="iconfont icon-addressbook_fill kd-user-size" v-if="data.platformId===3">  &nbsp{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.platformId!==3"
            type="text"
            size="mini"
            icon="el-icon-edit-outline"
            @click="() => lookInfo(node, data)">
          </el-button>
          <el-button
            v-if="data.platformId!==3"
            type="text"
            size="mini"
            icon="el-icon-circle-plus"
            @click="() => zzw(node, data)">
          </el-button>
          <el-button
            @click.stop
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click="() =>deleteKh(node, data)">
          </el-button>
        </span>
      </span>

        </el-tree>
      </div>
    </el-card>
    <el-card class="kd-user-right">
      <div slot="header" class="clearfix" style="margin-top: -10px;line-height: 28px">
        <span class="iconfont icon-addressbook_fill  kd-user-title">客户信息</span>


        <el-button style="float: right; " type="danger" v-if="platformId===3&&freezeStatus===1" @click="freeze(id)"
                   size="mini" :loading="djLoading">冻结
        </el-button>
        <el-button style="float: right; " type="primary" v-if="platformId===3&&freezeStatus===0" @click="freeze(id)"
                   size="mini" :loading="djLoading">解冻
        </el-button>
        <el-button style="float: right;margin-right: 15px " type="success" v-if="platformId===3" @click="editUserInfo(id)"
                   size="mini">编辑
        </el-button>
      </div>
      <div v-if="platformId===3" v-loading="infoLoading"  class="kd-user-right-main" >
        <div class="kd-user-right-info ">
          <p> <i class="el-icon-document"></i> &nbsp;公司名称：{{userInfoData.companyName}}</p>
          <p><i class="el-icon-location-outline"></i> &nbsp;公司地址：{{userInfoData.address}}</p>
          <p><i class="el-icon-location-outline"></i> &nbsp;所在省市区：{{userInfoData.province}}{{userInfoData.city}}{{userInfoData.area}}</p>
          <p> <i class="el-icon-phone-outline"></i>&nbsp;联系号码：{{userInfoData.telephone}}</p>
          <p><i class="icon-addressbook"></i> &nbsp;联系人：{{userInfoData.personInCharge}}</p>
          <p><i class="el-icon-message"></i> &nbsp;邮箱：{{userInfoData.email}}</p>
          <p> <i class="el-icon-document"></i>&nbsp;账号：{{username}}</p>
          <p> <i class="el-icon-document"></i>&nbsp;昵称：{{userInfoData.name}}</p>
          <p><i class="el-icon-date"></i> &nbsp;注册时间：{{userInfoData.createTime}}</p>
          <el-button  type="success"  @click="passwordReset()" size="mini">
            重置密码
          </el-button>
        </div>
        <div class="kd-user-right-change">
          <span class="iconfont icon-addressbook_fill  kd-user-title">绑定客户账单店铺名称</span>
        </div>
        <div class="kd-user-right-tag">
          <el-tag
            style="margin-right: 10px"
            :key="tag.id"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag.keyword}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            style="width: 100px"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>

        </div>
        <div class="kd-user-right-change  clearfix">
          <span class="iconfont icon-addressbook_fill  kd-user-title">添加特殊定价组</span>

          <el-button type="primary" size="mini"  @click="specialDialogFormVisible=true">添加关键词</el-button>
          <br>
          <br>
          <el-tabs v-model="specialCityListValue" type="border-card" @tab-click="specialHandleClick">
            <el-tab-pane :label="item.keyName" :name="item.id.toString()"  v-for="(item,index) in specialCityList">
              <span v-if="item.status==1">
                特殊定价方式:<el-tag  type="warning">取代定价</el-tag>
              </span>
              <span v-else>
               特殊定价方式:<el-tag type="danger">追加定价</el-tag>
              </span>
              <br>
              <br>
              <div class="kd-user-collapse-content clearfix " >
                <div class="kd-user-collapse fl" style="width: 39%">
                  <div class="kd-user-collapse-title  clearfix">首重
                    <el-button type="primary" size="mini" class="fr" style="margin-top: 10px;margin-right: 10px"
                               v-if="replaceStatus===true" @click="addPriceList(1)">添加
                    </el-button>
                  </div>
                  <el-table :data="firstTableData" style="width: 100%">
                    <el-table-column prop="name" label="重量区间(KG)" width="200">
                      <template slot-scope="scope">
                        <span v-if="replaceStatus===false">{{scope.row.areaBegin}}-{{scope.row.areaEnd}}</span>
                        <div v-if="replaceStatus===true" class="clearfix">
                          <p class="fl" style="width: 50px;height: 32px;line-height: 32px" size="small">
                            {{scope.row.areaBegin}}</p>
                          <p class="fl" style="width: 50px;height: 32px;line-height: 32px">-</p>
                          <el-input v-model="scope.row.areaEnd" class="fl   weight-input-width-first"  size="small"
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
                <div class="kd-user-collapse fl" style="width: 59%;">
                  <div class="kd-user-collapse-title  clearfix">续重（末区间峰值“~”默认为无穷）
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
                          <el-input v-model="scope.row.areaEnd===1000000?'~' :scope.row.areaEnd" class="fl  weight-input-width-first "
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
                        <el-input v-model="scope.row.weightStandard" @blur="weightStandardBlur(scope.row.weightStandard)" v-if="replaceStatus===true" class="weight-input-width"
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
              <div class="kd-user-collapse-btn  clearfix">
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
        <div class="kd-user-right-change  clearfix">
          <span class="iconfont icon-addressbook_fill  kd-user-title">添加定价组</span>

          <el-button type="primary"  size="mini"  @click="testAddCalculationBtn">批量添加定价组</el-button>
          <el-button type="primary"  size="mini"  @click="testCalculationBtn">试算定价</el-button>

          <el-button type="primary"  size="mini"  @click="testExcelCalculationBtn">定价表格上传</el-button>

          <el-button type="primary" class="fr" size="mini" v-if="addStatus" @click="appendPricingGroup">以其他客户定价为模板增加</el-button>
          <el-select v-model="addUserClassSelect" filterable placeholder="请选择" v-if="!addStatus" size="small" class="fr"
                     @change="appendPricingGroupChange">
            <el-option
              v-for="item in addUserClassOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <el-collapse v-model="activeName"  accordion @change="getCityListInfo">
          <el-collapse-item :name="item.id" v-for="item in cityPriceData">
            <template slot="title">
              <el-row>
                <el-col :span="3">{{item.provinceName}}</el-col>
                <el-col :span="3">
                  <i class="header-icon el-icon-info" v-if="item.status===false" style="color: #f56c6c;"> 暂无定价</i>
                </el-col>
              </el-row>
            </template>
            <div v-loading="priceLoading">
              <div class="kd-user-collapse-select clearfix">
                <el-select v-model="historyData" clearable placeholder="请选择" class="fr" v-if="replaceStatus===true"
                           style="margin-bottom: 10px;margin-right: 20px;" @change="historyCityChange">
                  <el-option
                    v-for="item in historyOptions"
                    :key="item.provinceName"
                    :label="item.provinceName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div class="kd-user-collapse-content clearfix ">
                <div class="kd-user-collapse fl" style="width: 39%">
                  <div class="kd-user-collapse-title  clearfix">区间定价组
                    <el-button type="primary" size="mini" class="fr" style="margin-top: 10px;margin-right: 10px"
                               v-if="replaceStatus===true" @click="addPriceList(1)">添加
                    </el-button>
                  </div>
                  <el-table :data="firstTableData" style="width: 100%">
                    <el-table-column prop="name" label="重量区间(KG)" width="200">
                      <template slot-scope="scope">
                        <span v-if="replaceStatus===false">{{scope.row.areaBegin}}-{{scope.row.areaEnd}}</span>
                        <div v-if="replaceStatus===true" class="clearfix">
                          <p class="fl" style="width: 50px;height: 32px;line-height: 32px" size="small">
                            {{scope.row.areaBegin}}</p>
                          <p class="fl" style="width: 50px;height: 32px;line-height: 32px">-</p>
                          <el-input v-model="scope.row.areaEnd" class="fl  weight-input-width-first"  size="small"
                                    @change="cityEndChange(scope.$index,scope.row.areaEnd,scope.row.areaBegin)"></el-input>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="address" label="金额(元)" >
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
                <div class="kd-user-collapse fl" style="width: 59%;">
                  <div class="kd-user-collapse-title  clearfix">首重+续重-区间定价组（末区间峰值“~”默认为无穷）
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
                          <el-input v-model="scope.row.areaEnd===1000000?'~' :scope.row.areaEnd" class="weight-input-width-first  fl"
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
                        <el-input v-model="scope.row.weightStandard" @blur="weightStandardBlur(scope.row.weightStandard)" v-if="replaceStatus===true" class="weight-input-width"
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
              <div class="kd-user-collapse-btn  clearfix">
                <el-button size="small" type="primary" style="margin-top: 10px"
                           v-if="firstTableData.length>0&&replaceStatus===false" @click="replacePrice(1)">修改
                </el-button>
                <el-button size="small" type="primary" style="margin-top: 10px"
                           v-if="firstTableData.length===0&&replaceStatus===false" @click="replacePrice(1)">增加
                </el-button>
                <el-button size="small" type="primary" v-if="replaceStatus===true" style="margin-top: 10px"
                           @click="submitPrice(firstTableData,thenTableData,1)">提交
                </el-button>
                <el-button size="small" v-if="replaceStatus===true" style="margin-top: 10px" @click="canelPrice">取消
                </el-button>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

      </div>
    </el-card>

   <el-dialog :visible.sync="transferUser" @close="noUserListData" title="移动客户" center width="50%">
     <div style="margin-left: 22%">
      <!--<p style="font: 16px Extra large;font-weight: bold;text-align: center"><i class="el-icon-edit"></i>请选择需转移的客户归属的分支</p>-->
      <div  style="padding-top: 20px;padding-bottom: 35px;margin-left: 0%" >
        使
        <el-cascader
          expand-trigger="hover"
          :props="defaultProps"
          :options="expressUsersList"
          :show-all-levels="false"
          filterable
          :change-on-select="true"
          v-model="selectedUserOptions1"
          @change="handleChangeExpressUsersList">
        </el-cascader>
        的客户移至
        <el-cascader
          expand-trigger="hover"
          :show-all-levels="false"
          filterable
          change-on-select
          :props="defaultProps"
          :options="expressUsersList"
          v-model="selectedUserOptions2"
          >
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="noUserListData" size="small">取 消</el-button>
        <el-button type="primary" @click="yesUserListData()"  size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="testCalculation">
      <p style="font: 16px Extra large;font-weight: bold"><i class="el-icon-edit"></i>请选择模板目的地</p>
      <div  style="padding-top: 20px;padding-bottom: 35px">
        模板目的地:
        <el-select v-model="optionscityValue" placeholder="请选择">
          <el-option
            v-for="item in cityPriceData"
            :key="item.id"
            :label="item.provinceName"
            :value="item.id">
            <span style="float: left">{{ item.provinceName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              <el-tag size="medium" type="info" v-if="!item.status">未定价</el-tag>
              <el-tag size="danger" type="info" v-if="item.status">已定价</el-tag>
            </span>
          </el-option>
        </el-select>
      </div>
      <p style="font: 16px Extra large;font-weight: bold"><i class="el-icon-edit"></i>请选择与模板目的地相同的省份</p>
      <div style="padding-top: 20px;padding-bottom: 35px">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入城市拼音"
          :titles="['城市', '已选城市']"
          v-model="value2"
          :data="data2">
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noTestAddCalculation" size="small">取 消</el-button>
        <el-button type="primary" @click="yesTestAddCalculation()"  size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="testWeightValue">
      <div  style="padding-top: 20px;padding-bottom: 35px">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="重量(kg):">
            <el-input v-model="formInline.testWeight" placeholder="请输入重量（kg）">
              kg
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitWeight" :loading="calculation">试算</el-button>
          </el-form-item>
        </el-form>
      </div>
      <p style="font: 16px Extra large;font-weight: bold"><i class="el-icon-edit"></i>试算的省份价格</p>
      <el-table
        :data="tableCityListData.filter(data => !search || data.destination.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;font-size: 15px"
        max-height="450"
        border
        stripe>
        <el-table-column
          label="省份"
          align="center"
          size="16px"
          prop="destination">
          <template slot-scope="scope">
            <el-tag
              type="warning"
              disable-transitions>{{scope.row.destination}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column

          label="是否已定价"
          align="center"
          size="16px"
          prop="offer"
          :filters="filtersList"
          :filter-method="filterTag"
          :filter-multiple="multiple"
        >
          <template slot-scope="scope">
            <el-tag
              disable-transitions
              v-if="scope.row.offer!=0"
            >已定价</el-tag>
            <el-tag
              type="info"
              disable-transitions
              v-if="scope.row.offer==0"
            >暂无定价或无结果</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="价格（元）"
          prop="offer"
          align="center">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              disable-transitions>￥{{scope.row.offer}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="excelCalculation" title="定价表格上传"  @close='closeDialog'>
      <el-row>
        <el-col :span="11">
          <a href="http://www.funwl.com:8090/total/定价模板.xlsx" target="_blank">
            <img src="../../assets/images/excel.png" style="height: 130px;width: 100px;margin-left: 120px;margin-top:13px;text-align: center" alt="" >
            <p style="width:200px;margin:0 auto;color: #3a8ee6;text-decoration:underline">点击下载定价模板表格</p>
          </a>
        </el-col>
        <el-col :span="13">
          <el-upload
            style="margin-left: 50px;margin-top: 50px"
            ref="uploadExcel"
            class="upload-demo"
            :action="importExcel+id"
            :headers="headers"
            :on-success="importExcelSuccess"
            :multiple="false"
            :auto-upload="false"
            :on-change="fileListChange"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="importExcelBefore" :disabled="changeBoolean">上传</el-button>
            <div slot="tip" class="el-upload__tip">不超过500kb,且只能上传xls/xlsx文件</div>
          </el-upload>
        </el-col>
      </el-row>
      <div v-if="errorTotalList.length>0">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="text-align: center;">
            <span>表格错误内容</span>
          </div>
          <div v-for="item in errorTotalList" class="text item">
            {{item}}
          </div>
        </el-card>
      </div>
    </el-dialog>
    <el-dialog
      title="分支信息"
      :visible.sync="dialogVisibleFz"
      width="30%"
    >
      <div class="fz-dialog-content">
        <el-form :model="payInfoObj">
          <el-form-item label="昵称" :label-width="formLabelWidth">
            <el-input v-model="fzObj.name" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="负责人" :label-width="formLabelWidth">
            <el-input v-model="fzObj.personInCharge" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="机构名" :label-width="formLabelWidth">
            <el-input v-model="payInfoObj.typeName" autocomplete="off" :disabled="fzInfoStatus"></el-input>
          </el-form-item>
          <el-form-item label="账户名" :label-width="formLabelWidth">
            <el-input v-model="payInfoObj.payee" autocomplete="off" :disabled="fzInfoStatus"></el-input>
          </el-form-item>
          <el-form-item label="付款账号" :label-width="formLabelWidth">
            <el-input v-model="payInfoObj.paymentAccount" autocomplete="off" :disabled="fzInfoStatus"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fzPayInfoCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="fzInfoStatus = false" size="small"  v-if="fzInfoStatus===true">修改</el-button>
        <el-button type="primary" @click="fzInfoChange" size="small" v-if="fzInfoStatus===false"  :loading="fzInfoLoading">确 定</el-button>

  </span>
    </el-dialog>
    <el-dialog title="特殊定价组关键词" :visible.sync="specialDialogFormVisible"   width="30%">

      <br><br>
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
    <el-dialog :visible.sync="dialogFormEditUserInfo" @close="resetUserInfo('ruleForm2')"  title="编辑客户信息">
      <div class="register">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="box" size="medium"
                 status-icon>

          <el-form-item label="公司名称" prop="companyName" class="fn-user-form-item">
            <el-input v-model="ruleForm2.companyName" placeholder="请输入用户公司名称"
                      prefix-icon="iconfont icon-users"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name" class="fn-user-form-item">
            <el-input v-model="ruleForm2.name" placeholder="请输入昵称" prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone" class="fn-user-form-item">
            <el-input v-model="ruleForm2.telephone" placeholder="请输入联系号码" class="wid"
                      prefix-icon="el-icon-phone"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="personInCharge" class="fn-user-form-item">
            <el-input v-model="ruleForm2.personInCharge" placeholder="请输入用户公司负责人"
                      prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email" class="fn-user-form-item">
            <el-input v-model="ruleForm2.email" placeholder="请输入用户邮箱" prefix-icon="el-icon-share"></el-input>
          </el-form-item>

          <el-form-item label="所在区域"  class="fn-user-form-item">
            <div class="block">
              <el-cascader
                size="medium"
                expand-trigger="hover"
                :options="options"
                v-model="defaultCity"
                @active-item-change="handleItemChange"
                :props="props"
                @change="handleChange"
                class="city-width">
              </el-cascader>
            </div>
          </el-form-item>

          <el-form-item label="详细地址" prop="address" class="fn-user-form-item">
            <el-input v-model="ruleForm2.address" placeholder="请输入详细地址" prefix-icon="el-icon-location"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetUserInfo('ruleForm2')" size="small">取 消</el-button>
        <el-button type="primary" @click="submitUserInfoForm('ruleForm2')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible" @close='closeDialog'>
      <div class="kd-user-tab">
        <el-radio-group v-model="radio" size="small">
          <el-radio-button label="客户"></el-radio-button>
          <el-radio-button label="分支"></el-radio-button>
          <el-radio-button label="表格上传客户"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="register" v-if="radio==='客户'">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="box" size="medium"
                 status-icon>
          <el-form-item label="账号" prop="username" class="fn-user-form-item">
            <el-input v-model="ruleForm2.username" placeholder="请输入账号" prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName" class="fn-user-form-item">
            <el-input v-model="ruleForm2.companyName" placeholder="请输入用户公司名称"
                      prefix-icon="iconfont icon-users"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name" class="fn-user-form-item">
            <el-input v-model="ruleForm2.name" placeholder="请输入昵称" prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone" class="fn-user-form-item">
            <el-input v-model="ruleForm2.telephone" placeholder="请输入联系号码" class="wid"
                      prefix-icon="el-icon-phone"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="personInCharge" class="fn-user-form-item">
            <el-input v-model="ruleForm2.personInCharge" placeholder="请输入用户公司负责人"
                      prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱"  class="fn-user-form-item">
            <el-input v-model="ruleForm2.email" placeholder="请输入用户邮箱" prefix-icon="el-icon-share"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass" class="fn-user-form-item">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码"
                      class="wid" prefix-icon="iconfont icon-mima1"></el-input>
          </el-form-item>
          <el-form-item label="所在区域" prop="cityList" class="fn-user-form-item">
            <div class="block">
              <el-cascader
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
        </el-form>
      </div>
      <div class="register" v-if="radio==='分支'">
        <el-form :model="ruleForm2" :rules="rules1" ref="ruleForm2" label-width="100px" class="box" size="medium"
                 status-icon>
          <el-form-item label="分支名" prop="name" class="fn-user-form-item">
            <el-input v-model="ruleForm2.name" placeholder="请输入分支名" prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="personInCharge" class="fn-user-form-item">
            <el-input v-model="ruleForm2.personInCharge" placeholder="请输入用户公司负责人"
                      prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="typeName" class="fn-user-form-item">
            <el-input v-model="ruleForm2.typeName" placeholder="如：支付宝/微信/宁波银行"
                      prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="账户名" prop="payee" class="fn-user-form-item">
            <el-input v-model="ruleForm2.payee" placeholder="如：张三"
                      prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
          <el-form-item label="付款账号" prop="paymentAccount" class="fn-user-form-item">
            <el-input v-model="ruleForm2.paymentAccount" placeholder="请输入付款账号"
                      prefix-icon="iconfont icon-ren"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="register" v-if="radio==='表格上传客户'">

        <el-row>
          <el-col :span="11">
            <a href="https://funwl.oss-cn-hangzhou.aliyuncs.com/template/%E7%94%A8%E6%88%B7%E6%A8%A1%E6%9D%BF.xlsx" target="_blank">
              <img src="../../assets/images/excel.png" style="height: 130px;width: 100px;margin-left: 120px;margin-top:13px;text-align: center" alt="" >
              <p style="width:200px;margin:0 auto;color: #3a8ee6;text-decoration:underline">点击下载用户模板表格</p>
            </a>
          </el-col>
          <el-col :span="13">
            <el-upload
              ref="upload"
            class="upload-demo"
            drag
            :action="importUser+id"
            :headers="headers"
            :on-success="importUserSuccess"
            multiple>
              <div class="el-upload__text" >用户初始密码为：<span style="color: #00a0f0;font-size: 16px">123456</span></div>
            <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><p>只能上传xls/xlsx，且不超过1mb</p></div>

          </el-upload>
          </el-col>
        </el-row>
        <div v-if="errorUserList.length>0">
          <el-card class="box-card">
            <div slot="header" class="clearfix" style="text-align: center;">
              <span>表格错误内容</span>
            </div>
            <div v-for="item in errorUserList" class="text item">
              {{item}}
            </div>
          </el-card>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" v-if="radio!='表格上传客户'">
        <el-button @click="resetForm('ruleForm2')" size="small">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="djCenterDialogVisible"
      width="30%"
      center>
      <span>是否也需要复制特殊定价组：</span>
      <el-radio v-model="radioYes" label="1" border>需要</el-radio>
      <el-radio v-model="radioYes" label="2" border>不需要</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="djCenterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="djCenterDialogVisibleBut">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import city from '../../assets/city/city.js';
  import {isvalidPhone} from '../../assets/js/validate'
  import $axios from '../../api/api'
  import {baseSrc} from '../../api/api'

  export default {
    name: "user",
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
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
          if (this.ruleForm2.checkPass !== '') {
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
        djCenterDialogVisible:false,
        djVal:'',
        radioYes:'2',
        UserListProps:{
          label: 'name',
          key: 'id',
          pinyin: 'name'
        },
        UserListData:[],
        selectedUserOptions1:[],
        selectedUserOptions2:[],
        transferUser:false,
        errorTotalList:[],
        //编辑客户信息
        dialogFormEditUserInfo:false,

        filterText: '',
        changeBoolean:true,
        radioPrice:'1',
        multiple:false,
        filtersList:[{ text: '无结果', value: '0' },{ text: '已定价', value: '1' }],
        headers:{
          'Authorization': sessionStorage.getItem('funwlToken')
        },

        tableCityListData: [],
        search: '',
        //表格上传服务器url
        importUser:baseSrc+"/express/importUser/",

        importExcel:baseSrc+'/express/pricingGroup/importPrice/',
        //试算重量
        formInline: {
          testWeight:"",
        },
        calculation: false,
        testWeightValue:false,
        excelCalculation:false,
        testCalculation:false,
        data2: [],
        value2: [],
        valueUser:[],
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        },
        optionscity: [],
        optionscityValue:'',
        expressUsers:'',
        expressUsersList:[],

        radio: '客户',
        dialogFormVisible: false,
        rules1: {
          name: [
            {required: true, message: '分支名不能为空哦！', trigger: 'change'}
          ],
          payee: [
            {required: true, message: '账户名不能为空哦！', trigger: 'change'}
          ],
          paymentAccount: [
            {required: true, message: '付款不能为空哦！', trigger: 'change'}
          ],
          typeName: [
            {required: true, message: '机构名称 不能为空哦！', trigger: 'change'}
          ],
          personInCharge: [
            {required: true, message: '用户公司负责人不能为空哦！', trigger: 'change'}
          ],
        },
        rules2: {
          username: [
            {required: true,validator: validateChina, trigger: 'change'},
          ],
          name: [
            {required: true, message: '昵称不能为空哦！', trigger: 'change'}
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
            {required: true, validator: validatePass, trigger: 'change'}
          ],
          checkPass: [
            {required: true, validator: validatePass2, trigger: 'change'}
          ],
        },
        options: [],
        props: {
          value: 'label',
          children: 'cities'
        },
        id: 0,
        ruleForm2: {
          password: '',
          checkPass: '',
          cityList:[]
        },
        indetNum: 23,
        treeData: [],
        defaultProps: {
          children: 'sysUserInfos',
          label: 'name',
          value: 'id'
        },
        nodeObj: {},
        nodeData: {},
        userInfoData: {},
        username:"",
        platformId: -1,
        freezeStatus: false,
        djLoading: false,
        infoLoading: false,
        //
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        activeName: '',
        activeClassIcon:{
          bool:false,
          name:'展开',
          classIcon:'el-icon-arrow-down'
        },
        firstTableData: [],
        replaceStatus: false,
        historyData: '',
        historyOptions: [],
        cityPriceData: [],
        thenTableData: [],
        cityInfoId: 0,
        priceLoading: false,
        addStatus: true,
        addUserClassSelect: '',
        addUserClassOptions: [],
        dialogVisibleFz: false,
        fzObj: {},
        payInfoObj: {},
        formLabelWidth: '100px',
        fzInfoStatus: true,
        fzInfoLoading:false,
        //特殊定价组
        specialCityList:[],
        specialCityListValue:'1',
        specialDialogFormVisible:false,
        specialForm:{},
        specialRules:{
          specialName: [
            {required: true, message: '关键词不能为空哦', trigger: 'change'}
          ],
        },
        specialStatus:1,
        deleteSpecialLoading:false,
        //上传用户模板时  错误信息记录
        errorUserList:[],
        defaultCity:[],
        //用户默认展开分支
        arrUserList:[]
      }
    },
    methods: {
      transferUserBut(){
        this.transferUser = true;
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
      //密码重置
      passwordReset(){
        this.$confirm('重置该客户密码为：123456, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.request({
            url: '/express/password/reset/'+this.id,
            method: 'post',
            _this: this,
            statu: 2,
            success: res => {
              this.$message({
                message: '密码重置成功',
                type: 'success',
                duration:1000,
              });
            },
            fail: res => {
              console.log(res);
            }
          })
        }).catch(() => {
        });


      },
      editUserInfo(id){
        this.id = id
        this.ruleForm2 = this.userInfoData;
        this.defaultCity.push(this.userInfoData.province)
        this.defaultCity.push(this.userInfoData.city)
        this.defaultCity.push(this.userInfoData.area)
        this.dialogFormEditUserInfo=true;
      },
      filterNode(value, data) {
        console.log(data)
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      weightStandardBlur(val){
        console.log(66666)
        console.log(val)
        if(val==0){
          this.$message.error({
            message: '重量进制不能为0!',
            duration:1000,
          });
        }

      },

    //关闭closeDialog弹出框回调
      closeDialog(){
        this.errorUserList=[]
        this.errorTotalList=[]
        /*this.$refs.uploadExcel.clearFiles();*/
      },

      //判断是否已定价过滤
      filterTag(value, row,column) {
        if(value==0){
          return row.offer == value;
        }else {
          return row.offer != value && row.offer!=0;
        }
      },
      //表格定价上传
      importExcelBefore(){

        let bool = false
        this.cityPriceData.forEach(v=>{
          if(v.status){
            bool = true
          }
        })
        if(bool){
          this.$confirm('已经有录入完成的定价省份，若有相同定价省份会替换原有定价，是否确定', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs.uploadExcel.submit();
          }).catch(() => {
          });
        }else {
          this.$refs.uploadExcel.submit();
        }
      },
      fileListChange(file, fileList){
        if(fileList.length>0){
          this.changeBoolean=false
        }
        else {
          this.changeBoolean=true
        }
      },
      //表格上传定价成功回调
      importExcelSuccess(res,file,fileList){
        if(res.code==0){
          this.getPriceCity();
          this.$message({
            type: 'success',
            message: '上传成功!',
            duration:1000,
          });
        }else {
          if(res.code==10008){
            sessionStorage.clear();
            this.$router.push({path: '/login'});
            return;
          }else{
            this.$message({
              type: 'warning',
              message: res.info,
              duration:1000,
            });
            this.errorTotalList=res.data
          }
        }
        this.$refs.uploadExcel.clearFiles();
      },
      //表格批量上传客户信息上传成功时的钩子
      importUserSuccess(res,file,fileList){
        this.errorUserList = []
        if(res.code==0){
          this.getUserList();
          this.$message({
            type: 'success',
            message: '上传成功!',
            duration:1000,
          });
        }else {
          if(res.code==10008){
            sessionStorage.clear();
            this.$router.push({path: '/login'});
            return;
          }else{
            this.errorUserList = res.data
            this.$message({
              type: 'warning',
              message: res.info,
              duration:1000,
            });
          }
        }
        this.$refs.upload.clearFiles();

      },
      //定价表格上传弹窗
      testExcelCalculationBtn(){
        this.excelCalculation=true
      },

      //试算
      onSubmitWeight(){
        let _this = this;
        _this.calculation=true
        let date = {
          weight:_this.formInline.testWeight,
          userId:_this.id
        }
        $axios.request({
          url: '/express/total/getBudget',
          method: 'get',
          data: date,
          _this: this,
          statu: 1,
          success: res => {
            //this.testWeightValue = false;
            this.$message({
              type: 'success',
              message: '试算结果如下!',
              duration:800,
            });
            _this.tableCityListData = res.data
          },
          fail: res => {
            console.log(res);
          }
        })
        _this.calculation=false
      },
      //试算弹框
      testCalculationBtn(){
        this.formInline.testWeight=""
        this.tableCityListData=[]
        this.testWeightValue = true
      },

      //批量添加定价组
      testAddCalculationBtn(){
        let data = [];
        let cities = this.cityPriceData;
        cities.forEach((city, index) => {
          data.push({
            label: city.status?city.provinceName+'      已定价':city.provinceName,
            key: city.id,
            pinyin: city.provinceKey
          });
        });
        this.data2 = data;
        this.optionscity = data;
        this.testCalculation = true;
      },
      noTestAddCalculation(){
        this.testCalculation = false;
        this.value2 = []
        this.optionscityValue = ""
      },
      yesTestAddCalculation(){
        let _this = this;
        if(_this.optionscityValue==""){
          this.$message({
            type: 'warning',
            message: '请选择模板省份!',
            duration:800,
          });
          return;
        }
        let val = this.value2;
        if(val.length<1){
          this.$message({
            type: 'warning',
            message: '请添加需要复制的省份!',
            duration:800,
          });
          return;
        }
        let s = "";
        val.forEach((v,index)=>{
            s =s+","+v;
        })
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        $axios.request({
          url: '/express/pricingGroup/customer/'+s+"/"+_this.optionscityValue+"/"+_this.id,
          method: 'post',
          _this: this,
          statu: 2,
          success: res => {
            this.$message({
              type: 'success',
              message: '添加成功!',
              duration:800,
            });
            _this.value2 = []
            _this.optionscityValue = ""
            _this.getPriceCity();
            loading.close();
          },
          fail: res => {
            console.log(res);
          }
        })

      },
      //get
      getCity() {
        let smallObj = {};
        let bigObj = {};
        city.forEach(v => {
          bigObj = {
            label: v.name,
            value: v.name,
            cities: [],
          };
          v.city.forEach(n => {
            smallObj =
              {
                label: n.name,
                value: n.name,
                cities: [],
              }
            ;
            n.area.forEach(k => {
              smallObj.cities.push({
                label: k,
                value: k,
              })
            })
            bigObj.cities.push(smallObj)
          })
          this.options.push(bigObj);
        });
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
          },
          fail: res => {
            console.log(res);
          }
        })
      },
      getUserInfo(id) {
        this.infoLoading = true;
        $axios.request({
          url: '/express/cusmoters/' + id,
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.userInfoData = res.data.userInfo;
            this.username = res.data.user.username;
            this.freezeStatus = res.data.userInfo.status;
            setTimeout(() => {
              this.infoLoading = false;
            }, 200)
          },
          fail: e => {
            console.log(e);
            this.infoLoading = false;
          }
        })
      },
      getKeyword(id) {
        $axios.request({
          url: '/express/keyword/' + id,
          method: 'get',
          _this: this,
          statu: 2,
          success: res => {
            this.dynamicTags = res.data;
          },
          fail: r => {
            console.log(r);
          }

        })
      },
      getPriceCity() {
        $axios.request({
          url: '/express/pricingGroup/cityList/' + this.id,
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.cityPriceData = res.data;
          },
          fail: res => {
            console.log(res);
          }
        })
      },
      getCityListInfo(id) {
        console.log(id)
        this.specialCityListValue=""
        if (id) {
          this.priceLoading = true;
          this.cityInfoId = id;
          this.historyData = '';
          this.getHistoryInfo();
          $axios.request({
            url: '/express/pricingGroup/' + this.id + '/' + id,
            method: 'get',
            _this: this,
            statu: 1,
            success: res => {
              this.firstTableData = res.data.firstWeight;
              res.data.continuedWeight.forEach(v => {
                if (v.areaEnd == 1000000) {
                  v.areaEnd = '~'
                }
              });
              this.thenTableData = res.data.continuedWeight;

              this.priceLoading = false;
            },
            fail: r => {
              console.log(r)
              this.priceLoading = false;
            }
          })
        }
      },
      getHistoryInfo() {
        $axios.request({
          url: '/express/pricingGroup/upload/' + this.id,
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.historyOptions = res.data;
          },
          fail: error => {
            console.log(error);
          }
        })
      },
      getUserListInfo() {
        $axios.request({
          url: '/express/pricingGroup/customers',
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            this.addUserClassOptions = res.data;
          },
          fail: error => {

          }
        })
      },
      getPayInfo(id) {
        $axios.request({
          url: '/express/pay/' + id,
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            console.log(res);
            if (res.data) {
              this.payInfoObj = res.data;
            } else {
              this.payInfoObj = {
                payee: '如:张三',
                paymentAccount: '如:6228 8792 xxxx xxxx',
                typeName: '如:支付宝/微信/工商银行'
              }
            }
          },
          fail: r => {
            console.log(r)
          }
        })
      },
      //获取特殊定价组关键字
      getSpecialCityList(){
        $axios.request({
          url:'/express/pricingGroup/specialKey/'+this.id,
          method:'get',
          statu:1,
          _this:this,
          success:res=>{
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
          _this:this,
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

      //play
      //用户列表
      handleNodeClick(data) {
        this.id = data.id;
        this.getPriceCity();
        this.getHistoryInfo();
        this.getSpecialCityList();

        if (data.platformId === 3) {
          this.platformId = 3
          this.getUserInfo(data.id)
          this.getKeyword(data.id);
          this.activeName = '';

        } else {
          this.platformId = -1
        }
      },
      zzw(a, b) {
        this.nodeObj = a;
        this.nodeData = b;
        $axios.request({
          url: '/express/pay/' +b.id,
          method: 'get',
          statu: 1,
          _this: this,
          success: res => {
            if (res.data) {
              this.id = b.id;        this.dialogFormVisible = true;

            } else {
              this.$message({
                type: 'warning',
                message: '请先填写付款机构',
                duration:500,
              });
            }
          },
          fail: r => {
            console.log(r)
          }
        })


      },
      lookInfo(a, b) {
        this.fzObj = b;
        this.getPayInfo(b.id);
        this.dialogVisibleFz = true;
      },
      fzPayInfoCancel(){
        this.getPayInfo(this.fzObj.id);
        this.dialogVisibleFz = false;
        this.fzInfoStatus = true;


      },
      handleItemChange(val) {
        console.log()

      },
      handleChange(value) {
        console.log(value)
      },
      handleChangeExpressUsersList(value){
        if(value.length<1){
          value=[-1]
        }
        let id = value[value.length - 1]
        $axios.request({
          url: '/express/branchUsers/' +id,
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.UserListData = res.data;
          },
          fail: r => {
            console.log(r)
          }
        })
      },
      yesUserListData(){

        let toUser = ''
        let fromUser = ''
        let user1 =this.selectedUserOptions1
        let user2 =this.selectedUserOptions2
        if(user1.length<1||user2.length<1){
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
        toUser=user2[user2.length-1]
        fromUser=user1[user1.length-1]
        if(toUser==fromUser){
          this.$message({
            type: 'warning',
            message: '两分支不能相同!',
            duration:800,
          });
          return
        }
        console.log(this.valueUser);
        let s = "";
        this.valueUser.forEach((v,index)=>{
          s =s+","+v;
        })
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        $axios.request({
          url: '/express/users/updataBranch/'+s+"/"+toUser,
          method: 'post',
          _this: this,
          statu: 2,
          success: res => {
            this.$message({
              type: 'success',
              message: '添加成功!',
              duration:800,
            });
            this.noUserListData()
            this.getUserList();
            loading.close();
          },
          fail: res => {
            console.log(res);
            loading.close();
          }
        })
      },
      noUserListData(){
        this.transferUser = false;
        //需要转移
        this.selectedUserOptions1=[]
        //转移到
        this.selectedUserOptions2=[]
        this.UserListData=[]
        this.valueUser=[]
      },
      freeze(id) {
        this.djLoading = true;
        $axios.request({
          url: '/express/user/frozen/' + id,
          method: 'post',
          statu: 2,
          _this: this,
          success: res => {
            if (this.freezeStatus === 1) {
              this.freezeStatus = 0;
            } else {
              this.freezeStatus = 1;
            }
            this.$message({
              type: 'success',
              message: '操作成功',
              duration:500,
            });
            this.djLoading = false;
          },
          fail: error => {
            console.log(error)
            this.djLoading = false;
          }
        })
      },
      fzInfoChange(){
        this.fzInfoLoading = true;
        $axios.request({
          url:'/express/pay/'+this.fzObj.id,
          method:'post',
          statu:2,
          data:this.payInfoObj,
          success:res=>{
            this.$message({
              type: 'success',
              message: '修改成功',
              duration:500,
            });
              this.dialogVisibleFz = false;
              this.fzInfoStatus = true;
            this.fzInfoLoading = false ;

          },
          fail:e=>{
            console.log(e);
            this.fzInfoLoading = false ;

          }
        })
      },
      //定价组
      replacePrice(val) {
        this.replaceStatus = true;
        this.specialStatus = val;
      },
      canelPrice() {
        this.priceLoading = true;
        $axios.request({
          url: '/express/pricingGroup/' + this.id + '/' + this.cityInfoId,
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
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
          fail: r => {
            console.log(r)
            this.priceLoading = false;
          }
        })

      },
      /*accDiv(arg1, arg2) {
        var t1 = 0,
          t2 = 0,
          r1, r2;
        try {
          t1 = arg1.toString().split(".")[1].length
        } catch(e) {}
        try {
          t2 = arg2.toString().split(".")[1].length
        } catch(e) {}
        with(Math) {
          r1 = Number(arg1.toString().replace(".", ""));
          r2 = Number(arg2.toString().replace(".", ""));
          return (r1 / r2) * pow(10, t2 - t1);
        }
      },*/
      addPriceList(status) {
        if (status === 1) {
          let dataArr = this.firstTableData;
          let num = 0;
          if (dataArr.length > 0) {
            if (dataArr[dataArr.length - 1].areaEnd === '' || dataArr[dataArr.length - 1].areaEnd === null || dataArr[dataArr.length - 1].areaEnd === undefined || dataArr[dataArr.length - 1].areaEnd === NaN) {
              this.$message({
                type: 'error',
                message: '请先填写完整的重量区间',
                duration:500,
              });
              return false;
            } else if (dataArr[dataArr.length - 1].price === '' || dataArr[dataArr.length - 1].price === null || dataArr[dataArr.length - 1].price === undefined || dataArr[dataArr.length - 1].price === NaN) {
              this.$message({
                type: 'error',
                message: '请先填写金额',
                duration:500,
              });
              return false;
            }
            num = (dataArr[dataArr.length - 1].areaEnd) *1000000+10000;
            num = num / 1000000;
          } else {
            num = 0;
          }
          this.firstTableData.push({
            areaBegin: num,
            firstOrContinued: 1,
            weightStandard: 1,
            firstWeight: 0,
            firstWeightPrice: 0,
          });
        } else {
          let thenData = this.thenTableData;
          let thenNum = 0;
          let thenLength = thenData.length;
          if (thenLength > 0) {
            if (thenData[thenLength - 1].areaEnd === '' || thenData[thenLength - 1].areaEnd === null || thenData[thenLength - 1].areaEnd === undefined || thenData[thenLength - 1].areaEnd === NaN || thenData[thenLength - 1].areaEnd === '~') {
              this.$message({
                type: 'error',
                message: '请先填写完整的重量区间',
                duration:500,
              });
             return false;
            } else if (thenData[thenLength - 1].price === '' || thenData[thenLength - 1].price === null || thenData[thenLength - 1].price === undefined || thenData[thenLength - 1].price === NaN) {
              this.$message({
                type: 'error',
                message: '请先填写金额',
                duration:500,
              });
              return false;
            }
            thenNum = (thenData[thenLength - 1].areaEnd) *1000000+10000;
            thenNum = thenNum / 1000000;

          } else {
            if (this.firstTableData[this.firstTableData.length - 1].areaEnd === '' || this.firstTableData[this.firstTableData.length - 1].areaEnd === null || this.firstTableData[this.firstTableData.length - 1].areaEnd === undefined || this.firstTableData[this.firstTableData.length - 1].areaEnd === NaN) {
              this.$message({
                type: 'error',
                message: '请先填写完整的重量区间',
                duration:500,
              });
              return false;
            }
            thenNum = (this.firstTableData[this.firstTableData.length - 1].areaEnd) *1000000+10000;
            thenNum = thenNum / 1000000;
          }
          this.thenTableData.push({
            areaBegin: thenNum,
            areaEnd: '~',
            weightStandard: 1,
            firstOrContinued: 2,
            firstWeight: 0,
            firstWeightPrice: 0,

          });
        }

      },
      cityEndChange(index, val, start) {
        let firstData = this.firstTableData;
        let continueData = this.thenTableData;
        let begin = (val * 1000000+10000) / 1000000;
        let changeIndex = index + 1;
        if (start >= val) {
          this.$message({
            type: 'error',
            message: '范围值填写有误',
            duration:500,
          });
          this.firstTableData[index].areaEnd = '';
          return false;
        }
        if (firstData.length > changeIndex) {
          this.firstTableData[changeIndex].areaBegin = begin;
        } else {
          if (continueData.length > 0) {
            this.thenTableData[0].areaBegin = begin;
          }
        }

      },
      continueChange(index, val, start) {
        console.log(666666)
        let continueData = this.thenTableData;
        let begin = (val *1000000+10000) / 1000000;
        let changeIndex = index + 1;
        if (start >= val) {
          this.$message({
            type: 'error',
            message: '范围值填写有误',
            duration:500,
          });
          this.thenTableData[index].areaEnd = '';
          return false;
        }
        if (continueData.length > changeIndex) {
          this.thenTableData[changeIndex].areaBegin = begin;
        }
      },
      priceDel(index, status, val) {
        let firstData = this.firstTableData;
        let continueData = this.thenTableData;
        let begin = val.areaBegin;
        let changeIndex = index + 1;
        if (status === 1) {

          if (firstData.length > changeIndex) {
            this.firstTableData[changeIndex].areaBegin = begin;
          } else {
            if (continueData.length > 0) {
              this.thenTableData[0].areaBegin = begin;
            }
          }
          this.firstTableData.splice(index, 1);
          if (this.firstTableData.length === 0) {
            this.thenTableData = [];
          }
        } else {
          if (continueData.length > changeIndex) {
            this.thenTableData[changeIndex].areaBegin = begin;
          }
          this.thenTableData.splice(index, 1)
        }
      },
      historyCityChange(val) {
        $axios.request({
          url: '/express/pricingGroup/' + this.id + '/' + val,
          method: 'get',
          _this: this,
          statu: 1,
          success: res => {
            this.firstTableData = res.data.firstWeight;
            this.thenTableData = res.data.continuedWeight;
          },
          fail: r => {
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
            /*console.log(t.weightStandard)
            console.log(t.weightStandard)
            console.log(t.weightStandard)

            if(t.weightStandard==0){
              this.$message.error({
                message: '重量进制不能为0!',
                duration:1000,
              });
              return;
            }*/
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
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  duration:500,
                });

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
              _this:this,
              success:res=>{
                this.priceLoading = false;
                this.replaceStatus = false;
                this.getSpecialCityInfo();
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  duration:500,
                });
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
               _this:this,
               success:res=>{
                 this.priceLoading = false;
                 this.replaceStatus = false;
                 this.getSpecialCityInfo();
                 this.$message({
                   type: 'success',
                   message: '修改成功',
                   duration:500,
                 });
               } ,
            fail:()=>{
                 this.priceLoading = false;

             }
          })
        }
      },
      appendPricingGroup() {
        this.addStatus = false;
        this.getUserListInfo();
      },
      djCenterDialogVisibleBut(){
        this.djCenterDialogVisible=false;
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        $axios.request({
          url: '/express/pricingGroup/customer/type/' + this.id + '/' + this.djVal+'/'+this.radioYes,
          method: 'post',
          _this: this,
          statu: 2,
          success: res => {
            this.$message({
              type: 'success',
              message: '操作成功!',
              duration:1000,
            });
            this.addStatus = true;
            this.addUserClassSelect = '';
            this.getPriceCity();
            this.getSpecialCityList();

            loading.close();
          },
          fail: e => {

          }

        })
      },
      appendPricingGroupChange(val) {
        this.djCenterDialogVisible=true;
        this.djVal = val
       /* this.$confirm('此操作将与您选择客户的定价组一致, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.request({
            url: '/express/pricingGroup/customer/' + this.id + '/' + val+'/'+this.radioYes,
            method: 'post',
            _this: this,
            statu: 2,
            success: res => {
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration:500,
              });
              this.addStatus = true;
              this.addUserClassSelect = '';
              this.getPriceCity();
            },
            fail: e => {

            }

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            duration:500,
            message: '已取消操作'
          });
        });*/
      },

      //特殊定价组
      specialHandleClick(a,b){
          this.activeName= '',
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
              _this:this,
              success: res => {
                this.specialCityList.push({
                  id:res.data.id,
                  keyName:res.data.keyName,
                  status:res.data.status
                })
                _this.specialDialogFormVisible = false;
                _this.$message({
                  type: 'success',
                  message: '操作成功!',
                  duration:500,
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
        });
      },
      //删除特殊定价组
      deleteSpecial(index){
        this.deleteSpecialLoading = true;
          $axios.request({
            url:'/express/pricingGroup/'+this.specialCityListValue,
            method:'delete',
            statu:1,
            _this:this,
            success:res=>{
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration:500,
              });
                this.specialCityList.splice(index,1);
              this.deleteSpecialLoading = false;
            },
            fail:e=>{
              this.deleteSpecialLoading = false;
            }

          })
      },



      //form
      deleteKh(a, b) {
        console.log(a)
        console.log(b)
        if (b.platformId === 3) {
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.request({
              url: '/express/user/' + b.id,
              method: 'delete',
              statu: 1,
              _this: this,
              success: res => {
                if(res.code==10021){
                  this.$message({
                    type: 'warning',
                    duration:1500,
                    message: res.info
                  });
                  return;
                }
                this.getUserList();
                this.getUserListInfo();
                // this.remove(this.nodeObj,this.nodeData);
                this.$message({
                  type: 'success',
                  duration:500,
                  message: '删除成功!'
                });
              },
              fail: e => {
                console.log(e);
              }
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              duration:500,
              message: '已取消删除'
            });
          });
        } else {
          this.$confirm('删除该用户其下级用户也会被删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.request({
              url: '/express/user/' + b.id,
              method: 'delete',
              statu: 1,
              _this: this,
              success: res => {
                // this.remove(this.nodeObj,this.nodeData);
                this.getUserList();
                this.$message({
                  type: 'success',
                  duration:500,
                  message: '删除成功!'
                });
              },
              fail: e => {
                console.log(e);
              }
            })

          }).catch(() => {
            this.$message({
              type: 'info',
              duration:500,
              message: '已取消删除'
            });
          });

        }

      },
      resetUserInfo(formName){
        this.$refs[formName].resetFields();
        this.ruleForm2={
            password: '',
            checkPass: '',
            cityList:[]
        },
        this.dialogFormEditUserInfo = false;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogFormVisible = false;
      },
      submitUserInfoForm(formName){
        let _this = this
        _this.$refs[formName].validate((valid) => {
          if(valid){
            let list = _this.ruleForm2;
            list.province = _this.defaultCity[0];
            list.city = _this.defaultCity[1];
            list.area = _this.defaultCity[2];

            let userId= _this.id
            let params = {
              id:userId,
              name: list.name,
              email: list.email,
              companyName: list.companyName,
              province: list.province,
              city: list.city,
              area: list.area,
              address: list.address,
              telephone: list.telephone,
              personInCharge: list.personInCharge,
            };
            $axios.request({
              url: '/express/put',
              method: 'put',
              _this: _this,
              statu: 2,
              data: params,
              success: res => {
                _this.resetUserInfo(formName);
                _this.$message({
                  type: 'success',
                  duration:500,
                  message: '修改成功!'
                });
                _this.getUserInfo(userId)
              },
              fail: error => {
                console.log(error)
              }
            })
          }
        })

      },
      submitForm(formName) {
        let _this = this;
        let list = this.ruleForm2;
        let params = {};
        let level = 1;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.radio === '客户') {
              list.province = list.cityList[0];
              list.city = list.cityList[1];
              list.area = list.cityList[2];
              params = {
                username: list.username,
                password: list.password,
                name: list.name,
                email: list.email,
                companyName: list.companyName,
                province: list.province,
                city: list.city,
                area: list.area,
                address: list.address,
                telephone: list.telephone,
                personInCharge: list.personInCharge,
              };
              level = 1;
            } else {
              level = 2;
              params = {
                name: list.name,
                personInCharge: list.personInCharge,
                typeName:list.typeName,
                paymentAccount:list.paymentAccount,
                payee:list.payee

              }
            }

            $axios.request({
              url: '/express/register/' + this.id + '/' + level,
              method: 'post',
              _this: _this,
              statu: 2,
              data: params,
              success: res => {
                _this.dialogFormVisible = false;
                _this.$message({
                  type: 'success',
                  duration:500,
                  message: '注册成功!'
                });
                _this.resetForm(formName);
                // _this.append(this.nodeData);
                _this.getUserList();
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
      append(data) {
        const newChild = {id: 1, label: 'testtest', children: []};
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      //tag
      handleClose(tag) {
        $axios.request({
          url: '/express/keyword/' + tag.id,
          method: 'delete',
          _this: this,
          statu: 1,
          success: res => {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
          },
          fail: res => {
            console.log(res);
          }
        })

      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          $axios.request({
            url: '/express/keyword',
            method: 'post',
            statu: 2,
            data: {
              keyword: inputValue,
              userId: this.id
            },
            _this: this,
            success: res => {
              this.dynamicTags.push(res.data);
            },
            fail: res => {
              console.log(res);
            }
          })

        }
        this.inputVisible = false;
        this.inputValue = '';
      }

    },
    mounted() {
      this.getCity();
      this.getUserList();

    }
  }
</script>

<style scoped lang="less">
  .kd-user-container {
    width: 100%;
    position: relative;
  }

  .kd-user-left {
    width:325px;
    position: absolute;
    height: 890px;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 13px;
    min-width: 200px;

  }

  .kd-user-title {
    font-size: 14px;
    color: #1c2438;
    font-weight: 700;
  }

  .tree-item-content {
    display: inline-block;
    margin-left: 50px;

  }

  .tree-item {
    display: inline-block;
    margin-left: 50px;
    background-color: red;

  }

  .custom-tree-node {
    display: inline-block;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*font-size: 12px !important;*/
  }

  .kd-user-right {
    margin-left: 335px;
    min-height: 890px;

  }

  .fn-user-form-item {
    display: inline-block;
    width: 49%;
  }

  .city-width {
    width: 100%;
  }

  .kd-user-tab {
    width: 300px;
    margin: 0 auto;
    margin-bottom: 30px;
  }

  .kd-user-right-info {
    padding: 20px;
    p {
      height: 40px;
      display: inline-block;
      width: 39%;
      font-size: 13px;
    }
  }

  .kd-user-right-change {
    padding: 18px 20px;
    margin-left: -15px;
    border-bottom: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .kd-user-right-tag {
    padding: 30px 15px;
  }

  .kd-user-collapse {
    border: 1px solid #eee;
    .kd-user-collapse-title {
      text-align: center;
      background-color: #f5f7fa;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 2px;

    }
  }

  .kd-user-collapse-select {
    width: 100%;

  }

  .kd-user-size {
    font-size: 13px;
  }

  .fz-dialog-content {

  }
  .kd-user-right-main{
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    width: 100%;
    height: 790px;
  }
.weight-input-width{
  width:100%
}
  .weight-input-width-first{
    width: 40%;
  }



  .text {
    font-size: 16px;
    color: #F56C6C;
    text-align: left;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    margin-top: 15px;
    width: 100%;
  }
</style>
