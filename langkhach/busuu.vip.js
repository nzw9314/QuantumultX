var obj = JSON.parse($response.body);
obj.data.is_premium= true;
obj.data.access.tier= "plus";
$done({body: JSON.stringify(obj)});
