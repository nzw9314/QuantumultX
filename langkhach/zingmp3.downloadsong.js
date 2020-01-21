var obj = JSON.parse($response.body);
obj["data"]["dwnLink"]["320"]= $persistentStore.read("dwnLink320");
obj["data"]["dwnLink"]["lossless"]= $persistentStore.read("dwnLinklossless");
obj["data"]["dwnLink"]["m4a"]= $persistentStore.read("dwnLinkm4a");
$done({body: JSON.stringify(obj)});
