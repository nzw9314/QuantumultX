/*

Quantumult X
unlock Shapr:3D PRO

[rewrite_local]
# unlock Shapr3D
^https?:\/\/prod\.api\.shapr3d\.com\/user-management\/profile-with-device url script-response-body Shapr3D.js

[mitm]
hostname = prod.api.shapr3d.com,

*/

let obj = JSON.parse($response.body);
obj.subscriptionType = "pro_year";
obj.subscriptionExpires = "2100-01-01T00:00:00.000Z";
$done({body: JSON.stringify(obj)});