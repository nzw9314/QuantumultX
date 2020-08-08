/*
机场订阅转化器，用于提取节点。修改自KOP-XIAO的资源转换器（我就简单的支持了surge，就测试过vmess格式的订阅）https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/resource-parser.js
一般机场支持UA识别返回相应格式的订阅文件，但很多是傻瓜式配置，包含了很多规则，此脚本用于提取纯节点，避免使用别人搭建的api
可用boxjs关闭日志输出

⚠️使用转换器需手动开启，并且添加自己机场的houstname到MITM
*/

const lk = nobyda()
const isEnableLog = !lk.getVal('lkIsEnableLogSubConverter') ? true : JSON.parse(lk.getVal('lkIsEnableLogSubConverter'))
var content0=lk.getResponseBody();
var link0=lk.getRequestUrl();
//debug
//const $notify=console.log
//const $resource={}
//const $done=function(snt){return snt}
//parameters
var para=(link0.indexOf("http")!=-1 && link0.indexOf("://")!=-1)? link0:link0+content0.split("\n")[0];
var para1=para.slice(para.indexOf("$@$")+1) //防止参数中其它位置也存在"$@$"
var mark0=para.indexOf("$@$")!=-1? true:false;
const subinfo=``;
const subtag=``;
var Pinfo=mark0 && para1.indexOf("info=")!=-1? para1.split("info=")[1].split("&")[0]:0;
var ntf_flow=0;
//常用量
const Base64=new Base64Code();
const escapeRegExp = str => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); //处理特殊符号以便正则匹配使用
const qxpng="https://raw.githubusercontent.com/crossutility/Quantumult-X/master/quantumult-x.png"
const subinfo_link = {"open-url": "https://t.me/QuanX_API", "media-url" :"https://shrtm.nu/ebAr"};
const rwrite_link = {"open-url":link0.split("#")[0], "media-url": "https://shrtm.nu/x3o2"}
const rwhost_link = {"open-url":link0.split("#")[0], "media-url": "https://shrtm.nu/0n5J"}
const rule_link={"open-url":link0.split("#")[0], "media-url": "https://shrtm.nu/cpHD"}
const nan_link={"open-url":link0.split("#")[0], "media-url": qxpng}
const bug_link={"open-url":"https://t.me/Shawn_KOP_bot", "media-url": "https://shrtm.nu/obcB"} // bug link
const sub_link={"open-url":link0.split("#")[0], "media-url": "https://shrtm.nu/ebAr"}
const subinfo_link1={"open-url":link0.split("#")[0], "media-url": "https://shrtm.nu/uo13"}

SubFlow() //流量通知
var type0=Type_Check(content0); //  类型
//$notify(type0)
var delnodereg=mark0 && para1.indexOf("delnodereg=")!=-1? decodeURIComponent(para1.split("delnodereg=")[1].split("&")[0]):null;
var Pin0=mark0 && para1.indexOf("in=")!=-1? (para1.split("in=")[1].split("&")[0].split("+")).map(decodeURIComponent):null;
var Pout0=mark0 && para1.indexOf("out=")!=-1? (para1.split("out=")[1].split("&")[0].split("+")).map(decodeURIComponent):null;
var Preg=mark0 && para1.indexOf("regex=")!=-1? decodeURIComponent(para1.split("regex=")[1].split("&")[0]):null; //server正则过滤参数
var Pregdel=mark0 && para1.indexOf("delreg=")!=-1? decodeURIComponent(para1.split("delreg=")[1].split("&")[0]):null; // 正则删除参数
var Phin0=mark0 && para1.indexOf("inhn=")!=-1? (para1.split("inhn=")[1].split("&")[0].split("+")).map(decodeURIComponent):null; //hostname
var Phout0=mark0 && para1.indexOf("outhn=")!=-1? (para1.split("outhn=")[1].split("&")[0].split("+")).map(decodeURIComponent):null; //hostname
var Pemoji=mark0 && para1.indexOf("emoji=")!=-1? para1.split("emoji=")[1].split("&")[0]:null;
var Pudp0=mark0 && para1.indexOf("udp=")!=-1? para1.split("udp=")[1].split("&")[0]:0;
var Ptfo0=mark0 && para1.indexOf("tfo=")!=-1? para1.split("tfo=")[1].split("&")[0]:0;
var Prname=mark0 && para1.indexOf("rename=")!=-1? para1.split("rename=")[1].split("&")[0].split("+"):null;
var Prrname=mark0 && para1.indexOf("rrname=")!=-1? para1.split("rrname=")[1].split("&")[0].split("+"):null;
var Ppolicy=mark0 && para1.indexOf("policy=")!=-1? decodeURIComponent(para1.split("policy=")[1].split("&")[0]):"Shawn";
var Pcert0=mark0 && para1.indexOf("cert=")!=-1? para1.split("cert=")[1].split("&")[0]:1;
var Psort0=mark0 && para1.indexOf("sort=")!=-1? para1.split("sort=")[1].split("&")[0]:0;
var PTls13=mark0 && para1.indexOf("tls13=")!=-1? para1.split("tls13=")[1].split("&")[0]:0;
var Pntf0= mark0 && para1.indexOf("ntf=")!=-1? para1.split("ntf=")[1].split("&")[0]:2;
var Pb64= mark0 && para1.indexOf("b64=")!=-1? para1.split("b64=")[1].split("&")[0]:0;
var emojino=[" 0️⃣ "," 1⃣️ "," 2⃣️ "," 3⃣️ "," 4⃣️ "," 5⃣️ "," 6⃣️ "," 7⃣️ "," 8⃣️ "," 9⃣️ "," 🔟 "]
var pfi=Pin0? "in="+Pin0.join(", ")+",  ":""
var pfo=Pout0? "out="+Pout0.join(", "):""
var pfihn=Phin0? "inhn="+Phin0.join(", ")+",  ":""
var pfohn=Phout0? "outhn="+Phout0.join(", "):""
var flow="";
var exptime="";

//响应头流量处理部分
function SubFlow(){
    if(Pinfo==1 && subinfo){
        var sinfo=subinfo.replace(/ /g,"").toLowerCase();
        var total="总流量: "+(parseFloat(sinfo.split("total=")[1].split(",")[0])/(1024**3)).toFixed(2)+"GB";
        var usd="已用流量: "+((parseFloat(sinfo.split("upload=")[1].split(",")[0])+parseFloat(sinfo.split("download=")[1].split(",")[0]))/(1024**3)).toFixed(2)+"GB"
        var left="剩余流量: "+((parseFloat(sinfo.split("total=")[1].split(",")[0])/(1024**3))-((parseFloat(sinfo.split("upload=")[1].split(",")[0])+parseFloat(sinfo.split("download=")[1].split(",")[0]))/(1024**3))).toFixed(2)+"GB"
        if(sinfo.indexOf("expire=")!=-1){
            var epr= new Date(parseFloat(sinfo.split("expire=")[1].split(",")[0])*1000);
            var year=epr.getFullYear();  // 获取完整的年份(4位,1970)
            var mth=epr.getMonth()+1 < 10 ? '0'+(epr.getMonth()+1):(epr.getMonth()+1);  // 获取月份(0-11,0代表1月,用的时候记得加上1)
            var day=epr.getDate()<10 ? "0"+(epr.getDate()):epr.getDate();
            epr="过期时间: "+year+"-"+mth+"-"+day
        } else{
            epr=""; //"过期时间: ✈️ 未提供該信息" //没过期时间的显示订阅链接
        }
        var message=total+"\n"+usd+", "+left;
        ntf_flow=1;
        lk.msg("流量信息: ⟦"+subtag+"⟧", epr, message,subinfo_link)
    }
}

if(type0=="Subs-B64Encode"){
    total=SubsEd2QX(content0,Pudp0,Ptfo0,Pcert0,PTls13);
    flag=1;
}else if(type0=="Subs"){
    total=Subs2QX(content0,Pudp0,Ptfo0,Pcert0,PTls13);
    flag=1;
}else if(type0=="QuanX"){
    total=isQuanX(content0);
    flag=1;
}else if(type0=="Surge"){
    total=Surge2QX(content0);
    flag=1;
}else if(type0=="sgmodule"){
    flag=2
    if(para1.indexOf("dst=regex")!=-1){
        total=URX2QX(content0)
    }else if(para1.indexOf("dst=script")!=-1){
        total=SCP2QX(content0)
    }else {
        total=SGMD2QX(content0)
    }
    //total=total.split("\n")
    total=Rewrite_Filter(total,Pin0,Pout0);
}else if(type0=="rewrite"){
    flag=2;
    content0=content0.split("\n");
    total=Rewrite_Filter(content0,Pin0,Pout0);
}else if(type0=="Rule"){
    flag=3;
    total=content0.split("\n");
    total=Rule_Handle(total,Pout0,Pin0);
}else if(content0.trim()==""){
    lk.msg("‼️ 引用"+"⟦"+subtag+"⟧"+" 返回內容为空","⁉️ 点通知跳转以确认链接是否失效",para.split("#")[0],nan_link);
    flag=0;
    lk.done("")
}else if(type0=="unknown"){
    lk.msg("😭 太难写了, 可能是 bug ⁉️  "+"⟦"+subtag+"⟧", "👻 本解析器 暂未支持/未能识别 该订阅格式", "⚠️ 将直接导入Quantumult X \n 如认为是 BUG, 请点通知跳转反馈",bug_link);
    lk.done(content0);
    flag=-1;
}else { flag=0 }

