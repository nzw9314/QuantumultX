//Smart Qx&Surge + @Neurogam
let isQuantumultX = $task !== undefined;
let isSurge = $httpClient !== undefined;
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                }
            })

        }
    }
}
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
//end

console.log("🟢 Appmonitor");
let apps=["1457369322","1410006908","1504491325","1483387513","738897668","1047223162","1463342498","1459055246","438596432","1442620678","1497324992","453170202","355460798","1116905928","1373567447","1312014438","990591885","1141312799","1073473333","432850144","896694807","1434207799","924695435","680469088","869346854","935754064","1035331258","904237743","946930094","1373567447","916366645","1382419586","1299735217","1460078746","333710667","1049254261","1489780246","1407367202","436577167","1481018071","1315744137","1436650069","980368562","1007355333","1126386264","492648096","950519698","317107309","539397400","1444671526","1416894836","1117998129","1462386180","558818638","691121579","1474856599","436577167","641613694","1312014438","1416894836","1117998129","1462386180","558818638","691121579","1474856599","436577167","641613694","1312014438","1443988620"];
let reg="vn";
let notifys=[];
format_apps(apps);
function format_apps(x) {
    let apps_f={};
    x.forEach((n)=>{
        if(/^[a-zA-Z0-9:/|\-_\s]{1,}$/.test(n))
        {
            n=n.replace(/[/|\-_\s]/g,":");
            let n_n=n.split(":");
            if(n_n.length===1){
                if(apps_f.hasOwnProperty(reg)){
                    apps_f[reg].push(n_n);
                }
                else
                {
                    apps_f[reg]=[];
                    apps_f[reg].push(n_n[0])
                }
            }
            else if(n_n.length===2){
                if(apps_f.hasOwnProperty(n_n[1])){
                    apps_f[n_n[1]].push(n_n[0]);
                }
                else
                {
                    apps_f[n_n[1]]=[];
                    apps_f[n_n[1]].push(n_n[0])
                }
            }
            else{
                notifys.push(`ID error:【${n}】`)
            }
        }
        else{
            notifys.push(`ID error:【${n}】`)
        }
    });
    if(Object.keys(apps_f).length>0){
        post_data(apps_f);
    }
}
async function post_data(d) {
    try{
        let app_monitor=$prefs.valueForKey("app_monitor");
        if(app_monitor===""||app_monitor===undefined){
            app_monitor={}
        }
        else{
            app_monitor=JSON.parse(app_monitor)
        }
        let infos={};
        await Promise.all(Object.keys(d).map(async (k)=>{
            let config={
                url:'https://itunes.apple.com/lookup?id=' + d[k] + "&country=" + k,
                method:"post"
            };
            await $task.fetch(config).then((res)=>{
                let results=JSON.parse(res.body).results;
                if(Array.isArray(results)&&results.length>0){
                    results.forEach((x=>{
                        infos[x.trackId]={
                            n:x.trackName,
                            v:x.version,
                            p:x.formattedPrice
                        };
                        if(app_monitor.hasOwnProperty(x.trackId)){
                            if(JSON.stringify(app_monitor[x.trackId])!==JSON.stringify(infos[x.trackId])){
                                if(x.version!==app_monitor[x.trackId].v){
                                    notifys.push(`${flag(k)}🧩${x.trackName}:version【${x.version}】`)
                                }
                                if(x.formattedPrice!==app_monitor[x.trackId].p){
                                    notifys.push(`${flag(k)}💰${x.trackName}:price【${x.formattedPrice}】`)
                                }
                            }}
                        else{
                            notifys.push(`${flag(k)}🧩${x.trackName}:version【${x.version}】`);
                            notifys.push(`${flag(k)}💰${x.trackName}:price【${x.formattedPrice}】`)
                        }
                    }));
                }
                return Promise.resolve()
            }).catch((e)=>{
                console.log(e);
            });
        }));
        infos=JSON.stringify(infos);
        $prefs.setValueForKey(infos,"app_monitor");
        if(notifys.length>0){
            notify(notifys)
        }
        else{
            console.log("Appmonitor：No change 🔕")
        }
    }catch (e) {
        console.log(e);
    }
}
function notify(notifys){
    notifys=notifys.join("\n");
    console.log(notifys);
    $notify("Appmonitor","",notifys)
}
function flag(x){
  var flags = new Map([[ "AC" , "🇦🇨" ] , [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫🇴" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] , [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇸🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ]])
  return flags.get(x.toUpperCase())
}
