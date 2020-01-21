/*
hostname = raw.githubusercontent.com, *.github.io,
^https:\/\/(raw.githubusercontent|\w+\.github)\.(com|io)\/.*\.js$ url script-response-body quanx.js
*/
var body = $response.body;
body = '\/*\n@supported F06A2C1CA3BE\n*\/\n' + body;
$done(body);