if(flag==3){
    lk.done(total.join("\n"));
}else if(flag==2){
    lk.done(total.join("\n"));
}else if(flag==1){
    if(Pinfo==1&&ntf_flow==0){ //假节点类型的流量通知
        flowcheck(total)}
    if(Pin0||Pout0){
        total=Filter(total,Pin0,Pout0)
    }
    if(delnodereg){
        total=total.map(RegexDel).filter(Boolean)
    }
    if(Preg){
        total=total.map(Regex).filter(Boolean)
    }
    if(Prrname){
        var Prn=Prrname;
        total=total.map(Rename);
    }
    if(Pemoji){
        total=emoji_handle(total,Pemoji);
    }
    if(Prname){
        var Prn=Prname;
        total=total.map(Rename);
    }
    if(Pregdel){
        var delreg=Pregdel
        total=total.map(DelReg)
    }
    if(Psort0==1 || Psort0==-1){
        total=QXSort(total,Psort0);
    }else if(Psort0=="x"){
        total=shuffle(total)
    }
    total=TagCheck_QX(total)
    if(!!lk.isSurge || !!lk.isNode){
        //surge格式转换
        total = format2surge(total);
    }
    total=total.join("\n");
    lk.log(`转换后的节点如下：\n${total}`)
    if(flag==1 && !lk.isSurge && !lk.isNode){
        total=Base64.encode(total)} //强制 base64
    lk.done(total);
}

function format2surge(content){
    for(let i=0;i<content.length;i++){
        let item = content[i];
        let type = item.slice(0, item.indexOf(",")).split("=")[0].trim()
        let hostNport = item.slice(0, item.indexOf(",")).split("=")[1]
        let nl = item.slice(item.indexOf("tag"));
        let nm=nl.slice(nl.indexOf("=")+1).split(",")[0].trim()
        let result = `${nm} = ${type}, ${hostNport.split(":")[0].trim()}, ${hostNport.split(":")[1].trim()}${item.slice(item.indexOf(",")).trim()}`
        if(type=="vmess"){
            //vmess格式把password改成username
            content[i] = result.replace("password=", "username=")
        }else if(type=="trojan"){
            content[i] = result
        }else{
            //其他格式等我遇到了再处理
            content[i] = result
        }
    }
    return content;
}

//flowcheck-fake-server
function flowcheck(cnt){
    for(var i=0;i<cnt.length;i++){
        var item=cnt[i];
        var nl=item.slice(item.indexOf("tag"))
        var nm=nl.slice(nl.indexOf("=")+1)
        if(item.indexOf("剩余流量")!=-1){
            flow=nm
        }else if(item.indexOf("过期时间")!=-1){
            exptime=nm
        }
    }
    if(flow!=""){lk.msg("流量信息: ⟦"+subtag+"⟧", flow, exptime,subinfo_link1)}
}

