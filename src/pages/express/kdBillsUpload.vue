<template>
      <section  v-loading="uploadLoading" element-loading-text="上传账单中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-card class="kd-bill-upload-container" >
            <div slot="header" class="clearfix">
              <span class="kd-bill-upload-title">上传账单</span>
              <span style="color: #F56C6C">（ps:表格数据日期必须与选择日期年月一致!）</span>
              <a href="https://funwl.oss-cn-hangzhou.aliyuncs.com/template/template.xlsx" target="_blank">
                <span style="font-weight: bold;font-size: 17px;text-decoration: underline;color: #00a0f0">下载模板</span>
              </a>
              <el-button style="float: right; padding: 3px 0" type="text" @click="goBack" icon="el-icon-arrow-left">返回</el-button>
            </div>
            <div >
              <span>时间：</span>
              <el-date-picker
                v-model="uploadTime"
                type="month"
                format="yyyy-MM"
                size="medium"
                placeholder="请选择时间"
                @change="changUploadTime">
              </el-date-picker>
              <el-button  size="mini"  type="primary"  icon="el-icon-upload"  @click="replaceBill"  v-if="totalBill.length>0">替换</el-button>
                <el-upload
                  style="display: inline-block"
                  :action="uploadSrc+uploadTime"
                  :headers="headers"
                  :on-success="uploadSuccess"
                  :before-upload="uploadBefore"
                  :file-list="fileList">
                  <el-button    type="primary"  size="mini" :loading="kdBillLoading" @click="uploadBill" icon="el-icon-upload"  v-if="totalBill.length===0">上传</el-button>
                  <el-button    type="primary"  size="mini" :loading="kdBillLoading" @click="uploadBill" icon="el-icon-upload"  v-else  style="margin-left: 20px">追加</el-button>
                </el-upload>



            </div>
            <div v-if="showList" >
              <div class="kd-bill-upload-content">
                <p  class="kd-bill-upload-content-item-title">账单列表<span style="font-size: 12px;color: #3a8ee6;">(点击图标可下载)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <el-checkbox  v-model="checkAllExcel"  v-if="pricedBool" @change="handleCheckAllChangeExcel">全选</el-checkbox>
                  <el-button type="primary"  size="mini"  v-if="pricedBool" @click="butExcelPrice">一键定价</el-button>
                </p>
               <!-- <div class="kd-bill-upload-content-item"  v-for="(item,index) in uploadData.existence"  >
                  <img src="../../assets/images/excel.png" alt="" >
                  <span @click="delBill(item.totalId,index,1)">X</span>
                  <a :href="item.totalUrl" target="_blank">
                    <p>总单量:{{item.totalNumber}}</p>
                    <p style="width:80px;">{{item.name}}</p>
                  </a>
                </div>-->



                <el-row>
                  <el-col :span="2" v-for="(item,index) in uploadData.existence" :key="item.id">
                    <el-tooltip class="item" effect="dark" placement="bottom">
                      <div slot="content">{{item.name}}<br/>总单量:{{item.totalNumber}}</div>
                          <el-card :body-style="{ padding: '0px'}" style="margin-left: 10px">
                            <el-checkbox  v-model="item.bool" style="margin-left: 42%;z-index: 999" v-if="pricedBool"  @change="onlyCheckAllChangeExcel"></el-checkbox>
                            <br>
                            <a :href="item.totalUrl" target="_blank">
                              <img src='../../assets/images/excel.png' style="margin-left: 17%;width: 60%">
                            </a>
                            <div style="padding: 14px;">
                              <div style="width: 100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color: #00a0f0">{{item.name}}</div>
                              <span class="time">总单量:{{item.totalNumber}}</span>
                              <br>
                              <el-button type="text" size="mini" style="color: #67C23A;" class="button" :loading="kdBillLoading" @click="doPrice(item.totalId)"><i class="el-icon-share"></i> 定价</el-button>
                              <el-button type="text" style="color: #F56C6C;float: right" size="mini" @click="delBill(item.totalId,index,1)" icon="el-icon-delete" :circle="true">删除</el-button>
                            </div>
                          </el-card>
                    </el-tooltip>
                  </el-col>

                  <el-col :span="2" v-for="(item,index) in arrListDate" :key="item.id">
                    <el-tooltip class="item" effect="dark" placement="bottom">
                      <div slot="content">{{item.name}}<br/>总单量:{{item.totalNumber}}</div>
                      <el-card :body-style="{ padding: '0px'}" style="margin-left: 10px">
                        <el-checkbox  :checked="true" style="margin-left: 42%;z-index: 999" disabled></el-checkbox>
                        <br>
                        <a :href="item.totalUrl" target="_blank">
                          <img src='../../assets/images/excel.png' style="margin-left: 17%;width: 60%">
                        </a>
                        <div style="padding: 14px;">
                          <div style="width: 100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color: #00a0f0">{{item.name}}</div>
                          <span class="time">总单量:{{item.totalNumber}}</span>
                          <br>
                          <el-button type="text" size="mini" style="color: #909399;" class="button" disabled><i class="el-icon-share"></i> 已定价</el-button>
                          <el-button type="text" style="color: #F56C6C;float: right" size="mini" @click="delBill(item.totalId,index,1)" icon="el-icon-delete" :circle="true">删除</el-button>
                        </div>
                      </el-card>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
              <div class="kd-bill-upload-content">
                <p  class="kd-bill-upload-content-item-title">其他账单<span style="font-size: 12px;color: #3a8ee6;">(点击图标可下载)</span></p>
                <el-row>
                  <el-col :span="2" v-for="(item,index) in uploadData.other" :key="item.id">
                    <el-tooltip class="item" effect="dark" placement="bottom">
                      <div slot="content">{{item.name}}<br/>总单量:{{item.totalNumber}}</div>
                        <el-card :body-style="{ padding: '0px'}" style="margin-left: 10px">
                          <a :href="item.totalUrl" target="_blank">
                            <img src='../../assets/images/excel.png' style="margin-left: 17%;width: 60%">
                          </a>
                          <div style="padding: 14px;">
                            <div style="width: 100%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color: #00a0f0">{{item.name}}</div>
                            <span class="time">总单量:{{item.totalNumber}}</span>
                            <br>
                            <el-button type="text" style="color: #F56C6C;float: right" size="mini" @click="delBill(item.totalId,index,2)" icon="el-icon-delete" :circle="true">删除</el-button>
                          </div>
                        </el-card>
                    </el-tooltip>
                  </el-col>
                </el-row>


              </div>
            </div>
            <div class="kd-upload-bill-dialog-main  clearfix" v-if="replaceShowList">
              <p  class="kd-upload-bill-dialog-main-title">请选择要替换的账单</p>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in cities" :label="city.sumId" :key="city.sumId">{{city.sumName}}&nbsp;  {{city.createTime}}</el-checkbox>
              </el-checkbox-group>
              <el-upload
                ref="upload"
                style="margin-top: 20px"
                class="fl"
                :action="replaceUploadSrc+uploadTime+'/'+checkedCities.join()"
                :headers="headers"
                :on-success="uploadSuccess"
                :before-upload="uploadBefore"
                :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" :disabled="checkedCities.length===0"  @click="uploadBill">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :disabled="checkedCities.length===0"  >上传到服务器</el-button>
              </el-upload>
            </div>

          </el-card>

      </section>
