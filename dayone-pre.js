/*

本脚本是 dayone.js 的附属脚本，需与主脚本配合使用。具体使用方式请查看主脚本说明
Surge
http-request ^https:\/\/dayone\.me\/api\/users$ debug=1,script-path=scripts/dayone-pre.js

QX
^https:\/\/dayone\.me\/api\/users$ url script-response-body dayone-pre.js
MitM = dayone.me

*/


const headers = $request.headers
delete headers["If-None-Match"]
$done({headers})