// 随机洗牌排序
function shuffle(arr) {
    var input = arr;
    for (var i = input.length-1; i >=0; i--) {
        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];
        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

//判断订阅类型
function Type_Check(subs){
    var type="unknown"
    var RuleK=["host","domain","ip-cidr","geoip","user-agent","ip6-cidr"];
    var QuanXK=["shadowsocks=","trojan=","vmess=","http="];
    var SurgeK=["=ss,","=vmess,","=trojan,","=http,","=custom,","=https,","=shadowsocks"];
    var SubK=["dm1lc3M","c3NyOi8v","dHJvamFu","c3M6Ly","c3NkOi8v"];
    var RewriteK=[" url "]
    var SubK2=["ss://","vmess://","ssr://","trojan://","ssd://"];
    var html="DOCTYPE html"
    var subi=subs.replace(/ /g,"")
    const RuleCheck = (item) => subs.toLowerCase().indexOf(item)!=-1;
    const QuanXCheck = (item) => subi.toLowerCase().indexOf(item)!=-1;
    const SurgeCheck = (item) => subi.toLowerCase().indexOf(item)!=-1;
    const SubCheck = (item) => subs.indexOf(item)!=-1;
    const RewriteCheck = (item) => subs.indexOf(item)!=-1;
    var subsn=subs.split("\n")
    //$notify("Subs","cnt",subs)
    if(subs.indexOf(html)!=-1){
        lk.msg("‼️ 该链接返回内容有误","⁉️ 点通知跳转以确认链接是否失效",link0,nan_link);
        type="web";
    } else if(subsn.length>=1 && SubK2.some(SubCheck)){ //未b64加密的多行URI 组合订阅
        type="Subs"
    }else if(SubK.some(SubCheck)){  //b64加密的订阅类型
        type="Subs-B64Encode"
    } else if(subi.indexOf("tag=")!=-1 && QuanXK.some(QuanXCheck)){
        type="Subs" // QuanX list
    } else if(subs.indexOf("[Proxy]")!=-1){
        type="Surge"; // Surge Profiles
    } else if(SurgeK.some(SurgeCheck)){
        type="Subs" // Surge proxy list
    } else if(subi.indexOf("[Script]")!=-1 || subi.indexOf("[Rule]")!=-1 || subi.indexOf("[URL Rewrite]")!=-1 || para1.indexOf("dst=regex")!=-1){ // Surge module /rule-set(url-regex) 类型
        type="sgmodule"
    }else if(subi.indexOf("hostname=")!=-1 || RewriteK.some(RewriteCheck)){
        type="rewrite"
    } else if(RuleK.some(RuleCheck) && subs.indexOf(html)==-1){
        type="Rule";
    }
    //$notify(type)
    return type
}


function Trim(item){
    return item.trim()
}

//url-regex 转换成 Quantumult X
function URX2QX(subs){
    var nrw=[]
    var rw=""
    subs=subs.split("\n")
    for(var i=0;i<subs.length;i++){
        if(subs[i].slice(0,9)=="URL-REGEX"){
            //console.log(subs[i])
            rw=subs[i].replace(/ /g,"").split(",REJECT")[0].split("GEX,")[1]+" url "+"reject-200"
            nrw.push(rw)
        }
    }//console.log(nrw)
    return nrw
}

//script 转换成 Quantumult X
function SCP2QX(subs){
    var nrw=[]
    var rw=""
    subs=subs.split("\n")
    for(var i=0;i<subs.length;i++){
        if(subs[i].slice(0,8)=="hostname"){
            hn=subs[i].replace(/\%.*\%/g,"")
            //console.log(hn)
            nrw.push(hn)
        }
        var SC=["type=",".js","pattern=","script-path="]
        const sccheck = (item) => subs[i].indexOf(item)!=-1
        if(SC.every(sccheck)){
            //console.log(subs[i])
            ptn=subs[i].split("pattern=")[1].split(",")[0]
            js=subs[i].split("script-path=")[1].split(",")[0]
            type=subs[i].split("type=")[1].split(",")[0].trim()
            if(type=="http-response" && subs[i].indexOf("requires-body=1")!=-1){
                type="script-response-body "
            }else if(type=="http-response" && subs[i].indexOf("requires-body=1")==-1){
                type="script-response-header "
            }else if(type=="http-request" && subs[i].indexOf("requires-body=1")!=-1){
                type="script-request-body "
            }else if(type=="http-request" && subs[i].indexOf("requires-body=1")==-1){
                type="script-request-header "
            }
            rw=ptn+" url "+type+js
            nrw.push(rw)
        }else if(subs[i].indexOf(" 302")!=-1 || subs[i].indexOf(" 307")!=-1){ //rewrite 复写
            //console.log(subs[i])
            rw=subs[i].split(" ")[0]+" url "+subs[i].split(" ")[2]+" "+subs[i].split(" ")[1]
            nrw.push(rw)
        }
    }//console.log(nrw)
    return nrw
}
// 如果 URL-Regex 跟 rewrite/script 都需要
function SGMD2QX(subs){
    var nrw0=URX2QX(subs)
    var nrw1=SCP2QX(subs)
    var nrwt=[...nrw0, ...nrw1]
    return nrwt
}

//Rewrite过滤，使用+连接多个关键词(逻辑"或"):in 为保留，out 为排除
function Rewrite_Filter(subs,Pin,Pout){
    //var subs=subs0.split("\n")
    var Nlist=[];
    var noteK=["//","#",";"];
    var hnc=0;
    var dwrite=[]
    var hostname=""
    for(var i=0;i<subs.length;i++){
        subi=subs[i].trim();
        var subii=subi.replace(/ /g,"")
        if(subi!=""){
            const notecheck = (item) => subi.indexOf(item)==0
            if(noteK.some(notecheck)){ // 注释项跳过
                continue;
            }else if(hnc==0 && subii.indexOf("hostname=")==0){ //host name 部分
                //console.log("hostname");
                hostname=(Phin0||Phout0)? HostNamecheck(subi,Phin0,Phout0):subi;//hostname 部分
            }else if(subii.indexOf("hostname=")!=0){ //rewrite 部分
                var inflag=Rcheck(subi,Pin);
                //if(inflag==1){$notify(inflag)}
                var outflag=Rcheck(subi,Pout);
                if(outflag==1 || inflag==0){
                    //$notify("a","b",subi)
                    dwrite.push(subi); //out 命中
                }else if(outflag==0 && inflag!=0){ //out 未命中 && in 未排除
                    Nlist.push(subi);
                }else if(outflag==2 && inflag!=0){ //无 out 参数 && in 未排除
                    Nlist.push(subi);
                }//
            }
        }
    }
    if(Pntf0!=0){
        nowrite=dwrite.length<=10?emojino[dwrite.length]:dwrite.length
        no1write=Nlist.length<=10?emojino[Nlist.length]:Nlist.length
        //$notify(no1write,Pin0)
        if(Pin0 && no1write!=" 0️⃣ "){ //有 in 参数就通知保留项目
            lk.msg("🤖 "+"重写引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 筛选参数: "+pfi+pfo,"☠️ 重写 rewrite 中保留以下"+no1write+"个匹配项:"+"\n ⨷ "+Nlist.join("\n ⨷ "),rwrite_link )
        } else if(dwrite.length>0 ){
            lk.msg("🤖 "+"重写引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 筛选参数: "+pfi+pfo,"☠️ 重写 rewrite 中已禁用以下"+nowrite+"个匹配项:"+"\n ⨷ "+dwrite.join("\n ⨷ "),rwrite_link )}
    }
    if(Nlist.length==0){lk.msg("🤖 "+"重写引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 筛选参数: "+pfi+pfo,"⚠️ 筛选后剩余rewrite规则数为 0️⃣ 条, 请检查参数及原始链接",nan_link)}
    if(hostname!=""){Nlist.push(hostname)}
    return Nlist
}

// 主机名处理
function HostNamecheck(content,parain,paraout){
    var hname=content.replace(/ /g,"").split("=")[1].split(",");
    var nname=[];
    var dname=[]; //删除项
    for(var i=0;i<hname.length;i++){
        dd=hname[i]
        const excludehn = (item) => dd.indexOf(item)!=-1;
        if(paraout && paraout!=""){ //存在 out 参数时
            if(!paraout.some(excludehn)){ //out 未命中🎯️
                if(parain && parain!=""){
                    if(parain.some(excludehn)){ //Pin 命中🎯️
                        nname.push(hname[i])
                    } else{lk.msg("..xx")
                        dname.push(hname[i])} //Pin 未命中🎯️的记录
                }else{nname.push(hname[i])}	//无in 参数
            }else{dname.push(hname[i])} //out 参数命中
        }else if(parain && parain!=""){ //不存在 out，但有 in 参数时
            if(parain.some(excludehn)){ //Pin 命中🎯️
                nname.push(hname[i])
            }else{dname.push(hname[i])}
        }else {
            nname.push(hname[i])
        }
    } //for j
    hname="hostname="+nname.join(", ");
    // $notify(hname,dname)
    if(Pntf0!=0){
        if(paraout || parain){
            var noname=dname.length<=10?emojino[dname.length]:dname.length
            var no1name=nname.length<=10?emojino[nname.length]:nname.length
            if(parain && no1name!=" 0️⃣ "){
                lk.msg("🤖 "+"重写引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 筛选参数: "+pfihn+pfohn,"☠️ 主机名 hostname 中已保留以下"+no1name+"个匹配项:"+"\n ⨷ "+nname.join(","),rwhost_link )
            } else if(dname.length>0){
                lk.msg("🤖 "+"重写引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 筛选参数: "+pfihn+pfohn,"☠️ 主机名 hostname 中已删除以下"+noname+"个匹配项:"+"\n ⨷ "+dname.join(","),rwhost_link )}
        }
    }
    if(nname.length==0){
        lk.msg("🤖 "+"重写引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 筛选参数: "+pfihn+pfohn,"⚠️ 主机名 hostname 中剩余 0️⃣ 项, 请检查参数及原始链接",nan_link )
    }
    return hname
}

//Rewrite 筛选的函数
function Rcheck(content,param){
    name=content.toUpperCase()
    if(param){
        var flag=0; //没命中
        const checkpara= (item) => name.indexOf(item.toUpperCase()) !=-1;
        if(param.some(checkpara)){
            flag=1 //命中
        }
        return flag
    }else { //if param
        return 2} //无参数
}

//分流规则转换及过滤，可用于 surge 及 quanx 的 rule-list
function Rule_Handle(subs,Pout,Pin){
    cnt=subs //.split("\n");
    Tin=Pin; //保留参数
    Tout=Pout; //过滤参数
    ply=Ppolicy; //策略组
    var nlist=[]
    var RuleK=["//","#",";"];
    if(Tout!="" && Tout!=null){ // 有 out 参数时
        var dlist=[];
        for(var i=0;i<cnt.length;i++){
            cc=cnt[i]
            const exclude = (item) =>cc.indexOf(item)!=-1; // 删除项
            const RuleCheck = (item) => cc.indexOf(item)!=-1; //无视注释行
            if(Tout.some(exclude) && !RuleK.some(RuleCheck)){
                dlist.push(Rule_Policy("-"+cnt[i]))
            } else if(!RuleK.some(RuleCheck) && cc ){ //if Pout.some, 不操作注释项
                dd=Rule_Policy(cc);
                if(Tin!="" && Tin!=null){
                    const include = (item) =>dd.indexOf(item)!=-1; // 保留项
                    if(Tin.some(include)){
                        nlist.push(dd);
                    }
                }else{nlist.push(dd);
                }
            } //else if cc
        }//for cnt
        var no=dlist.length<=10?emojino[dlist.length]:dlist.length
        if(dlist.length>0 ){ if(Pntf0!=0){lk.msg("🤖 "+"分流引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 禁用: "+ Tout,"☠️ 已禁用以下"+no+"条匹配规则:"+"\n ⨷ "+dlist.join("\n ⨷ "),rule_link)}
        }else{lk.msg("🤖 "+"分流引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 禁用: "+Tout,"⚠️ 未发现任何匹配项, 请检查参数或原始链接",nan_link)}
        if(Tin!="" && Tin!=null){  //有 in 跟 out 参数时
            if(nlist.length>0 ){
                var noin0=nlist.length<=10?emojino[nlist.length]:nlist.length
                if(Pntf0!=0){
                    lk.msg("🤖 "+"分流引用  ➟ "+"⟦"+subtag+"⟧","✅ 保留:"+Tin,"🎯 已保留以下 "+noin0+"条匹配规则:"+"\n ⨁ "+nlist.join("\n ⨁ "),rule_link)}
            } else{lk.msg("🤖 "+"分流引用  ➟ "+"⟦"+subtag+"⟧","✅ 保留:"+Tin+",⛔️ 禁用: "+Tout,"⚠️ 筛选后剩余规则数为 0️⃣ 条, 请检查参数及原始链接",nan_link)
            }
        } else {// if Tin (No Tin)
            if(nlist.length==0 ){
                lk.msg("🤖 "+"分流引用  ➟ "+"⟦"+subtag+"⟧","⛔️ 禁用: "+Tout,"⚠️ 筛选后剩余规则数为 0️⃣ 条, 请检查参数及原始链接",nan_link)
            }
        }
        return [...dlist,...nlist];
    } else if(Tin!="" && Tin!=null){ //if Tout
        var dlist=[];
        for(var i=0;i<cnt.length;i++){
            cc=cnt[i]
            const RuleCheck = (item) => cc.indexOf(item)!=-1; //无视注释行
            if(!RuleK.some(RuleCheck) && cc ){ //if Pout.some, 不操作注释项
                dd=Rule_Policy(cc);
                const include = (item) =>dd.indexOf(item)!=-1; // 保留项
                if(Tin.some(include)){
                    nlist.push(dd);
                }else{dlist.push("-"+dd)}
            }
        } // for cnt
        if(nlist.length>0){
            var noin=nlist.length<=10?emojino[nlist.length]:nlist.length
            if(Pntf0!=0){
                lk.msg("🤖 "+"分流引用  ➟ "+"⟦"+subtag+"⟧","✅ 保留:"+Tin,"🎯 已保留以下 "+noin+"条匹配规则:"+"\n ⨁ "+nlist.join("\n ⨁ "),rule_link)}
        } else{lk.msg("🤖 "+"分流引用  ➟ "+"⟦"+subtag+"⟧","✅ 保留:"+Tin,"⚠️ 筛选后剩余规则数为 0️⃣ 条, 请检查参数及原始链接",nan_link)}
        return [...dlist,...nlist];
    } else {  //if Tin
        return cnt.map(Rule_Policy)
    }
}

function Rule_Policy(content){ //增加、替换 policy
    var cnt=content.split(",");
    var RuleK=["//","#",";"];
    var RuleK1=["host","domain","ip-cidr","geoip","user-agent","ip6-cidr"];
    const RuleCheck = (item) => cnt[0].toLowerCase().indexOf(item)!=-1; //无视注释行
    const RuleCheck1 = (item) => cnt[0].toLowerCase().indexOf(item)!=-1; //无视 quanx 不支持的规则类别
    if(RuleK1.some(RuleCheck1)){
        if(cnt.length==3 && cnt.indexOf("no-resolve")==-1){
            ply0 = Ppolicy!="Shawn"? Ppolicy:cnt[2]
            nn=cnt[0]+", "+cnt[1]+", "+ply0
        } else if(cnt.length==2){ //Surge rule-set
            ply0 = Ppolicy!="Shawn"? Ppolicy:"Shawn"
            nn=cnt[0]+", "+cnt[1]+", "+ply0
        }else if(cnt.length==3 && cnt[2].indexOf("no-resolve")!=-1){
            ply0 = Ppolicy!="Shawn"? Ppolicy:"Shawn"
            nn=cnt[0]+", "+cnt[1]+", "+ply0+", "+cnt[2]
        }else if(cnt.length==4 && cnt[3].indexOf("no-resolve")!=-1){
            ply0 = Ppolicy!="Shawn"? Ppolicy:cnt[2]
            nn=cnt[0]+", "+cnt[1]+", "+ply0+", "+cnt[3]
        }else if(!RuleK.some(RuleCheck)&& content){
            lk.msg("未能解析"+"⟦"+subtag+"⟧"+"其中部分规则:",content,nan_link);
            return ""
        }else{return ""}
        if(cnt[0].indexOf("URL-REGEX")!=-1 || cnt[0].indexOf("PROCESS")!=-1){
            nn=""
        } else {nn=nn.replace("IP-CIDR6","ip6-cidr")}
        return nn
    } else{return ""}//if RuleK1 check
}

//混合订阅类型，用于整体进行了 base64 encode 后的类型
function SubsEd2QX(subs,Pudp,Ptfo,Pcert,Ptls13){
    var list0=Base64.decode(subs).split("\n");
    //$notify("After B64","lists",list0)
    var QuanXK=["shadowsocks=","trojan=","vmess=","http="];
    var SurgeK=["=ss","=vmess","=trojan","=http","=custom"];
    var QXlist=[];
    for(var i=0;i<list0.length;i++){
        var node=""
        if(list0[i].trim().length>3){
            var type=list0[i].split("://")[0].trim()
            //$notify(type)
            var listi=list0[i].replace(/ /g,"")
            const QuanXCheck = (item) => listi.toLowerCase().indexOf(item)!=-1;
            const SurgeCheck = (item) => listi.toLowerCase().indexOf(item)!=-1;
            if(type=="vmess" && list0[i].indexOf("remarks=")==-1){
                var bnode=Base64.decode(list0[i].split("vmess://")[1])
                if(bnode.indexOf("over-tls=")==-1){ //v2rayN
                    node= V2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)
                }else{ //quantumult 类型
                    node= VQ2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)}
            }else if(type=="vmess" && list0[i].indexOf("remarks=")!=-1){
                node= VR2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)
            }else if(type=="ssr"){
                node= SSR2QX(list0[i],Pudp,Ptfo)
            }else if(type=="ss"){
                node = SS2QX(list0[i],Pudp,Ptfo)
            }else if(type=="trojan"){
                node = TJ2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)
            }else if(type=="https"&&listi.indexOf("@")!=-1){ //subs,Ptfo,Pcert,Ptls13
                node = HPS2QX(list0[i],Ptfo,Pcert,Ptls13)
            }else if(QuanXK.some(QuanXCheck)){
                node = list0[i]
            }else if(SurgeK.some(SurgeCheck)){
                node = Surge2QX(list0[i])
            }else if(LoonK.some(LoonCheck)){
                node = Loon2QX(list0[i])
            }
            //$notify("Final","results",node)
            if(node!=""){
                QXlist.push(node)}
        }
    }
    return QXlist
}

