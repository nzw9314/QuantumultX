/* wifi_proxy change (Made by Meeta)
文本编辑模式下复制粘贴,TG频道已发操作教程视频

event network-changed debug=1,script-path=wifi_proxy.js

PS:记得自己修改WIFI名称
主要功能:指定Wi-Fi(路由器翻)下,Surge使用直连模式,其他网络下Surge使用规则模式
虽然设置SSID可以达到基本相同功能
使用脚本,Surge不会被suspend
Rewrite和Scripting依然有效

TG频道:@meetashare
*/



var wifiname = $network.wifi.ssid;
var proxywifi = "大喊baba即可科学上网";
if (wifiname == proxywifi){
	$surge.setOutboundMode("direct");
	//$notification.post("Meeta_Remind","您目前处于WIFI-Proxy","Surge已自动变为直连模式");
	
}
else{
	$surge.setOutboundMode("rule");
	//$notification.post("Meeta_Remind","Surge已自动变为规则模式","");
}
$done();


