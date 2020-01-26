// ^https:\/\/api\.wakamoment\.ga\/init\?platform\=ios url script-request-header xxx.js


let obj = JSON.parse($response.body);

obj.data.latestApplication["version"] = "2.1.2.1";
obj.data["version"] = "2.1.2.1";

$done({
	body: JSON.stringify(obj)
});

"data":{
  "latestApplication" : {
    "version" : "2.1.2.2"
  }
}