//混合订阅类型，用于未整体进行 base64 encode 的类型
function Subs2QX(subs,Pudp,Ptfo,Pcert,Ptls13){
    //$notify("start","cnt",subs)
    var list0=subs.split("\n");
    //$notify(list0,list0.length)
    var QuanXK=["shadowsocks=","trojan=","vmess=","http="];
    var SurgeK=["=ss","=vmess","=trojan","=http"];
    var LoonK=["=shadowsocks"]
    var QXlist=[];
    for(var i=0;i<list0.length;i++){
        var node=""
        if(list0[i].trim().length>3){
            var type=list0[i].split("://")[0].trim()
            var listi=list0[i].replace(/ /g,"")
            const QuanXCheck = (item) => listi.toLowerCase().indexOf(item)!=-1;
            const SurgeCheck = (item) => listi.toLowerCase().indexOf(item)!=-1;
            const LoonCheck = (item) => listi.toLowerCase().indexOf(item)!=-1;
            if(type=="vmess" && list0[i].indexOf("remarks=")==-1){
                var bnode=Base64.decode(list0[i].split("vmess://")[1])
                if(bnode.indexOf("over-tls=")==-1){ //v2rayN
                    node= V2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)
                }else{ //quantumult 类型
                    node= VQ2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)}
            }else if(type=="vmess" && list0[i].indexOf("remarks=")!=-1){
                node= VR2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)
            }else if(type=="ssr"){
                node= SSR2QX(list0[i],Pudp,Ptfo)
            }else if(type=="ss"){
                node = SS2QX(list0[i],Pudp,Ptfo)
            }else if(type=="ssd"){
                node = SSD2QX(list0[i],Pudp,Ptfo)
            }else if(type=="trojan"){
                node = TJ2QX(list0[i],Pudp,Ptfo,Pcert,Ptls13)
            }else if(type=="https"&&listi.indexOf("@")!=-1){
                node = HPS2QX(list0[i],Ptfo,Pcert,Ptls13)
            }else if(QuanXK.some(QuanXCheck)){
                //$notify("QX")
                node = list0[i]
            }else if(SurgeK.some(SurgeCheck)){
                //$notify("surge")
                node = Surge2QX(list0[i])
            }else if(LoonK.some(LoonCheck)){
                node = Loon2QX(list0[i])
            }
            if (node instanceof Array){
                for (var j in node) {
                    QXlist.push(node[j])
                }
            }else if(node!=""){
                QXlist.push(node)
            }
        }
    }
    //$notify("final", "list", QXlist)
    return QXlist
}

// 检查节点名字(重复以及空名)等QuanX 不允许的情形
function TagCheck_QX(content){
    var Olist=content
    var Nlist=[]
    var nmlist=[]
    var nulllist=[]; //记录空名字节点
    var duplist=[];  //记录重名节点
    var no=0;
    for(var i=0;i<Olist.length;i++){
        var item=Olist[i]?Olist[i]:""
        if(item.replace(/ /gm,"").indexOf("tag=")!=-1){
            var nl=item.slice(item.indexOf("tag"))
            //$notify(nl)
            var nm=nl.slice(nl.indexOf("=")+1)
            if(nm==""){ //空名字
                nm=" ["+item.split("=")[0]+"] "+item.split("=")[1].split(",")[0].split(":")[0]
                item=item.split("tag")[0]+"tag="+nm.replace("shadowsocks","ss")
                nulllist.push(nm.replace("shadowsocks","ss"))
            }
            var ni=0
            while(nmlist.indexOf(nm)!=-1){ //重名
                nm=ni<=10? nm.split(" ⌘")[0]+" ⌘"+emojino[ni]:nm.split(" ⌘")[0]+" ⌘"+ni
                item=item.split("tag")[0]+"tag="+nm
                ni=ni+1
            }
            if(ni!=0){ duplist.push(nm)}
            nmlist.push(nm)
            ni=0
            Nlist.push(item)
        }// if "tag="
    } // for
    //$notify(nulllist.length,)
    if(nulllist.length>=1){
        no= nulllist.length<=10? emojino[nulllist.length]:nulllist.length ;
        lk.msg("⚠️ 引用"+"⟦"+subtag+"⟧"+" 内有"+no+"个空节点名 ", "✅ 已将节点“类型+IP”设为节点名"," ⨁ "+nulllist.join("\n ⨁ "),nan_link)}
    if(duplist.length>=1){
        no= duplist.length<=10? emojino[duplist.length]:duplist.length ;
        lk.msg("⚠️ 引用"+"⟦"+subtag+"⟧"+" 内有"+no+"个重复节点名 ", "✅ 已添加⌘符号作为区分:", " ⨁ "+duplist.join("\n ⨁ "),nan_link)}
    return Nlist
}
//http=example.com:443, username=name, password=pwd, over-tls=true, tls-host=example.com, tls-verification=true, tls13=true, fast-open=false, udp-relay=false, tag=http-tls-02
//HTTPS 类型 URI 转换成 QUANX 格式
function HPS2QX(subs,Ptfo,Pcert,Ptls13){
    var server=Base64.decode(subs.replace("https://","")).trim().split("\u0000")[0];
    var nss=[]
    if(server!=""){
        var ipport="http="+server.split("@")[1].split("#")[0].split("/")[0];
        var uname="username="+server.split(":")[0];
        var pwd="password="+server.split("@")[0].split(":")[1];
        var tag="tag="+server.split("#")[1];
        var tls="over-tls=true";
        var cert=Pcert!=0? "tls-verification=true":"tls-verification=false";
        var tfo=Ptfo==1? "fast-open=true":"fast-open=false";
        var tls13=Ptls13==1? "tls13=true":"tls13=false";
        nss.push(ipport,uname,pwd,tls,cert,tfo,tls13,tag)
    }
    var QX=nss.join(",");
    return QX
    //$notify("ts","content",QX)
}

//quantumult 格式的 vmess URI 转换
function VQ2QX(subs,Pudp,Ptfo,Pcert,Ptls13){
    var server=String(Base64.decode(subs.replace("vmess://","").trim()).split("\u0000")[0])
    var node=""
    var ip="vmess="+server.split(",")[1].trim()+":"+server.split(",")[2].trim()+", "+"method=aes-128-gcm, "+"password="+server.split(",")[4].split("\"")[1]+", "
    var tag="tag="+server.split("=")[0]
    var tfo=subs.indexOf("tfo=1")!=-1? "fast-open=true, ":"fast-open=false, "
    var udp= Pudp==1? "udp-relay=true, ":"udp-relay=false, ";
    node=ip+tfo+udp
    var obfs=""
    if(server.indexOf("obfs=")==-1){ // 非 ws 类型
        obfs=server.indexOf("over-tls=true")!=-1? "obfs=over-tls, ":"" //over-tls
        var host=server.indexOf("tls-host")!=-1? "obfs-host="+server.split("tls-host=")[1].split(",")[0]+", ":""
        obfs=obfs+host
    }else if(server.indexOf("obfs=ws")!=-1){
        obfs=server.indexOf("over-tls=true")!=-1? "obfs=wss, ":"obfs=ws, " //ws,wss 类型
        var uri=server.indexOf("obfs-path=")!=-1? "obfs-uri="+server.split("obfs-path=")[1].split("\"")[1]+", ":"obfs-uri=/, "
        obfs=obfs+uri
        var host=server.indexOf("obfs-header=")!=-1? "obfs-host="+server.split("obfs-header=\"Host:")[1].split("[")[0].trim()+", ":""
        obfs=obfs+host
    }
    if(obfs.indexOf("obfs=over-tls")!=-1||obfs.indexOf("obfs=wss")!=-1 ){
        var cert= Pcert!=0 || subs.indexOf("allowInsecure=1")!=-1 ? "tls-verification=false, ":"tls-verification=true, "
        var tls13=Ptls13==1? "tls13=true, ":""
        obfs=obfs+cert+tls13
    }
    node=node+obfs+tag
    return node
}

