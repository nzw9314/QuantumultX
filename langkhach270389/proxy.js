/*
list raw example: https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt

//Surge4
http-response ^https:\/\/raw\.githubusercontent\.com\/clarketm\/proxy-list\/master\/proxy-list-raw\.txt$ requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/langkhach270389/Scripting/master/proxy.js

//
FreeProxy = url-test, url=http://www.google.com/generate_204, policy-path=https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt, update-interval=300, timeout=0, interval=0, tolerance=0
//
MITM: raw.githubusercontent.com
*/
var obj= $response.body;
var proxy= [];
obj= obj.split("\n");
for (var i = 0; i < obj.length -1; i++) {
proxy[i]= "Proxy_" +i + " = http, " + obj[i];
}
//console.log(proxy);
$done({body: proxy.toString().replace(/Proxy/g, "\nProxy").replace(/:/g, ", ")});
