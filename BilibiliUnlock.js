/**
 * @supported B422643B7EE6
 */
 
let obj = JSON.parse($response.body);
obj["result"]["user_status"]["vip"] = 1;
$done({body: JSON.stringify(obj)});