//Shadowrocket 格式的 vmess URI 转换
function VR2QX(subs,Pudp,Ptfo,Pcert,Ptls13){
    var server=String(Base64.decode(subs.replace("vmess://","").split("?remarks")[0]).trim()).split("\u0000")[0]
    var node=""
    var ip="vmess="+server.split("@")[1]+", "+"method=aes-128-gcm, "+"password="+server.split("@")[0].split(":")[1]+", "
    var tag="tag="+decodeURIComponent(subs.split("remarks=")[1].split("&")[0])
    var tfo=subs.indexOf("tfo=1")!=-1? "fast-open=true, ":"fast-open=false, "
    var udp= Pudp==1? "udp-relay=true, ":"udp-relay=false, ";
    node=ip+tfo+udp
    var obfs=subs.split("obfs=")[1].split("&")[0]
    if(obfs=="none"){ //
        obfs=subs.indexOf("tls=1")!=-1? "obfs=over-tls, ":"" //over-tls
    }else if(obfs=="websocket"){
        obfs=subs.indexOf("tls=1")!=-1? "obfs=wss, ":"obfs=ws," //ws,wss 类型
        obfs=obfs+"obfs-uri="+subs.split("&path=")[1].split("&")[0]+", "
        var host=subs.indexOf("&obfsParam=")!=-1? "obfs-host="+subs.split("&obfsParam=")[1].split("&")[0]+", ":""
        obfs=obfs+host
    }
    if(obfs.indexOf("obfs=over-tls")!=-1||obfs.indexOf("obfs=wss")!=-1 ){
        var cert= Pcert!=0 || subs.indexOf("allowInsecure=1")!=-1 ? "tls-verification=false, ":"tls-verification=true, "
        var tls13=Ptls13==1? "tls13=true, ":""
        obfs=obfs+cert+tls13
    }
    node=node+obfs+tag
    return node
}

//V2RayN uri转换成 QUANX 格式
function V2QX(subs,Pudp,Ptfo,Pcert,Ptls13){
    var cert=Pcert
    var tls13=Ptls13
    var server=String(Base64.decode(subs.replace("vmess://","")).trim()).split("\u0000")[0];
    var nss=[];
    if(server!=""){
        ss=JSON.parse(server);
        ip="vmess="+ss.add+":"+ss.port;
        pwd="password="+ss.id;
        mtd="method=aes-128-gcm"
        tag="tag="+decodeURIComponent(ss.ps);
        udp= Pudp==1? "udp-relay=true":"udp-relay=false";
        tfo= Ptfo==1? "fast-open=true":"fast-open=false";
        obfs=Pobfs(ss,cert,tls13);
        if(obfs=="" || obfs==undefined){
            nss.push(ip,mtd,pwd,tfo,udp,tag)
        }else {
            nss.push(ip,mtd,pwd,obfs,tfo,udp,tag);}
        QX=nss.join(", ");
    }
    return QX
}

// Vmess obfs 参数
function Pobfs(jsonl,Pcert,Ptls13){
    var obfsi=[];
    var cert=Pcert;
    tcert= cert==0? "tls-verification=false":"tls-verification=true";
    tls13= Ptls13==1? "tls13=true":"tls13=false"
    if(jsonl.net=="ws" && jsonl.tls=="tls"){
        obfs0="obfs=wss, "+tcert+", "+tls13+", ";
        uri0= jsonl.path && jsonl.path!=""? "obfs-uri="+jsonl.path:"obfs-uri=/";
        host0= jsonl.host && jsonl.host!=""? "obfs-host="+jsonl.host+",":"";
        obfsi.push(obfs0+host0+uri0)
        return obfsi.join(", ")
    }else if(jsonl.net=="ws"){
        obfs0="obfs=ws";
        uri0= jsonl.path && jsonl.path!=""? "obfs-uri="+jsonl.path:"obfs-uri=/";
        host0= jsonl.host && jsonl.host!=""? "obfs-host="+jsonl.host+",":"";
        obfsi.push(obfs0,host0+uri0);
        return obfsi.join(", ")
    }else if(jsonl.tls=="tls"){
        obfs0="obfs=over-tls, "+tcert+", "+tls13;
        uri0=jsonl.path && jsonl.path!=""? "obfs-uri="+jsonl.path:"";
        host0=jsonl.host && jsonl.host!=""? ", obfs-host="+jsonl.host:"";
        obfsi.push(obfs0+host0)
        return obfsi.join(", ")
    }
}

//对.的特殊处理(in/out & rename中)
function Dot2(cnt) {
    cnt=cnt? cnt.replace(/\\\./g,"这是个点"):""
    return cnt
}

function ToDot(cnt) {
    cnt=cnt? cnt.replace(/这是个点/g,"."):""
    return cnt
}

//正则筛选, 完整内容匹配
function Regex(content){
    Preg=RegExp(Preg,"i")
    cnt=content //.split("tag=")[1]
    if(Preg.test(cnt)){
        return content
    }
}

//正则筛选, 完整内容匹配
function RegexDel(content){
    delnodereg=RegExp(delnodereg,"i")
    cnt=content //.split("tag=")[1]
    if(!delnodereg.test(cnt)){
        return content
    }
}

// 判断节点过滤的函数
function Scheck(content,param){
    name=content.split("tag=")[1].toUpperCase()
    //$notify("before",param)
    param=param? param.map(Dot2):param // 对符号.的特殊处理
    //$notify("after",param)
    if(param){
        var flag=0;
        for(var i=0;i<param.length;i++){
            //console.log(param[i])
            var params=param[i].split(".").map(ToDot);
            //$notify(params)
            const checkpara= (item) => name.indexOf(item.toUpperCase()) !=-1;
            if(params.every(checkpara)){
                flag=1
            }
        }//for
        return flag
    }else { //if param
        return 2}
}

//节点过滤，使用+连接多个关键词(逻辑"或"):in 为保留，out 为排除, "与"逻辑请用符号"."连接
function Filter(servers,Pin,Pout){
    var Nlist=[];
    var Delist=[];
    var Nname=[];
    for(var i=0;i<servers.length;i++){
        if(Scheck(servers[i],Pin)!=0 && Scheck(servers[i],Pout)!=1){
            Nlist.push(servers[i])
            Nname.push(servers[i].replace(/ /g,"").split("tag=")[1])
        }else{Delist.push(servers[i].replace(/ /g,"").split("tag=")[1])} //记录未被保留节点
    }//for
    var no= Delist.length<=10? emojino[ Delist.length]:Delist.length ;
    var no1= Nlist.length<=10? emojino[ Nlist.length]:Nlist.length ;
    if(Pntf0==1 && Delist.length>=1){//通知部分
        if(Pin && no1>0){ //有 in 参数就通知保留部分
            lk.msg("👥 引用"+"⟦"+subtag+"⟧"+" 开始节点筛选","🕹 筛选关键字: "+pfi+pfo, "☠️ 已保留以下 "+no1+"个节点\n"+Nname.join(", "),sub_link);
        }else if(Pout && no>0){
            lk.msg("👥 引用"+"⟦"+subtag+"⟧"+" 开始节点筛选","🕹 筛选关键字: "+pfi+pfo, "☠️ 已删除以下 "+no+"个节点\n"+Delist.join(", "),sub_link);
        }
    }else if(no1==0 || no1==null){ //无剩余节点时强制通知
        lk.msg("‼️ ⟦"+subtag+"⟧"+"筛选后节点数为0️⃣","⚠️ 请自行检查原始链接以及筛选参数", link0, sub_link);}
    //$notify("After",no1,Nlist)
    return Nlist
}

//SSR 类型 URI 转换 quanx 格式
function SSR2QX(subs,Pudp,Ptfo){
    var nssr=[]
    var cnt=Base64.decode(subs.split("ssr://")[1].replace(/-/g,"+").replace(/_/g,"/")).split("\u0000")[0]
    var obfshost = '';
    var oparam = '';
    if(cnt.split(":").length<=6) { //排除难搞的 ipv6 节点
        type="shadowsocks=";
        ip=cnt.split(":")[0]+":"+cnt.split(":")[1];
        pwd="password="+Base64.decode(cnt.split("/?")[0].split(":")[5].replace(/-/g,"+").replace(/_/g,"/")).split("\u0000")[0];
        mtd="method="+cnt.split(":")[3];
        obfs="obfs="+cnt.split(":")[4]+", ";
        ssrp="ssr-protocol="+cnt.split(":")[2];
        if(cnt.indexOf("obfsparam=")!=-1){
            obfshost=cnt.split("obfsparam=")[1].split("&")[0]!=""? "obfs-host="+Base64.decode(cnt.split("obfsparam=")[1].split("&")[0].replace(/-/g,"+").replace(/_/g,"/")).split(",")[0].split("\u0000")[0]+", ":""
        }
        if(cnt.indexOf("protoparam=")!=-1){
            oparam=cnt.split("protoparam=")[1].split("&")[0]!=""? "ssr-protocol-param="+Base64.decode(cnt.split("protoparam=")[1].split("&")[0].replace(/-/g,"+").replace(/_/g,"/")).split(",")[0].split("\u0000")[0]+", ":""
        }
        tag="tag="+(Base64.decode(cnt.split("remarks=")[1].split("&")[0].replace(/-/g,"+").replace(/_/g,"/"))).split("\u0000")[0]
        //console.log(Base64.decode(cnt.split("remarks=")[1].split("&")[0].replace(/-/g,"+").replace(/_/g,"/")))
        pudp= Pudp==1? "udp-relay=true":"udp-relay=false";
        ptfo= Ptfo==1? "fast-open=true":"fast-open=false";
        nssr.push(type+ip,pwd,mtd,obfs+obfshost+oparam+ssrp,pudp,ptfo,tag)
        QX=nssr.join(", ")
    }else {QX=""}
    return QX;
}

