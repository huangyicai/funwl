//时间格式转换
export const changeDate=(date)=>{
  let day = new Date(date);
  let y = day.getFullYear();
  let m = day.getMonth() + 1;
  let d = day.getDate();
  let s = day.getHours();
  let f = day.getMinutes();
  let z = day.getSeconds();
  m = m<10 ?"0"+m:m;
  d = d<10 ?"0"+d:d;
  if (s===0&&f===0&&s===0){
    return y+"-"+m+"-"+d+'  '+'00:00:00'
  } else{
    s = s<10 ?"0"+s:s;
    f = f<10 ?"0"+f:f;
    z = z<10 ?"0"+z:z;
    return y+"-"+m+"-"+d+" "+s+":"+f+":"+z;
  }
}
//时间差计算
export const dateCompare=(date1,date2)=>{
  var day1 = new Date(date1);
  var day2 = new Date(date2);
  /*var dataNum = (day2 - day1) / (1000 * 60 * 60)
  console.log(day1);
  console.log(day2);
  console.log(dataNum);*/
  let date = day2.getTime()-day1.getTime()
  let day =parseInt(date/(1000*60*60*24));
  let tempa = date%(1000*60*60*24);
  let hours = parseInt(tempa/(3600*1000));
  let tempb = date%(1000*60*60);
  let min = parseInt(tempb/(60*1000));
  let tempc = date%(1000*60);
  let s = parseInt(tempc/1000);
  day = day>=10? day:'0'+day;
  hours = hours>=10? hours:'0'+hours;
  min = min>=10? min:'0'+min;
  s = s>=10? s:'0'+s;
  return day+'天'+hours+'时'+min+'分'+s+'秒'
}
