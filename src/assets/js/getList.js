
function getList(orderNo,storeId,startTime,endTime,status,page,size) {
   let _this = this;
   let param ={
     orderNo:orderNo,
     storeId:storeId,
     startTime:startTime,
     endTime:endTime,
     status:status,
     page:page,
     size:size,
   }
   this.$axios.post('/web/custom/find',param).then(res=>{
      if (res.status===200){
        if (res.data.code==0&&res.data.info==='success'){
          console.log(res.data);
        } else {
          _this.$message.error('请求失败！')
        }
      } else {
        _this.$message.error('网络异常！')
      }
   }).catch(error=>{
     console.log(error);
   })
}
export default getList();