</template>

<script>
  import {baseSrc} from "../../api/api";
  import $axios from "../../api/api";
  import {changeDate} from '../../assets/js/changeDate'
    export default {
        name: "kdBillsUpload",
        data(){
          return{
            fileList:[],
            uploadSrc:baseSrc+'/express/total/additional/',
            headers:{
              'Authorization': sessionStorage.getItem('funwlToken')
            },
            kdBillLoading:false,
            uploadTime:'2018-09',
            expressStatus:true,
            uploadData:{},
            arrListDate:[],
            pricedBool:false,
            isIndeterminateExcel:true,
            checkAllExcel:false,
            uploadLoading:false,
            nowDate:'',
            //upload bill
            totalBill:[],
            dialogVisibleReplace:false,
            //dialog replace
            checkAll: false,
            checkedCities: [],
            cities: [],
            isIndeterminate: true,
            // showList:false,
            showList:true,
            replaceShowList:false,
            replaceUploadSrc:baseSrc+'/express/total/replace/',

          }
        },
      methods:{
          // upload
        uploadSuccess(res){
          this.uploadData=[]
          this.kdBillLoading = false;
          this.uploadLoading = false;
              setTimeout(
                ()=>{
                  this.expressStatus = false;
                  this.fileList = [];
                  if (res.code===0){
                    this.$message({
                      type:'success',
                      message:'上传成功',
                      duration:1000,
                    })
                    this.arrListDate=[]
                    this.pricedBool=true
                    this.getUploadInfo()
                  } else {
                    this.$message({
                      type:'error',
                      message:res.info.toString(),
                      duration:500,
                    })
                  }
                },1000
              );




        },
        uploadBefore(file){

          this.uploadLoading = true;
          this.replaceShowList = false;
          this.showList = true;
          let _this = this;
          let timer = setInterval(
            ()=>{
              $axios.request({
                url:'/express/total',
                _this:this,
                method:'get',
                data:{
                  time:this.nowDate,
                  fileName:file.name,
                },
                statu:1,
                success:res=>{
                  this.uploadData = res.data;
                  /*let arr = this.uploadData.existence
                  arr.forEach(v=>{
                    v.bool=false;
                  })
                  this.uploadData.existence=arr*/
                },
                fail:e=>{
                  clearInterval(timer)
                  this.expressStatus = true;
                }
              })
              if (this.expressStatus===false) {
                clearInterval(timer)
                this.expressStatus = true;

              }
            },500
          )
        },
        //play
        getNowDate(date){
          let nowDate = date;
          let year = nowDate.getFullYear();
          let month = nowDate.getMonth()+1;
          month = month<10? '0'+month:month;
          this.uploadTime = year+'-'+month;
        },
        changUploadTime(val){
          if(val){ this.getNowDate(val);
            this.getUploadInfo()}


        },
        getExpressToal(time,name){

        },
        uploadBill(){
            this.nowDate = changeDate(new Date());
        },
        goBack(){
          this.$router.push('/kdBills')
        },
        //upload 流程
        getUploadInfo(){
            $axios.request({
              url:'/express/total/judgeSet/'+this.uploadTime,
              method:'post',
              statu:2,
              _this:this,
              success:res=>{
                  this.totalBill = res.data;
                  this.cities = res.data;
              },
              fail:()=>{

              },

            })
        },
        //账单替换
        handleCheckAllChange(val) {
          let arr = [];
          if (this.cities.length>0){
            this.cities.forEach(v=>{
              arr.push(v.sumId)
            })
          }
          this.checkedCities = val ? arr : [];
          this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.cities.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        replaceBill(){
          this.showList = false;
          this.replaceShowList = true;
        },
        submitUpload() {
          $axios.request({
            url:'/express/total/retrieve/'+this.checkedCities.join(),
            method:'post',
            _this:this,
            statu:2,
            data:{
              date:this.uploadTime,
            },
            success:res=>{
              if (res.data.length===0){
                this.$refs.upload.submit();
              } else {
                this.$confirm('此操作将替换已发送的账单文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$refs.upload.submit();
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消操作',
                    duration:500,
                  });
                });
              }
            },
            fail:()=>{

            }
          })

        },
        handleCheckAllChangeExcel(val){
          this.isIndeterminateExcel = false;
          let arr = this.uploadData.existence
          arr.forEach(v=>{
            v.bool=val;

          })
          this.uploadData.existence=arr
        },
        onlyCheckAllChangeExcel(val){
          console.log(val)

          let arr = this.uploadData.existence
          console.log(arr)
          let i = 0
          arr.forEach(v=>{
            if(v.bool)i++;
          })
          if(i==arr.length){
            this.checkAllExcel=true
          }else{
            this.checkAllExcel=false
          }
        },
        butExcelPrice(){
          let data = []
          let arr = this.uploadData.existence
          arr.forEach(v=>{
              if(v.bool){
                data.push(v.totalId);
              }
            })
          if(data.length<1){
            this.$message({
              type: 'warning',
              message: '至少选择一个账单!',
              duration:1500,
            });
            return;
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let str = data.join()
          let arrList= []
          $axios.request({
            url:'/express/total/keyPricing',
            method:'get',
            statu:1,
            data:{totalId:str},
            _this:this,
            success:res=>{
              console.log(res)
              let x=0
              let y=0
              arr.forEach(v=>{
                if(!v.bool){
                  arrList.push(v)
                }
                else{
                  x++
                }
              })
              let str=''
              res.data.forEach(val=>{
                if(val.code==0){
                  this.arrListDate.push(val.data)
                  y++
                }
                else{
                  arrList.push(val.data)

                  str += '<p style="color:#F56C6C">'+val.data.name+'--<span style="font-weight: bold;font-size:15px">('+val.info+')</span>'+'</p>'
                }
              })
              this.uploadData.existence = arrList
              loading.close()
              if(x==y){
                this.$message({
                  type: 'success',
                  message: '定价成功!',
                  duration:1000,
                });
              }
              else{

                this.$confirm(str, '错误', {
                  confirmButtonText: '确定',
                  type: 'warning',
                  showCancelButton:false,
                  dangerouslyUseHTMLString: true,
                  center: true
                })
              }
            },
            fail:e=>{
              console.log(e);
            }
          });


        },
        doPrice(id) {

          let _this = this;
          _this.kdBillLoading = true;
          $axios.request({
            url: '/express/total/getPricing/' + id,
            method: 'get',
            statu: 2,
            success: res => {
              let arrList = []
              let arr = this.uploadData.existence
              arr.forEach(v=>{
                if(id===v.totalId){
                  this.arrListDate.push(v)
                }else{
                  arrList.push(v)
                }
              })
              this.uploadData.existence = arrList
              _this.$message({
                type: 'success',
                message: '定价成功',
                duration: 500,
              })
              _this.kdBillLoading = false;
            },
            fail: e => {
              _this.kdBillLoading = false;
            }
          })
        },
        delBill(id,index,status){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.request({
              url:'/express/total/deleteTotal/'+id,
              method:'delete',
              statu:1,
              _this:this,
              success:res=>{
                if (status===1){
                  this.uploadData.existence.splice(index,1)
                } else {
                  this.uploadData.other.splice(index,1)
                }
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                  duration:500,
                });

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
      },
      mounted(){
        this.getNowDate(new Date());
        this.getUploadInfo()
      }
    }
</script>

<style scoped lang="less">
  .kd-bill-upload-title{
    font-size: 14px;
    font-weight: 700;
  }
  .kd-bill-upload-container{
    width: 100%;
      min-height: 850px;
  }
  .kd-bill-upload-content{
      margin-top: 80px;
      .kd-bill-upload-content-item-title{
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        font-weight: 700;
      }
      .kd-bill-upload-content-item{
        display: inline-block;
        -webkit-transition: all 0.5s;
      -moz-transition: all 0.5s;
      -ms-transition: all 0.5s;
      -o-transition: all 0.5s;
      transition: all 0.5s;
      width: 200px;
        position: relative;
      img{
        height: 60px;
        width: 50px;
        margin: 0 auto;
      }
        span{
          display: inline-block;
          height: 10px;
          width: 10px;
          position: absolute;
          top: 0;
         left: 60px;
          cursor: pointer;
          transition: all 0.3s;

        }
        span:hover{
          color: #0086b3;
          font-size: 18px;
          font-weight: 700;
        }
      p{
        margin-top: 5px;
      }
    }
  }
  .kd-bill-upload-content-item{
    margin-top: 10px;
  }
  .kd-upload-bill-dialog-main{
    margin-top: 30px;
    .kd-upload-bill-dialog-main-title{
      font-size: 14px;
      font-weight: 700;
      line-height: 80px;
    }
  }

</style>
