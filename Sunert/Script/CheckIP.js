/* 
 var title =Area_check(obj['country'])+' '+' '+flags.get(obj['countryCode']);

 var subtitle ='🍎'+City_ValidCheck(obj['city'])+'-'+'('+ ISP_ValidCheck(obj['org'])+')'+'🌍';

 */

 if ($response.statusCode != 200) {
   $done(null);
 }

 const emojis= ['🆘','🈲','⚠️','🔞','📵','🚦','🏖','🖥','📺','🐧','🐬','🦉','🍄','⛳️','🚴','🤑','👽','🤖','🎃', '👺', '👁', '🐶', '🐼','🐌', '👥']
 var city0 = " ";
 var isp0 = " ";
 function getRandomInt(max) {
   return Math.floor(Math.random() * Math.floor(max));
 }

 /*function City_ValidCheck(para) {
   if(para) {
   return para
   } 
   else
   {
   return city0
   }
 }
 */
 function ISP_ValidCheck(para) { 
   if(para=="Microsoft Azure Cloud (eastasia)"){
   return "微软云服务"
   } 
   else if(para=="Chunghwa Telecom Co. Ltd."){
   return "中华电信" 
   }
   else if(para=="Alibaba.com LLC"){
   return "阿里云服务" 
   }
   else if(para=="Hong Kong Telecommunications (HKT) Limited"){
   return "香港电讯有限公司" 
   }
   else if(para=="DigitalOcean, LLC"){
   return "数字海洋有限公司" 
   }
   else if(para=="AWS EC2 (us-west-2)"){
   return "亚马逊云服务" 
   }
   else if(para=="Newmedia Express PTE LTD"){
   return "新媒体快递有限公司" 
   }
   else if(para=="Taiwan Fixed Network")   {
   return "台湾固网股份有限公司" 
   }
   else
   {
   return para
   }
 }

 function Area_check(para) {
   if(para=="中华民国"){
   return "台湾省"
   } 
   else if(para=="台湾"){
   return "台湾省"
   } 
   else
   {
   return para
   }
 }
 function City_ValidCheck(regionName) {
   if(regionName=="Kowloon"){
   return "九龙"
   } 
   else if(regionName=="Central and Western District"){
   return "中西部"
   }
   else if(regionName=="臺灣省 or 台灣省"){
   return city0
   } 
   else if(regionName=="Moscow"){
   return "莫斯科"
   } 
   else if(regionName=="新加坡"){
   return city0
   } 
   else if(regionName=="Tuen Mun"){
   return "屯门"
   }
   else if(regionName=="Palo Alto"){
   return "帕洛阿尔托"
   } 
   else if(regionName=="Central"){
   return "中心"
   }
   else if(regionName=="Sha Tin"){
   return "沙田"
   }
  else if(regionName=="Tai Wai"){
   return "大围村"
   }
   else if(regionName=="San Jose")
   {
   return "圣何塞"
   }
   else if(regionName=="Fremont")
   {
   return "弗里蒙特"
   }
   else if(regionName=="Heiwajima")
   {
   return "平和岛"
   }
   else if(regionName=="Tokyo")
   {
   return "东京"
   }
   else 
   {
   return regionName
   }
 }
 function Org_ValidCheck(para) { 
   if(para=="Microsoft Azure Cloud (eastasia)"){
   return "微软云服务"
   } 
   else if(para=="Chunghwa Telecom Co. Ltd."){
   return "中华电信" 
   }
   else if(para=="Alibaba.com LLC"){
   return "阿里云服务" 
   }
   else if(para=="Hong Kong Telecommunications (HKT) Limited"){
   return "香港电讯有限公司" 
   }
   else if(para=="DigitalOcean, LLC"){
   return "数字海洋" 
   }
   else if(para=="AWS EC2 (us-west-2)"){
   return "亚马逊西部云服务" 
   }
   else if(para=="AWS EC2 (ap-northeast-2)"){
   return "亚马逊东北亚服务器" 
   }
   else if(para=="AWS EC2 (ap-southeast-1)"){
   return "亚马逊东南亚云服务"
   }
   else if(para=="Newmedia Express PTE LTD"){
   return "新媒体快递" 
   }
   else if(para=="Taiwan Fixed Network CO., LTD.")   {
   return "台湾固网股份"
   }
   else if(para=="Hostigation")   {
   return "大谷互联网" 
   }
   else if(para=="CL Online network Technology Co., Ltd"){
   return "中联在线网络科技" 
   }
   else if(para=="CodecCloud(HK)Limited"){
   return "编码器云(香港)" 
   }
   else if(para=="RESNET INC DBA of RESIDENTIAL NETWORKING SOLUTIONS LLC")   
   {
   return "RESNET住宅网络解决方案" 
   }
   else if(para=="Hong Kong Broadband Network Ltd")  
   {
   return "香港宽频网络" 
   }
   else if(para=="ALICLOUD-HK")
   {
   return "香港阿里云"
   }
   else if(para=="HGC Global Communications Limited")
   {
   return "和记环球电讯"
   }
   else if(para=="Quicksilver Express Courier, Inc.")
   {
   return "快银快递"
   }
   else
   {
   return para
   }
 }

 var flags = new Map([[ "AC" , "🇦🇨" ] , [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫🇴" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] , [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇸🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UA" , "🇺🇦" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ]])
 var body = $response.body;
 var obj = JSON.parse(body);
 var title =Area_check(obj['country'])+' '+''+City_ValidCheck(obj['regionName']);
var subtitle =flags.get(obj['countryCode'])+City_ValidCheck(obj['city'])+'📀'+Org_ValidCheck(obj['org'])+'🌍'+obj['continent'];
var ip = obj['query'];
var description = '服务商:'+ISP_ValidCheck(obj['isp']) +'\n'+'DNS:'+ obj['reverse'] +'\n'+'地区:' +City_ValidCheck(obj['regionName'])+obj['district']+'\n' +'洲际:'+obj['continent'] +'\n'+'IP:'+obj['query'] +'\n' +'托管:'+ obj['hosting'];
$done({title, subtitle, ip, description});