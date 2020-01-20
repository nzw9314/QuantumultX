var obj = JSON.parse($response.body);
 obj.data.vipTheme.type="free";
 obj.data.needBieds=null;
$done({body: JSON.stringify(obj)});
//
