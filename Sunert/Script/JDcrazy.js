/*
运行代码作者: 小赤佬ByQQ83802712

修改：elecV2
发布：https://t.me/elecV2

京东品牌狂欢城自动任务 JS 注入。

[rewrite]
^https://h5.m.jd.com/babelDiy/Zeus/QzjyrF2MpMcB5yq9zwaNpwspZWx/index.html url script-response-body JDcrazy.js

[mitm]
h5.m.jd.com

设置完成后手动打开活动页面 https://h5.m.jd.com/babelDiy/Zeus/QzjyrF2MpMcB5yq9zwaNpwspZWx/index.html ，JS 会自动运行，完成任务。任务每天0点刷新，完成需要一定时间，如有未完成任务刷新一下。
*/

let body = $response.body;

if (/<\/body>/.test($response.body)) {
  let tampermonkeyjs =  `eval(function(p,a,c,k,e,r){e=function(c){return c.toString(36)};if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'[fh-jlm]'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('eval(f(p,a,c,k,e,d){e=f(c){h(c<a?\\'\\':e(parseInt(c/a)))+((c=c%a)>35?i.fromCharCode(c+29):c.toString(36))};j(!\\'\\'.l(/^/,i)){m(c--)d[e(c)]=k[c]||e(c);k=[f(e){h d[e]}];e=f(){h\\'\\\\\\\\w+\\'};c=1};m(c--)j(k[c])p=p.l(new RegExp(\\'\\\\\\\\b\\'+e(c)+\\'\\\\\\\\b\\',\\'g\\'),k[c]);h p}(\\' e 9=4.3(\\\\\\'9\\\\\\');9.d="b/6";9.a="5://c.2/8/7.8";4.1.0(9);\\',62,15,\\'appendChild|body|com|createElement|document|https|javascript|jdppkhc|js|script|src|text|tyh52|type|var\\'.split(\\'|\\'),0,{}))',[],23,'|||||||||||||||function||return|String|if||replace|while'.split('|'),0,{}))`  // 这段代码原作者: 小赤佬

  body = body.replace('</body>', `<script>${tampermonkeyjs}</script></body>`)
  
  console.log("京东狂欢城 自动任务JS注入完成")
}

$done({ body })
