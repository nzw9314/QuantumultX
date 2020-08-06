const $vei = init();
$vei.headers = "vei_angelalign_headers";

const planUrl = `https://exp.angelalign.com/api/v1/mini_program/get_plan_list`;
const method = `POST`;
const headers = $vei.read($vei.headers);
const planBody = `{"payload":{}}`;

if (!headers) {
  console.log("时代天使，请获取Cookie");
  $vei.notify("时代天使", "签到失败", "请获取Cookie");
} else {
  const planOptions = {
    url: planUrl,
    method,
    headers: JSON.parse(headers),
    body: planBody,
  };

  $vei.post(planOptions, (planError, planRes, planResBody) => {
    if (planError) {
      console.log("时代天使" + "\n\n" + planError);
      $vei.notify("时代天使", "获取plan list失败", "请查看日志");
    } else if (planRes.status === 200) {
      console.log(`时代天使planlist \n\n ${planResBody}`);
      const result = JSON.parse(planResBody);
      if (result.errmsg === "成功") {
        const eventUrl =
          "https://exp.angelalign.com/api/v1/mini_program/create_time_gap_event";
        const { id, current_step } = result.data[0];
        const eventBody = {
          payload: {
            remark: "",
            current_step: current_step,
            started_at: null,
            duration: getRandomInt(10, 31),
            ended_at: null,
            type: 2,
            plan_id: id,
            current_pair: 1,
          },
        };
        const eventOptions = {
          url: eventUrl,
          method,
          headers: JSON.parse(headers),
          body: JSON.stringify(eventBody),
        };
        $vei.post(eventOptions, (eventError, eventRes, eventResBody) => {
          if (eventError) {
            console.log("时代天使" + "\n\n" + eventError);
            $vei.notify("时代天使", "签到失败", "请查看日志");
          } else if (eventRes.status === 200) {
            console.log(`时代天使createevent\n\n${JSON.stringify(eventRes)}`);
            const eventResult = JSON.parse(eventResBody);
            if (eventResult.errmsg === "成功") {
              $vei.notify("时代天使", "签到成功", eventResult.errmsg);
            } else {
              console.log(`时代天使createevent\n\n${eventResult.errmsg}`);
              $vei.notify("时代天使", "签到失败", eventResult.errmsg);
            }
          }
        });
      } else {
        console.log("时代天使createevent" + "\n\n" + result.errmsg);
        $vei.notify("时代天使", "获取plan list失败", result.errmsg);
      }
    }
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function init() {
  const isRequest = typeof $request != "undefined";
  const isSurge = typeof $httpClient != "undefined";
  const isQuanX = typeof $task != "undefined";
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message);
    if (isSurge) $notification.post(title, subtitle, message);
  };
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key);
    if (isSurge) return $persistentStore.write(value, key);
  };
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key);
    if (isSurge) return $persistentStore.read(key);
  };
  const post = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = { url: options };
      options["method"] = "POST";
      $task.fetch(options).then(
        (response) => {
          response["status"] = response.statusCode;
          callback(null, response, response.body);
        },
        (reason) => callback(reason.error, null, null)
      );
    }
    if (isSurge) $httpClient.post(options, callback);
  };
  const end = () => {
    if (isQuanX) isRequest ? $done({}) : "";
    if (isSurge) isRequest ? $done({}) : $done();
  };
  return { isRequest, isQuanX, isSurge, notify, write, read, post, end };
}