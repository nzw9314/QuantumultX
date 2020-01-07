var obj = JSON.parse($response.body);
var url = $request.url;
var cons = "user/info";
if(url.indexOf(cons) != -1)
{
obj["data"]["premium"]["is_premium"] = true;
}
$done({body: JSON.stringify(obj)});
