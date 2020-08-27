/*
腾讯微证券猜涨跌
微信公众号「腾讯自选股微信版|微证券」=> 「🔥好福利」=>「猜涨停赢红包」=>「猜涨停 领红包」，弹出获取 Cookie 成功提示后即可。后续会在午盘收盘后，以当日数据自动猜测涨跌
[task_local]
35 11 * * 1-5 https://raw.githubusercontent.com/baranwang/quantumult-x-wechat-finance/master/wechat_finance_guess.js, tag=腾讯微证券, img-url=https://raw.githubusercontent.com/baranwang/quantumult-x-wechat-finance/master/wechat_finance.png, enabled=true
[rewrite_local]
https://wzq\.tenpay\.com/resources/vtools/act_task_config_utf8\.json url script-request-header https://raw.githubusercontent.com/baranwang/quantumult-x-wechat-finance/master/wechat_finance_guess.js
[mitm]
hostname = wzq.tenpay.com
*/

const cookieKey = 'wechat_finance_cookieKey';

const isGetCookie = typeof $request !== 'undefined';

const notify = (title = '', desc = '') => $notify('腾讯微证券', title, desc);

if (isGetCookie) {
  if ($request.headers['Cookie']) {
    $prefs.setValueForKey($request.headers['Cookie'], cookieKey);
    notify('成功获取 Cookie', '');
  }
  $done({});
} else {
  const headers = {
    Cookie: $prefs.valueForKey(cookieKey),
  };

  $task
    .fetch({
      url:
        'https://proxy.finance.qq.com/ifzqgtimg/appstock/app/newkline/newkline?param=sh000001,day,,,1',
    })
    .then((res) => {
      const {
        data: {
          sh000001: {
            qt: { sh000001 },
          },
        },
      } = JSON.parse(res.body);
      const [, , , today, yesterday] = sh000001;
      const now = new Date();
      const date = `${now.getFullYear()}${`0${now.getMonth() + 1}`.slice(-2)}${`0${now.getDate()}`.slice(-2)}`;

      $task
        .fetch({
          url: `https://wzq.tenpay.com/cgi-bin/guess_op.fcgi?action=2&act_id=3&user_answer=${
            today > yesterday ? 1 : 2
          }&date=${date}&channel=0&_=${now.valueOf()}`,
          headers,
        })
        .then((res) => {
          const { retcode, retmsg } = JSON.parse(res.body);
          switch (retcode) {
            case '0':
              $task
                .fetch({
                  url: `https://wzq.tenpay.com/cgi-bin/activity.fcgi?channel=0&activity=guess_new&guess_act_id=3&guess_date=${date}&guess_reward_type=5&_=${now.valueOf()}`,
                  headers,
                })
                .then((res) => {
                  const { retcode, reward_memo, reward_value } = JSON.parse(
                    res.body
                  );
                  if (retcode === '0') {
                    notify(reward_memo, `获得 ${reward_value} 金币`);
                  }
                });
              break;

            default:
              notify('竞猜失败', retmsg);
              break;
          }
        });
    });
}
