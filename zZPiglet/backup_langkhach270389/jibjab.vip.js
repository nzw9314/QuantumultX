let obj = JSON.parse($response.body);
obj.data.attributes["is-paid"] = true;
$done({body: JSON.stringify(obj)});
//bynubyta