//Trojan 类型 URI 转换成 QX
function TJ2QX(subs,Pudp,Ptfo,Pcert,Ptls13){
    var ntrojan=[]
    var cnt=subs.split("trojan://")[1]
    type="trojan=";
    if(cnt.indexOf(":443")!=-1){
        ip=cnt.split("@")[1].split(":443")[0]+":443";
    }else{
        ip=cnt.split("@")[1].split("?")[0].split("\n")[0].trim(); //非 443 端口的奇葩机场？
    }
    pwd="password="+cnt.split("@")[0];
    obfs="over-tls=true";
    pcert= cnt.indexOf("allowInsecure=0")!= -1? "tls-verification=true":"tls-verification=false";
    ptls13= Ptls13==1?"tls13=true":"tls13=false"
    if(Pcert==0){pcert="tls-verification=false"}
    pudp= Pudp==1? "udp-relay=true":"udp-relay=false";
    ptfo= Ptfo==1? "fast-open=true":"fast-open=false";
    tag=cnt.indexOf("#")!=-1? "tag="+decodeURIComponent(cnt.split("#")[1]):"tag= [trojan]"+ip
    ntrojan.push(type+ip,pwd,obfs,pcert,ptls13,pudp,ptfo,tag)
    QX=ntrojan.join(", ");
    return QX;
}

//SS 类型 URI 转换 quanx 格式
function SS2QX(subs,Pudp,Ptfo){
    var nssr=[]
    var cnt=subs.split("ss://")[1]
    //$notify("SS转换 ing","SS",cnt)
    if(cnt.split(":").length<=6) { //排除难搞的 ipv6 节点
        type="shadowsocks=";
        if(cnt.indexOf("@")!=-1){
            ip=cnt.split("@")[1].split("#")[0].split("/")[0];
            pwdmtd=Base64.decode(cnt.split("@")[0].replace(/-/g,"+").replace(/_/g,"/")).split("\u0000")[0].split(":")
        }else{
            var cnt0=Base64.decode(cnt.split("#")[0].replace(/-/g,"+").replace(/_/g,"/").split("\u0000")[0]);
            ip=cnt0.split("@")[1].split("#")[0].split("/")[0];
            pwdmtd=cnt0.split("@")[0].split(":")
        }
        pwd="password="+pwdmtd[1];
        mtd="method="+pwdmtd[0];
        obfs= cnt.split("obfs%3D")[1]!=null ? ", obfs="+cnt.split("obfs%3D")[1].split("%3B")[0]: "";
        obfshost=cnt.split("obfs-host%3D")[1]!=null ? ", obfs-host="+cnt.split("obfs-host%3D")[1].split("&")[0].split("#")[0]:"";
        tag="tag="+decodeURIComponent(cnt.split("#")[1])
        pudp= Pudp==1? "udp-relay=true":"udp-relay=false";
        ptfo= Ptfo==1? "fast-open=true":"fast-open=false";
        nssr.push(type+ip,pwd,mtd+obfs+obfshost,pudp,ptfo,tag)
        QX=nssr.join(", ")
        return QX;
        //console.log(QX)
    }
}

//SSD 类型 URI 转换 quanx 格式
function SSD2QX(subs,Pudp,Ptfo){
    var j=0
    var QX=[]
    var cnt=JSON.parse(Base64.decode(subs.split("ssd://")[1]))
    var type="shadowsocks=";
    var pwd="password="+cnt.password;
    var mtd="method="+cnt.encryption;
    var obfs=""
    var obfshost=""
    var port=cnt.port? ":"+cnt.port:""
    if(cnt.plugin_options){
        obfs=cnt.plugin_options.split(";")[0]!=null ? ", "+cnt.plugin_options.split(";")[0]: "";
        obfshost=cnt.plugin_options.split(";")[1]!=null ? ", "+cnt.plugin_options.split(";")[1]: "";
    }
    pudp= Pudp==1? "udp-relay=true":"udp-relay=false";
    ptfo= Ptfo==1? "fast-open=true":"fast-open=false";
    for (var i in cnt.servers) {
        ip=cnt.servers[i].server;
        if(cnt.servers[i].plugin_options){
            obfs=cnt.servers[i].plugin_options.split(";")[0]!=null ? ", "+cnt.servers[i].plugin_options.split(";")[0]: "";
            obfshost=cnt.servers[i].plugin_options.split(";")[1]!=null ? ", "+cnt.servers[i].plugin_options.split(";")[1]: "";
        }
        if(cnt.servers[i].encryption){  //独立的加密方式
            mtd="method="+cnt.servers[i].encryption
        }
        if(cnt.servers[i].password){  //独立的密码
            pwd="password="+cnt.servers[i].password
        }
        if(ip.indexOf(".")>0){ //排除难搞的 ipv6 节点
            port=cnt.servers[i].port?":"+cnt.servers[i].port:port;
            tag="tag="+cnt.servers[i].remarks;
            QX[j]=type+ip+port+", "+pwd+", "+mtd+obfs+obfshost+", "+pudp+", "+ptfo+", "+tag;
            var j=j+1;
        }
    }
    //$notify("QX","tst",QX)
    return QX;
    //console.log(QX)
}

// 用于过滤非节点部分（比如整份配置中其它内容）
function isQuanX(content){
    var cnts=content.split("\n");
    var nlist=[]
    for(var i=0;i<cnts.length;i++){
        var cnti=cnts[i];
        if(cnti.indexOf("=")!=-1&&cnti.indexOf("tag")!=-1){
            var cnt=cnti.split("=")[0].trim()
            if(cnt=="http"||cnt=="shadowsocks"||cnt=="trojan"||cnt=="vmess"){
                nlist.push(cnti)
            }
        }
    }
    return nlist
}

//根据节点名排序(不含emoji 部分)
function QXSort(content,para){
    var nlist=content;//.split("\n");
    if(para==1){
        return nlist.sort(ToTag)
    }else if(para==-1){
        return nlist.sort(ToTagR)
    }
}
//正序
function ToTag(elem1,elem2){
    var tag1=emoji_del(elem1.split("tag")[1].split("=")[1].trim())
    var tag2=emoji_del(elem2.split("tag")[1].split("=")[1].trim())
    res = tag1>tag2? 1:-1
    return res
}
//逆序
function ToTagR(elem1,elem2){
    var tag1=emoji_del(elem1.split("tag")[1].split("=")[1].trim())
    var tag2=emoji_del(elem2.split("tag")[1].split("=")[1].trim())
    res = tag1>tag2? -1:1
    return res
}

//正则删除节点名内的字符
function DelReg(content){
    delreg=RegExp(delreg,"gmi")
    cnt0=content.split("tag=")[0]
    cnt1=content.split("tag=")[1]
    cnt=cnt0+"tag="+cnt1.replace(delreg,"")
    return cnt
}

//节点重命名
function Rename(str){
    var server=str;
    if(server.indexOf("tag=")!=-1){
        hd=server.split("tag=")[0]
        name=server.split("tag=")[1].trim()
        for(var i=0;i<Prn.length;i++){
            nname=Prn[i].split("@")[1]? decodeURIComponent(Prn[i].split("@")[1]):Prn[i].split("@")[1];
            oname=Prn[i].split("@")[0]? decodeURIComponent(Prn[i].split("@")[0]):Prn[i].split("@")[0];
            if(oname&&nname){ //重命名
                var rn=escapeRegExp(oname)
                name=name.replace(new RegExp(rn,"gmi"),nname)
            }else if(oname && nname==""){//前缀
                var nemoji=emoji_del(name)
                if(Pemoji==1 || Pemoji==2){ //判断是否有重复 emoji，有则删除旧有
                    name=name.replace(name.split(" ")[0]+" ",name.split(" ")[0]+" "+oname)
                }else { name=oname+name}
            }else if(nname && oname==""){//后缀
                name= name+nname
            }else if(oname && oname.indexOf("☠️")!=-1){ //删除特定字符，多字符用.连接
                hh=Dot2(oname.slice(0,oname.length-2)).split(".") //符号.的特殊处理
                for(j=0;j<hh.length;j++){
                    var nn=escapeRegExp(ToDot(hh[j]))
                    var del=new RegExp(nn,"gmi");
                    name=name.replace(del,"")
                }
            }else if(oname=="" && nname==""){ //仅有@时，删除@符号
                name=name.replace(/@/g,"")
            }else{
                name=name}
            nserver=hd+"tag="+name
        }
    } return nserver
}

//删除 emoji
function emoji_del(str) {
    return unescape(escape(str).replace(/\%uD.{3}/g, ''));
}

//为节点名添加 emoji
function get_emoji(source,sname){
    var cnt=source;
    var flag=0;
    for(var key in cnt){
        dd=cnt[key]
        for(i in dd){
            if(sname.indexOf(dd[i])!=-1){
                flag=1;
                sname=Pemoji==1 && key=="🇹🇼"? sname.replace("🇨🇳","🇹🇼"):sname;
                sname=Pemoji==2 && key==" 🇨🇳"? sname.replace("🇹🇼","🇨🇳"):sname; //避免key重复，所以" 🇨🇳" 与"🇨🇳"
                nname=sname.indexOf(key.trim())==-1? key+" "+sname.trim():key+" "+sname.replace(key.trim(),"").trim();
                return nname
                break;
            }
        }
    }
    if(flag==0){return "🏴‍☠️ "+sname.trim()}
}

