let obj = JSON.parse($response.body)
obj.isPremium = true;
$done({body:JSON.stringify(obj)})