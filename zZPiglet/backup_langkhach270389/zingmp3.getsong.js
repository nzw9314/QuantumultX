var obj = JSON.parse($response.body);
var src320= obj["data"]["src"]["320"];
$persistentStore.write(src320, "dwnLink320");
var srclossless= obj["data"]["src"]["lossless"];
$persistentStore.write(srclossless, "dwnLinklossless");
var srcm4a= obj["data"]["src"]["m4a"];
$persistentStore.write(srcm4a, "dwnLinkm4a");
$done({});