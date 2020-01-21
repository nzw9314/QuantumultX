let obj = JSON.parse($response.body);
let url = $request.url;
const cons1 = "me/";
const cons2 = "dashboard/";
const cons3 = "following/";

if(url.endsWith(cons1)) {
obj["profile"]["is_pro"] = true;
}

if(url.endsWith(cons2)) {
obj["user"]["is_premium"] = true;
}

if(url.indexOf(cons3) != -1 ) {
obj["users"][0]["is_premium"] = true;
}
$done({body: JSON.stringify(obj)});