//emoji 处理
function emoji_handle(servers,Pemoji){
    var nlist=[]
    var ser0=servers
    for(var i=0;i<ser0.length; i++){
        if(ser0[i].indexOf("tag=")!=-1){
            var oname=ser0[i].split("tag=")[1].trim();
            var hd=ser0[i].split("tag=")[0];
            var nname=oname;//emoji_del(oname);
            var Lmoji={"🏳️‍🌈": ["流量","时间","应急","过期","Bandwidth","expire"],"🇦🇨": ["AC"],"🇦🇹": ["奥地利","维也纳"],"🇦🇺": ["AU","Australia","Sydney","澳大利亚","澳洲","墨尔本","悉尼"],"🇧🇪": ["BE","比利时"],"🇧🇬": ["保加利亚","Bulgaria"],"🇧🇷": ["BR","Brazil","巴西","圣保罗"],"🇨🇦": ["Canada","Waterloo","加拿大","蒙特利尔","温哥华","楓葉","枫叶","滑铁卢","多伦多"],"🇨🇭": ["瑞士","苏黎世","Switzerland"],"🇩🇪": ["DE","German","GERMAN","德国","德國","法兰克福"],"🇩🇰": ["丹麦"],"🇪🇸": ["ES","西班牙","Spain"],"🇪🇺": ["EU","欧盟","欧罗巴"],"🇫🇮": ["Finland","芬兰","赫尔辛基"],"🇫🇷": ["FR","France","法国","法國","巴黎"],"🇬🇧": ["UK","GB","England","United Kingdom","英国","伦敦","英"],"🇲🇴": ["MO","Macao","澳门","CTM"],"🇭🇺":["匈牙利","Hungary"],"🇭🇰": ["HK","Hongkong","Hong Kong","香港","深港","沪港","呼港","HKT","HKBN","HGC","WTT","CMI","穗港","京港","港"],"🇮🇩": ["Indonesia","印尼","印度尼西亚","雅加达"],"🇮🇪": ["Ireland","爱尔兰","都柏林"],"🇮🇳": ["India","印度","孟买","Mumbai"],"🇰🇵": ["KP","朝鲜"],"🇰🇷": ["KR","Korea","KOR","韩国","首尔","韩","韓"],"🇱🇻":["Latvia","Latvija","拉脱维亚"], "🇲🇽️": ["MEX","MX","墨西哥"],"🇲🇾": ["MY","Malaysia","马来西亚","吉隆坡"],"🇳🇱": ["NL","Netherlands","荷兰","荷蘭","尼德蘭","阿姆斯特丹"],"🇵🇭": ["PH","Philippines","菲律宾"],"🇷🇴": ["RO","罗马尼亚"],"🇷🇺": ["RU","Russia","俄罗斯","俄羅斯","伯力","莫斯科","圣彼得堡","西伯利亚","新西伯利亚","京俄","杭俄"],"🇸🇦": ["沙特","迪拜"],"🇸🇪": ["SE","Sweden"],"🇸🇬": ["SG","Singapore","新加坡","狮城","沪新","京新","泉新","穗新","深新","杭新","广新"],"🇹🇭": ["TH","Thailand","泰国","泰國","曼谷"],"🇹🇷": ["TR","Turkey","土耳其","伊斯坦布尔"],"🇹🇼": ["TW","Taiwan","台湾","台北","台中","新北","彰化","CHT","台","HINET"],"🇺🇸": ["US","USA","America","United States","美国","美","京美","波特兰","达拉斯","俄勒冈","凤凰城","费利蒙","硅谷","矽谷","拉斯维加斯","洛杉矶","圣何塞","圣克拉拉","西雅图","芝加哥","沪美","哥伦布","纽约"],"🇻🇳": ["VN","越南","胡志明市"],"🇮🇹": ["Italy", "IT", "Nachash","意大利","米兰","義大利"],"🇿🇦":["South Africa","南非"],"🇦🇪":["United Arab Emirates","阿联酋"],"🇯🇵": ["JP","Japan","日", "日本","东京","大阪","埼玉","沪日","穗日","川日","中日","泉日","杭日","深日","辽日","广日"],"🇦🇷": ["AR","阿根廷"],"🇳🇴":["Norway","挪威","NO"], "🇨🇳": ["CN","China","回国","中国","江苏","北京","上海","广州","深圳","杭州","徐州","青岛","宁波","镇江","back"]}
            if(Pemoji==1) {
                str1 = JSON.stringify(Lmoji)
                aa=JSON.parse(str1)
                var nname=get_emoji(aa,nname)
            } else if(Pemoji==2){
                str1 = JSON.stringify(Lmoji)
                bb=JSON.parse(str1.replace(/🇹🇼/g," 🇨🇳"))
                var nname=get_emoji(bb,nname)
            }else if(Pemoji==-1){
                nname=emoji_del(oname);
            }
            var nserver=hd+"tag="+nname.replace(" ️"," ").trim()
            nlist.push(nserver)
        }
    }
    return nlist
}

//Surge2QX 转换主函数
function Surge2QX(conf){
    var QXlist=conf.split("\n").map(isSurge).filter(Boolean)
    var Nlist=[]
    for(var i=0;i<QXlist.length;i++){
        var cnt=QXlist[i];
        //console.log(cnt)
        if(cnt.split("=")[1].split(",")[0].indexOf("trojan")!=-1){
            Nlist.push(Strojan2QX(cnt))//surge 3的trojan
        }else if(cnt.split("=")[1].split(",")[0].indexOf("http")!=-1){
            Nlist.push(Shttp2QX(cnt)) //surge 3的http
        }else if(cnt.split("=")[1].split(",")[0].indexOf("vmess")!=-1){
            Nlist.push(SVmess2QX(cnt)) //surge 3的Vmess
        }else if(cnt.split("=")[1].split(",")[0].indexOf("ss")!=-1){
            Nlist.push(SSS2QX(cnt)) //surge 3的SS
        }else if(cnt.split("=")[1].split(",")[0].indexOf("custom")!=-1){
            Nlist.push(SCT2QX(cnt)) //surge2写法
        }
    }
    return(Nlist)
    //console.log(Nlist)
}

// surge2 中的 SS 类型写法(custom)
//🇷🇺 俄罗斯 GIA = custom, ip, 152, aes-128-gcm, password123, https://xxx/download/SSEncrypt.module, obfs=tls, obfs-host=xxx.windows.com, udp-relay=true
function SCT2QX(content){
    var cnt=content;
    var tag="tag="+cnt.split("=")[0].trim();
    var ipport=cnt.split(",")[1].trim()+":"+cnt.split(",")[2].trim();
    var pmtd="method="+cnt.split(",")[3].trim();
    var pwd="password="+cnt.split(",")[4].trim();
    if(cnt.indexOf("obfs")!=-1){
        pobfs="obfs="+cnt.replace(/obfs-host/,"").split("obfs")[1].split(",")[0].split("=")[1]
    }else {pobfs=""}
    var phost=cnt.indexOf("obfs-host")!=-1? "obfs-host"+cnt.split("obfs-host")[1].split(",")[0].trim():"";
    if(phost!=""){
        pobfs=pobfs+", "+phost
    }
    var ptfo= paraCheck(cnt,"tfo")=="true"? "fast-open=true":"fast-open=false";
    var pudp= paraCheck(cnt,"udp")=="true"? "udp-relay=true":"udp-relay=false";
    var nserver= pobfs!=""? "shadowsocks= "+[ipport,pmtd,pwd,pobfs,ptfo,pudp,tag].join(", "):"shadowsocks= "+[ipport,pmtd,pwd,ptfo,pudp,tag].join(", ");
    return nserver
}


// surge 中的 SS 类型
function SSS2QX(content){
    var cnt=content;
    var tag="tag="+cnt.split("=")[0].trim();
    var ipport=cnt.split(",")[1].trim()+":"+cnt.split(",")[2].trim();
    var pmtd="method="+cnt.split("encrypt-method")[1].split(",")[0].split("=")[1];
    var pwd="password="+cnt.split("password")[1].split(",")[0].split("=")[1];
    if(cnt.indexOf("obfs")!=-1){
        pobfs="obfs="+cnt.replace(/obfs-host/,"").split("obfs")[1].split(",")[0].split("=")[1]
    }else {pobfs=""}
    var phost=cnt.indexOf("obfs-host")!=-1? "obfs-host"+cnt.split("obfs-host")[1].split(",")[0].trim():"";
    if(phost!=""){
        pobfs=pobfs+", "+phost
    }
    var ptfo= paraCheck(cnt,"tfo")=="true"? "fast-open=true":"fast-open=false";
    var pudp= paraCheck(cnt,"udp")=="true"? "udp-relay=true":"udp-relay=false";
    var nserver= pobfs!=""? "shadowsocks= "+[ipport,pmtd,pwd,pobfs,ptfo,pudp,tag].join(", "):"shadowsocks= "+[ipport,pmtd,pwd,ptfo,pudp,tag].join(", ");
    return nserver
}

// surge 中的 Vmess 类型
function SVmess2QX(content){
    var cnt=content;
    var tag="tag="+cnt.split("=")[0].trim();
    var ipport=cnt.split(",")[1].trim()+":"+cnt.split(",")[2].trim();
    var puname=cnt.indexOf("username")!=-1? "password="+cnt.split("username")[1].split(",")[0].split("=")[1].trim():"";
    var pmtd="method=aes-128-gcm";
    var ptls13=paraCheck(cnt,"tls13")=="true"? "tls13=true":"tls13=false";
    var pverify=paraCheck(cnt,"skip-cert-verify")=="true"? "tls-verification=false":"tls-verification=true";
    if(paraCheck(cnt.replace(/tls13/,""),"tls")=="true" && paraCheck(cnt.replace(/ws-header/,""),"ws")=="true"){
        pobfs="obfs=wss"+", "+ptls13+", "+pverify
    }else if(paraCheck(cnt.replace(/ws-header/,""),"ws")=="true"){
        pobfs="obfs=ws"
    }else if(paraCheck(cnt.replace(/tls13/,""),"tls")!="false"){
        pobfs="obfs=over-tls"+", "+ptls13+", "+pverify
    }else if(paraCheck(cnt.replace(/ws-header/,""),"ws")=="false"){
        pobfs=""
    }
    var puri=paraCheck(cnt,"ws-path")!="false"? "obfs-uri="+cnt.split("ws-path")[1].split(",")[0].split("=")[1].trim():"obfs-uri=/"
    var phost=cnt.indexOf("ws-headers")!=-1? "obfs-host="+cnt.split("ws-headers")[1].split(",")[0].split("=")[1].split("Host:")[1].trim():"";
    if(pobfs.indexOf("ws"||"wss")!=-1){
        if(phost!=""){
            pobfs=pobfs+", "+puri+", "+phost
        }else {pobfs=pobfs+", "+puri}
    }
    var ptfo= paraCheck(cnt,"tfo")=="true"? "fast-open=true":"fast-open=false";
    var nserver= pobfs!=""? "vmess= "+[ipport,puname,pmtd,pobfs,ptfo,tag].join(", "):"vmess= "+[ipport,puname,pmtd,ptfo,tag].join(", ");
    return nserver
}

