/*
README：https://github.com/yichahucha/surge/tree/master
每日打卡提醒（corn "0 9,18 * * 1-5" 周一到周五，早九晚六）+ 每日壹句（有道词典）+ 跳转钉钉打卡页面（下拉通知点击链接）
*/
$httpClient.get('https://dict.youdao.com/infoline/style/cardList?mode=publish&client=mobile&style=daily&size=2', function (error, response, data) {
    let obj = JSON.parse(data);
    let date = new Date();
    let isAM = date.getHours() < 12 ? true : false
    let title = 'Clock' + (isAM ? ' in' : ' out') + (isAM ? ' ☀️' : ' 🌙');
    let subtitle = '';
    let content = 'dingtalk://dingtalkclient/page/link?url=https://attend.dingtalk.com/attend/index.html';
    if (!error) {
        if (obj && obj.length > 1) {
            let yi = obj[1];
            content = yi.title + '\n' + yi.summary + '\n\n' + content;
        }
    }
    $notification.post(title, subtitle, content);
    $done();
});
