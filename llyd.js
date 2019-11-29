/*
流利说•阅读 Qx

因缓存机制，使用脚本后可能需要重装一次「流利说•阅读」后方可生效；生效标志是点进详解不再有限制

^https?:\/\/vira\.llsapp\.com\/api\/v2\/readings\/(accessible|limitation) url script-response-body llyd.js

MitM = vira.llsapp.com

*/

if ($response.statusCode == 200 && $request.method == 'GET') {
	const bodyObj = JSON.parse($response.body);

	if ($request.url.indexOf('limitation') != -1) {
		bodyObj.modules = [];
		bodyObj.auditionDuration = 72000;
	} else {
		bodyObj.from = 1482071586
		bodyObj.to = 1671373986
	}

	$done({body: JSON.stringify(bodyObj)})
} else {
	$done({})
}
