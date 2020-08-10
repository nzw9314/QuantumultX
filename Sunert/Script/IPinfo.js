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
   if  (/[^a-zA-Z.]+$/.test(para))
      {
       return para
      }
   else {
      const word = encodeURI(para)
      const enTocnUrl = {url: "http://translate.google.cn/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q="+word}
    $task.fetch(enTocnUrl).then(response => { 
      if(/[a-zA-Z0-9]+/g.test(response.body)) {
        const rest = response.body.match(/[\u4e00-\u9fa5]+/g)
        if (rest == null){
       // $notify(para)
        return para
       }
       else {
        para = rest
       // $notify(para)
        return para
        }
      }
    })
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
   else 
   {
   return regionName
   }
 }
 function Org_ValidCheck(para) { 
   if  (/[^a-zA-Z.]+$/.test(para))
      {
       return para
      }
   else {
      const word = encodeURI(para)
      const enTocnUrl = {url: "http://translate.google.cn/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q="+word}
    $task.fetch(enTocnUrl).then(response => { 
      if(/[a-zA-Z0-9]+/g.test(response.body)) {
        const rest = response.body.match(/[\u4e00-\u9fa5a-zA-Z]+/)
        if (rest == null){
       // $notify(para)
        return para
       }
       else {
        para = rest
       // $notify(para)
        return para
        }
      }
    })
   }
 }

 var flags = new Map([[ "AC" , "🇦🇨" ] , [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫🇴" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] , [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇸🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UA" , "🇺🇦" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ]])
 var body = $response.body;
 var obj = JSON.parse(body);
 var title =Area_check(obj['country'])+' '+''+City_ValidCheck(obj['regionName']);
var subtitle =flags.get(obj['countryCode'])+City_ValidCheck(obj['city'])+'📀'+Org_ValidCheck(obj['org'])+'🌍'+obj['continent'];
var ip = obj['query'];
var description = '服务商:'+obj['isp']+'\n'+'DNS:'+ obj['reverse'] +'\n'+'地区:' +City_ValidCheck(obj['regionName'])+obj['district']+'\n' +'洲际:'+obj['continent'] +'\n'+'IP:'+obj['query'] +'\n' +'托管:'+ obj['hosting'];
$done({title, subtitle, ip, description});