/* Made by Meeta(南瓜电影)
使用方法：
1.文本编辑模式下复制粘贴
http-response https?:\/\/p\.doras\.api\.vcinema\.cn\/v5.0\/user/  script-path=https://meetagit.github.io/MeetaRules/Surge/Scripting/cushawmovie.js,requires-body=true
2.添加hostname = *.api.vcinema.cn
3.南瓜电影登录账号

欢迎关注TG频道:@meetashare
*/



const path1 = "/user/";
var body = $response.body;
var url = $request.url;
if (url.indexOf(path1) != -1){
  let obj = JSON.parse(body);
  obj.content["user_seed_int"] = "666666";
  obj.content["user_modal_list"] = JSON.parse('[{"honorName":"暴力美学","honorImg":"http://resource.vcinema.com.cn/image/user/medal/blmxdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同动作片","collectionKey":"violence_aesthetics","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"政治家","honorImg":"http://resource.vcinema.com.cn/image/user/medal/zzjdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同战争片","collectionKey":"statesman","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"虚拟现实","honorImg":"http://resource.vcinema.com.cn/image/user/medal/xnxsdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同科幻片","collectionKey":"virtual_reality","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"冒险家","honorImg":"http://resource.vcinema.com.cn/image/user/medal/mxjdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同冒险片","collectionKey":"adventurer","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"心思缜密","honorImg":"http://resource.vcinema.com.cn/image/user/medal/xszmdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同犯罪片","collectionKey":"meticulous_mind","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"内心强大","honorImg":"http://resource.vcinema.com.cn/image/user/medal/nxqddl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同灾难片","collectionKey":"hearts_strong","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"幻想大师","honorImg":"http://resource.vcinema.com.cn/image/user/medal/hxdsdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同魔幻片","collectionKey":"master_fantasy","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"智商爆表","honorImg":"http://resource.vcinema.com.cn/image/user/medal/zsbbdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同悬疑片","collectionKey":"iq_extraordinary","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"最佳编剧","honorImg":"http://resource.vcinema.com.cn/image/user/medal/zjbjdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同剧情片","collectionKey":"best_screenplay","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"惊声尖叫","honorImg":"http://resource.vcinema.com.cn/image/user/medal/jsjjdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同恐怖片","collectionKey":"schriek","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"沙发土豆","honorImg":"http://resource.vcinema.com.cn/image/user/medal/sftddl.png","honorType":"观影勋章","honorMatch":"已观看%s集","honorConditions":"累积观看75集不同电视剧","collectionKey":"couch_potato","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":true,"is_get":true},{"honorName":"观影老司机","honorImg":"http://resource.vcinema.com.cn/image/user/medal/gylsjdl.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看200部不同电影","collectionKey":"old_driver","honorUri":"pumpkin://vcinema.cn/epg/home/index","get":true,"is_get":true},{"honorName":"每天逛逛","honorImg":"http://resource.vcinema.com.cn/image/user/medal/mtggdl.png","honorType":"活跃勋章","honorMatch":"已登录%s天","honorConditions":"连续登录30天","collectionKey":"login_everyday","honorUri":"","get":true,"is_get":true},{"honorName":"收藏家","honorImg":"http://resource.vcinema.com.cn/image/user/medal/scjdl.png","honorType":"活跃勋章","honorMatch":"已加入片单%s部","honorConditions":"加入片单100部影视","collectionKey":"collector","honorUri":"pumpkin://vcinema.cn/epg/home/index","get":true,"is_get":true},{"honorName":"西部牛仔","honorImg":"http://resource.vcinema.com.cn/image/user/medal/xbnzmr.png","honorType":"观影勋章","honorMatch":"已观看%s部","honorConditions":"累积观看50部不同西部片","collectionKey":"west_cowboy","honorUri":"pumpkin://vcinema.cn/epg/subpage/index","get":false,"is_get":false},{"honorName":"笔下有神","honorImg":"http://resource.vcinema.com.cn/image/user/medal/bxysmr.png","honorType":"活跃勋章","honorMatch":"已写%s条","honorConditions":"写100条影评","collectionKey":"pen_god","honorUri":"pumpkin://vcinema.cn/sns/index","get":false,"is_get":false},{"honorName":"表示赞同","honorImg":"http://resource.vcinema.com.cn/image/user/medal/bsztmr.png","honorType":"活跃勋章","honorMatch":"已点%s个赞","honorConditions":"点200个赞","collectionKey":"show_agreed","honorUri":"pumpkin://vcinema.cn/sns/index","get":false,"is_get":false},{"honorName":"形象代言人","honorImg":"http://resource.vcinema.com.cn/image/user/medal/xxdyrmr.png","honorType":"活跃勋章","honorMatch":"已分享%s次","honorConditions":"分享100次","collectionKey":"spokesperson","honorUri":"pumpkin://vcinema.cn/epg/home/index","get":false,"is_get":false},{"honorName":"我是土豪","honorImg":"http://resource.vcinema.com.cn/image/user/medal/wsthmr.png","honorType":"续费勋章","honorMatch":"已续费%s元","honorConditions":"续费金额达到500元","collectionKey":"i_am_rich","honorUri":"pumpkin://vcinema.cn/account/pay/index","get":false,"is_get":false}]')
  obj.content["user_movie_chart_list"] = JSON.parse('[{"searchDate":"07-04","movieDayTime":"13724"},{"searchDate":"07-05","movieDayTime":"13295"},{"searchDate":"07-06","movieDayTime":"20650"},{"searchDate":"07-07","movieDayTime":"20862"},{"searchDate":"07-08","movieDayTime":"13229"},{"searchDate":"07-09","movieDayTime":"181770"},{"searchDate":"07-10","movieDayTime":"13633"}]');
  obj.content["user_photo"] = "https://s2.ax1x.com/2019/07/11/ZRNrbq.th.jpg";
  obj.content["user_id"] = "5229061";
  obj.content["user_phone"] = "1997****061";
  obj.content["user_level_progress_str"] = "Lv5 男爵";
  obj.content["user_level_str"] = "Lv5男爵";
  obj.content["user_vip_state"] = "2";
  obj.content["user_nickname"] = "Meeta_share";
  obj.content["user_vip_start_date"] = "2019.05.18";
  obj.content["user_vip_end_date"] = "2066.01.01";
  body = JSON.stringify(obj);
}

$done({body});
