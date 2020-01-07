let path = '/api/apiClient/index';
var obj = JSON.parse(body)
if (url.indexOf(path) != -1) {
   obj["data"]["vvip_deadline"] = "3044071653";
   obj["data" ]["vvip"] = "1";
   obj["data" ]["u_credits"] = "666666"

}
JSON.stringify(obj)

// Made by Meeta （石头阅读）

// https?:\/\/app\.stoneread\.com/api\/apiClient\/index\?data
// hostname = app.stoneread.com
