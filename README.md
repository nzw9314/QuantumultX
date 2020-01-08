# QuantumultX
1.全局配置 
QuantumultX.conf


2.脚本本地化配置:

1⃣️在本地建立文件夹
目录 iCloud Drive/QuantumultX/Script/nzw9314
或者 我的iPhone/QuantumultX/Script/nzw9314

2⃣️用working copy挂载我的库,
将脚本同步到本地
https://github.com/nzw9314/QuantumultX.git

3⃣️订阅我的[rewrite_remote]
https://raw.githubusercontent.com/nzw9314/QuantumultX/master/Js_local_WorkingCopy.conf

4⃣️Js_local_WorkingCopy.conf包括
①.Nobyda 全部脚本,
②.yichahucha 京东比价，淘宝比价,Netflix评分,
③.chavyleung 签到脚本,
④.sazs34 天气脚本,
⑤.个人收集修改脚本;

需要其他的请自行添加路径;

3.同步更新脚本库包括:
① NobyDa,
② langkhach270389,
③ Choler,
④ yichahucha,
⑤ onewayticket255,
⑥ chavyleung,
⑦ sazs34
⑧ TG群组(NobyDa Script)个人收集修改脚本


4.定时脚本(按需求自己复制和修改时间)
[task_local]
#天气DarkSky
0 0-21/3 * * * nzw9314/sazs34/task/weather_pro.js

#24小时天气
0 0-18/6 * * * nzw9314/sazs34/task/weather_hour.js

#一周天气
0 0 * * * nzw9314/sazs34/task/weather_week.js

#降雨提醒
0 6-18/6 * * * nzw9314/Script/minute_forecast.js

#一言
0 6 * * * nzw9314/Meeta/Surge/Scripting/Calendar.js

#每日一句
0 6 * * * nzw9314/yichahucha/cron_daily.js

#倒数日
0 0 * * * nzw9314/Script/daysmatter.js

#App价格监控
0  * * * * nzw9314/Script/AppPricer.js

#京东签到
0-2/1 6 * * * nzw9314/NobyDa/QuantumultX/JD-DailyBonus/JD_DailyBonus_QX_Auto.js

#爱奇艺签到
;* * * * * nzw9314/NobyDa/QuantumultX/iQIYI-DailyBonus/iQIYI_DailyBonus_QX.js

#52破解签到
;* * * * * mzw9314/NobyDa/QuantumultX/52pojie-DailyBonus/52pojie_DailyBonus_QX.js

#微博超话签到
0 12 * * * nzw9314/NavePnow/Scripts/weibo/checkin_qx.js

#百度贴吧签到
0-1/1 12 * * * nzw9314/NobyDa/QuantumultX/TieBa-DailyBonus/TieBa_DailyBonus_QX.js

#网易云音乐签到
0 12 * * * nzw9314/chavyleung/neteasemusic/quanx/neteasemusic.js

#什么值得买签到
0 12 * * * nzw9314/chavyleung/smzdm/quanx/smzdm.js

#Bilibili签到
0 12 * * * nzw9314/chavyleung/bilibili/bilibili.js

#威锋论坛签到
0 12 * * * nzw9314/chavyleung/feng/feng.js

#V2ex签到
0 12 * * * nzw9314/chavyleung/v2ex/quanx/v2ex.js

#腾讯视频签到
0 12 * * * nzw9314/chavyleung/videoqq/videoqq.js

#AcFun签到
0 12 * * * nzw9314/chavyleung/acfun/acfun.js

#人人字幕组签到
0 12 * * * nzw9314/chavyleung/zimuzu/zimuzu.js

#天气
;0 0-20/4  * * * nzw9314/Script/weather.js

#世界时间
;0 0-21/3 * * * nzw9314/Script/time.js

#机场签到(无法使用)
;0 0-21/3 * * * nzw9314/Script/checkin_qx.js
