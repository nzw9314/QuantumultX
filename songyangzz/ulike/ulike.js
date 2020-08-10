/**
 * QX
 * rewrite:
 * ^https:\/\/commerce-.*api\.faceu\.mobi\/commerce\/v1\/subscription\/user_info url script-response-body ulike.js
 * hostname:commerce-i18n-api.faceu.mobi,commerce-api.faceu.mobi
 */
let obj = JSON.parse($response.body);
obj.data.end_time=3725012184;
obj.data.is_cancel_subscribe=false;
obj.data.flag=true;
$done({body: JSON.stringify(obj)});

//轻颜相机
