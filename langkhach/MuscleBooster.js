/*
Surge: 
[Script]
Muscle Booster = type=http-response,pattern=^https:\/\/menscoach-api\.asqq\.io\/prod\/user$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/langkhach270389/Scripting/master/MuscleBooster.js

Quantumult X:
[rewrite_local]
^https:\/\/menscoach-api\.asqq\.io\/prod\/user$ url script-response-body langkhach/MuscleBooster.js

MITM: menscoach-api.asqq.io
*/

let obj = JSON.parse($response.body);
obj.is_paid = true;
$done({body: JSON.stringify(obj)});