// 用于过滤非节点部分（比如整份配置中其它内容）
function isSurge(content){
    if(content.indexOf("=")!=-1){
        cnt=content.split("=")[1].split(",")[0].trim()
        if(cnt=="http"||cnt=="ss"||cnt=="trojan"||cnt=="vmess"||cnt=="custom"){
            return content
        }
    }
}
// 用于参数检查
function paraCheck(content, para){
    if(content.indexOf(para)==-1){
        return "false"
    } else{
        return content.split(para)[1].split(",")[0].split("=")[1].trim()
    }
}
//surge中 trojan 类型转换
function Strojan2QX(content){
    var cnt=content;
    var tag="tag="+cnt.split("=")[0].trim();
    var ipport=cnt.split(",")[1].trim()+":"+cnt.split(",")[2].trim();
    var pwd="password="+cnt.split("password")[1].split(",")[0].split("=")[1].trim();
    var ptls="over-tls=true";
    var ptfo= paraCheck(cnt,"tfo")=="true"? "fast-open=true":"fast-open=false";
    var pverify=paraCheck(cnt,"skip-cert-verify")=="true"? "tls-verification=false":"tls-verification=true";
    var ptls13=paraCheck(cnt,"tls13")=="true"? "tls13=true":"tls13=false";
    var nserver="trojan= "+[ipport,pwd,ptls,ptfo,ptls13,pverify,tag].join(", ");
    return nserver
    //console.log(nserver)
}
// surge 中的 http 类型
function Shttp2QX(content){
    var cnt=content;
    var tag="tag="+cnt.split("=")[0].trim();
    var ipport=cnt.split(",")[1].trim()+":"+cnt.split(",")[2].trim();
    var puname=cnt.indexOf("username")!=-1? "username="+cnt.split("username")[1].split(",")[0].split("=")[1].trim():"";
    var pwd=cnt.indexOf("password")!=-1? "password="+cnt.split("password")[1].split(",")[0].split("=")[1].trim():"";
    var ptls=cnt.split("=")[1].split(",")[0].trim()=="https"? "over-tls=true":"over-tls=false";
    var ptfo= paraCheck(cnt,"tfo")=="true"? "fast-open=true":"fast-open=false";
    if(ptls=="over-tls=true"){
        var pverify=paraCheck(cnt,"skip-cert-verify")=="true"? "tls-verification=false":"tls-verification=true";
        var ptls13=paraCheck(cnt,"tls13")=="true"? "tls13=true":"tls13=false";
        ptls=ptls+", "+pverify+", "+ptls13
    }
    var nserver= puname!=""? "http= "+[ipport,puname,pwd,ptls,ptfo,tag].join(", "):"http= "+[ipport,ptls,ptfo,tag].join(", ");
    return nserver
}

function Loon2QX(cnt){
    var type=cnt.split("=")[1].split(",")[0].trim()
    var node=""
    if(type=="Shadowsocks"){ //ss 类型
        node=LoonSS2QX(cnt)
    }
    return node
}
//Loon 的 ss 部分
function LoonSS2QX(cnt){
    var node="shadowsocks="
    var ip=[cnt.split(",")[1].trim(),cnt.split(",")[2].trim()].join(":")
    var mtd="method="+cnt.split(",")[3].trim()
    var pwd="password="+cnt.split(",")[4].trim().split("\"")[1]
    var obfs=cnt.split(",").length==7? ", "+["obfs="+cnt.split(",")[5].trim(),"obfs-host="+cnt.split(",")[6].trim()].join(","):""
    var tag=", tag="+cnt.split("=")[0].trim()
    node=node+[ip,mtd,pwd].join(", ")+obfs+tag
    //$notify(node)
    return node
}

//比较完美的一款 base64 encode/decode 工具
/*
 *  base64.js: https://github.com/dankogai/js-base64#readme
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */
//base64 完毕
function Base64Code(){
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                    + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                        + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                        + fromCharCode(0x80 | ( cc         & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                + fromCharCode(0x80 | ( cc         & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt( ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };
    var btoa = function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    // var _encode = function(u) {
    // 	var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
    // 	return isUint8Array ? u.toString('base64')
    // 		: btoa(utob(String(u)));
    // }
    this.encode=function(u){
        var isUint8Array = Object.prototype.toString.call(u) === '[object Uint8Array]';
        return isUint8Array ? u.toString('base64')
            : btoa(utob(String(u)));
    }
    var uriencode = function(u, urisafe) {
        return !urisafe
            ? _encode(u)
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) { return uriencode(u, true) };
    // decoder stuff
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function(cccc) {
        switch(cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    |    ((0x3f & cccc.charCodeAt(1)) << 12)
                    |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                    |     (0x3f & cccc.charCodeAt(3)),
                    offset = cp - 0x10000;
                return (fromCharCode((offset  >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    |  (0x3f & cccc.charCodeAt(2))
                );
            default:
                return  fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                    |  (0x3f & cccc.charCodeAt(1))
                );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
            chars = [
                fromCharCode( n >>> 16),
                fromCharCode((n >>>  8) & 0xff),
                fromCharCode( n         & 0xff)
            ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var _atob = function(a){
        return a.replace(/\S{1,4}/g, cb_decode);
    };
    var atob = function(a) {
        return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    // var _decode = buffer ?
    // 	buffer.from && Uint8Array && buffer.from !== Uint8Array.from
    // 	? function(a) {
    // 		return (a.constructor === buffer.constructor
    // 				? a : buffer.from(a, 'base64')).toString();
    // 	}
    // 	: function(a) {
    // 		return (a.constructor === buffer.constructor
    // 				? a : new buffer(a, 'base64')).toString();
    // 	}
    // 	: function(a) { return btou(_atob(a)) };
    var _decode=function(u){
        return btou(_atob(u))
    }
    this.decode = function(a){
        return _decode(
            String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
}
function nobyda(){const e=Date.now();const t=typeof $request!="undefined";const n=typeof $httpClient!="undefined";const o=typeof $task!="undefined";const r=typeof $loon!="undefined";const s=typeof $app!="undefined"&&typeof $http!="undefined";const i=typeof require=="function"&&!s;const f=(()=>{if(i){const e=require("request");return{request:e}}else{return null}})();const u=()=>{if(o)return $resource.link;if(n)return $request.url;return""};const l=()=>{if(o)return $resource.content;if(n)return $response.body;return""};const d=(e,t,r)=>{if(o)$notify(e,t,r);if(n)$notification.post(e,t,r);if(i)g(e+t+r);if(s)$push.schedule({title:e,body:t?t+"\n"+r:r})};const c=(e,t)=>{if(o)return $prefs.setValueForKey(t,e);if(n)return $persistentStore.write(t,e)};const a=e=>{if(o)return $prefs.valueForKey(e);if(n)return $persistentStore.read(e)};const p=e=>{if(e){if(e.status){e["statusCode"]=e.status}else if(e.statusCode){e["status"]=e.statusCode}}return e};const y=(e,t)=>{if(o){if(typeof e=="string")e={url:e};e["method"]="GET";$task.fetch(e).then(e=>{t(null,p(e),e.body)},e=>t(e.error,null,null))}if(n)$httpClient.get(e,(e,n,o)=>{t(e,p(n),o)});if(i){f.request(e,(e,n,o)=>{t(e,p(n),o)})}if(s){if(typeof e=="string")e={url:e};e["header"]=e["headers"];e["handler"]=function(e){let n=e.error;if(n)n=JSON.stringify(e.error);let o=e.data;if(typeof o=="object")o=JSON.stringify(e.data);t(n,p(e.response),o)};$http.get(e)}};const $=(e,t)=>{if(o){if(typeof e=="string")e={url:e};e["method"]="POST";$task.fetch(e).then(e=>{t(null,p(e),e.body)},e=>t(e.error,null,null))}if(n){$httpClient.post(e,(e,n,o)=>{t(e,p(n),o)})}if(i){f.request.post(e,(e,n,o)=>{t(e,p(n),o)})}if(s){if(typeof e=="string")e={url:e};e["header"]=e["headers"];e["handler"]=function(e){let n=e.error;if(n)n=JSON.stringify(e.error);let o=e.data;if(typeof o=="object")o=JSON.stringify(e.data);t(n,p(e.response),o)};$http.post(e)}};const g=e=>{if(isEnableLog)console.log(`\n██${e}`)};const h=()=>{const t=((Date.now()-e)/1e3).toFixed(2);return console.log(`\n██用时：${t}秒`)};const b=e=>{let r=`body`;if(t){if(o)r=`content`;if(n)r=`body`}let s={};s[r]=e;if(o)t?$done(s):null;if(n)t?$done(s):$done();if(i)g(JSON.stringify(s))};return{isRequest:t,isJSBox:s,isSurge:n,isQuanX:o,isLoon:r,isNode:i,getRequestUrl:u,getResponseBody:l,msg:d,setValueForKey:c,getVal:a,get:y,post:$,log:g,time:h,done:b}}
