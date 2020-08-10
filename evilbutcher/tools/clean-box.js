/******************** 转换器 ********************/
let isQuantumultX=null!=$task,isSurge=null!=$httpClient,isLoon=isSurge&&null!=typeof $loon;var $task=isQuantumultX?$task:{},$httpClient=isSurge?$httpClient:{},$prefs=isQuantumultX?$prefs:{},$persistentStore=isSurge?$persistentStore:{},$notify=isQuantumultX?$notify:{},$notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:""};$httpClient={get:(t,o)=>{var r;r="string"==typeof t?{url:t}:t,$task.fetch(r).then(t=>{o(void 0,t,t.body)},t=>{errorInfo.error=t.error,o(errorInfo,response,"")})},post:(t,o)=>{var r;r="string"==typeof t?{url:t}:t,t.method="POST",$task.fetch(r).then(t=>{o(void 0,t,t.body)},t=>{errorInfo.error=t.error,o(errorInfo,response,"")})}}}isSurge&&($task={fetch:t=>new Promise((o,r)=>{"POST"==t.method?$httpClient.post(t,(t,r,e)=>{r?(r.body=e,o(r,{error:t})):o(null,{error:t})}):$httpClient.get(t,(t,r,e)=>{r?(r.body=e,o(r,{error:t})):o(null,{error:t})})})}),isQuantumultX&&($persistentStore={read:t=>$prefs.valueForKey(t),write:(t,o)=>$prefs.setValueForKey(t,o)}),isSurge&&($prefs={valueForKey:t=>$persistentStore.read(t),setValueForKey:(t,o)=>$persistentStore.write(t,o)}),isQuantumultX&&($notify=(t=>(function(o,r,e,i){t(o,r,e=void 0===i?e:`${e}\n点击链接跳转: ${i}`)}))($notify),$notification={post:(t,o,r,e)=>{$notify(t,o,r=void 0===e?r:`${r}\n点击链接跳转: ${e}`)}}),isSurge&&!isLoon&&($notification.post=(t=>(function(o,r,e,i){e=void 0===i?e:`${e}\n点击链接跳转: ${i}`,t.call($notification,o,r,e)}))($notification.post),$notify=((t,o,r,e)=>{r=void 0===e?r:`${r}\n点击链接跳转: ${e}`,$notification.post(t,o,r)})),isLoon&&($notify=((t,o,r,e)=>{$notification.post(t,o,r,e)}));
/******************** 转换器 ********************/


$persistentStore.write(null, "chavy_boxjs_userCfgs")

//$persistentStore.write(null, "chavy_boxjs_sessions")

//$persistentStore.write(null, "chavy_boxjs_globalBaks")

$done()
