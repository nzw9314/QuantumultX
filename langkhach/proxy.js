/*
list raw example: http://spys.me/proxy.txt
//Surge4
http-response ^http:\/\/spys\.me\/proxy\.txt$ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/langkhach270389/Scripting/master/proxy.js

//
FreeProxy = url-test, url=http://www.google.com/generate_204, policy-path=http://spys.me/proxy.txt, update-interval=3600, timeout=0, interval=0, tolerance=0
//
*/
var obj= $response.body;
var proxy= [];
obj= obj.match(/((\d{1,3}\.){3}\d{1,3}):(\d+).+([A-Z]){2}.+(S\s\+).+\n/g);
for (var i = 0; i < obj.length; i++) {
proxy[i]= obj[i].match(/[A-Z]{2}-[A-Z]{1}-S/) + "_" +i + " = http, " + obj[i];
}
console.log(proxy);
$done({body: proxy.toString().replace(/[A-Z]{2},/g, "\n [A-Z]{2}").replace(/\n,/g, "\n").replace(/:/g, ", ")});
