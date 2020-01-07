// 幸运飞艇（Made by Meeta）
// cron "0 0/5 13-23 * * *" script-path=https://meetagit.github.io/MeetaRules/Surge/Custom_Js/lottery_xyft.js
// 该api 由  @zaxbaby 私人购买,免费分享,所以请大家不要滥用
// ps :未经允许不允许以此谋利
// TG频道:@meetashare

const api = "http://vip.manycai.com/K25d41658517f18/xyft-1.json";
$httpClient.get(api, function(error, response, data){
  if(error){
    console.log(error);
    $done();
  }else{
    var obj = JSON.parse(data);
    //console.log(obj);
    //let name = obj[0].lotterycode;
    let code = obj[0].code;
    let opendate = obj[0].opendate;
    let title = "幸运飞艇-开奖信息";
    let subtitle = "中奖号码："+code;
    let mation = "开奖时间："+opendate+"\nMeeta wish you hit the jackpot !";
    $notification.post(title, subtitle, mation);
  }
  $done();
}
);
