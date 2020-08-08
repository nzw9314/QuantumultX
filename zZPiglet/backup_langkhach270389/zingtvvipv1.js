var obj = JSON.parse($response.body);
var url = $request.url;
var cons = "user/info";
if(url.indexOf(cons) != -1)
{
obj["data"]["premium"]["is_premium"] = true;
obj["data"]["premium"]["to_time"] = 4096019658000;
}
$done({body: JSON.stringify(obj)});
