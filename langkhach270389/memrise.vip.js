let obj = JSON.parse($response.body);
let url = $request.url;
const cons1 = "api.memrise.com/v1.16/me/";
const cons2 = "api.memrise.com/v1.16/dashboard/";
const cons3 = "leaderboards/following/";

if(url.indexOf(cons1) != -1) {
obj["profile"]["is_pro"] = true;
}

if(url.indexOf(cons2) != -1) {
obj["user"]["is_premium"] = true;
}

if(url.indexOf(cons3) != -1) {
obj["users"][0]["is_premium"] = true;
}
$done({body: JSON.stringify(obj)});