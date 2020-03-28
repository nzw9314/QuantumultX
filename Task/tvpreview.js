/* 
本脚本为电视节目预告
1.数据从电视家数据库获取
2.常用卫视代码
北京: btv1 | 湖南: hunan | 浙江: zhejiang
河南: henan| 江苏: jiangsu|广东: guangdong
3.需要更换电视台的，建议本地使用

[task_local]
1 10 * * * tvpreview.js

## 远程链接
1 10 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/tvpreview.js

By Macsuny                   
*/
var c = "cctv1"  // 可更改电视台，从电视家网络活动中获取，央视可以直接改后缀数字
var wurl = {
    url: "http://api.cntv.cn/epg/epginfo?serviceId=cbox&c="+c,
};
  var d = new Date()
  var M = d.getMonth()+1
  var D = d.getDate()
  var h = ("0" + (d.getHours())).slice(-2)            
  var m = ("0" + (d.getMinutes())).slice(-2)
  var weekday=new Array(7);
      weekday[0]="星期日";
      weekday[1]="星期一";
      weekday[2]="星期二";
      weekday[3]="星期三";
      weekday[4]="星期四";
      weekday[5]="星期五";
      weekday[6]="星期六";
 var n = weekday[d.getDay()]

   $task.fetch(wurl).then(response => {    
     try{ 
      let result = JSON.parse(response.body)
      var i = 0                          
      const title = `现在是`+ M +'月'+ D +'日' + n + h +':'+ m 
      subTitle = `${result[`${c}`].channelName}频道 节目预告  ` 
      detail = `正在播出: ${result[`${c}`].isLive}\n${result[`${c}`].program[i].showTime} ${result[`${c}`].program[i].t}`
      
      for (i = 1; i < result[`${c}`].program.length; i++){
      detail += `\n${result[`${c}`].program[i].showTime} ${result[`${c}`].program[i].t}`
       }
      $notify(title, subTitle, detail)
    } catch { 
        $notify("无此频道或者台号错误❌", "请检查后重试", "" )
       }
 });
$done()