

//Smart Qx&Surge 
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

/*
Surge V4 ios, Mac
Api by junookyo

[Script]
cron "0 0 6-23/3 * * *" script-path=ncov.js


MITM = code.junookyo.xyz
*/
  var ncovUrl = {
    url: 'https://code.junookyo.xyz/api/ncov-moh/data.json',
  }
$httpClient.get(ncovUrl, function(error, response, data){
  if (error) {
$notification.post("NCOV", "", "Bad connection")
    $done(); 
  } 
 else{
 if(response.statusCode == 200)
{
let obj= JSON.parse(data);
if(obj["success"])
{
obj= obj["data"];
$notification.post("NCOV ","","🇻🇳 VN: Số người nhiễm: " + obj["vietnam"]["cases"] +", Người chết: " + obj["vietnam"]["deaths"] + ", Hồi phục: " + obj["vietnam"]["recovered"] +"\n🌍 Global:  Số người nhiễm: " + obj["global"]["cases"] +", Người chết: " + obj["global"]["deaths"] + ", Hồi phục: " + obj["global"]["recovered"]);
    $done();
}
}
else{
$notification.post("NCOV", "", "API ERROR");
}
}
});