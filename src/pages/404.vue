<template>
  <div class="page-container">
    <el-row>
      <el-col :span="24">
        <div class="error-img"><img src="../assets/images/error.png" alt=""></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="error-info">
          <div class="error-info-title">404</div>
          <div class="error-info-tip">COMPONENT NOT FOUND</div>
          <div class="errot-info-sorroy">
            抱歉您暂无该平台访问权限！
          </div>
          <div class="error-info-btn" @click="toIndex">
            返回首页
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    methods:{
      toIndex(){
        this.$router.push('/showIndex')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    width: 90%;
    min-width: 992px;
    padding-top: 80px;
    margin: 0 auto;
    /*margin: 100px auto;*/
    box-sizing: border-box;

  }
  .error-img  {
    text-align: center;

  }
  .error-img img{
    width: 800px;
  }
  .error-info{
    text-align: center;
    color: #555;
  }
  .error-info-title {
    font: normal 500 150px/100px '微软雅黑';
  }
  .error-info-tip{
    margin-top: 40px;
    font: normal 500 20px/20px '微软雅黑';
  }
  .errot-info-sorroy{
    font: normal 500 20px/20px '微软雅黑';
    color: #999;
    margin-top: 10px;
  }
  .error-info-btn{
    display: inline-block;
    width: 180px;
    height: 40px;
    background-color: #5e9dc0;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    font: normal 500 20px/40px '微软雅黑' ;
    color: #fffdef;
    margin-top:100px;
    cursor: pointer;

  }
  .error-info-btn:hover{
    background-color: #a3cbdf;
  }
</style>
