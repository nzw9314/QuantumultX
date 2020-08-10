/**
 * Surge自动策略，根据当前网络自动切换策略组，主要用于搭配软路由等使用。
 * 由于运行模式的全局直连下，去广告，网易云等分流也会失效，使用此脚本完全解决了此类问题。
 * @author: Peng-YM
 * 更新地址: https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tools/AutoPolicy/auto-policy.js
 *
 *************** Surge配置 ***********************
 * 此脚本仅支持Surge，推荐使用模块：
 * https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tools/AutoPolicy/auto-policy.sgmodule
 * 手动配置：
 * [Script]
 * event network-changed script-path=https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tools/AutoPolicy/auto-policy.js
 * 
 *************** 脚本配置 ***********************
 * 推荐使用BoxJS配置。
 * BoxJS订阅：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/box.js.json
 * (不推荐！)手动配置项为config, 请看注释
 */

let config = {
  global_direct: "♲ 𝐃𝐢𝐫𝐞𝐜𝐭",
  global_proxy: "𝑷𝒓𝒐𝒙𝒚",
  silence: false, // 是否静默运行，默认false
  cellular: "RULE", // 蜂窝数据下的模式，RULE代表规则模式，PROXY代表全局代理，DIRECT代表全局直连
  wifi: "RULE", // wifi下默认的模式
  all_direct: ["WRT32X", "WRT32X Extreme"], // 指定全局直连的wifi名字
  all_proxy: [], // 指定全局代理的wifi名字
  whitelist: ["𝑵𝒆𝒕𝒆𝒂𝒔𝒆 𝑴𝒖𝒔𝒊𝒄", "𝑨𝒅𝑮𝒖𝒂𝒓𝒅"],
};

// load user prefs from box
const boxConfig = $persistentStore.read("surge_auto_policy");
if (boxConfig) {
    config = JSON.parse(boxConfig);
    config.silence = JSON.parse(config.silence);
    config.all_direct = listify(config.all_direct);
    config.all_proxy = listify(config.all_proxy);
    config.whitelist = listify(config.whitelist);
}
const { groups } = $surge.selectGroupDetails();

manager()
  .catch((err) => {
    $notification.post("Surge 自动策略", `❌ 出现错误：${err}`, "");
    console.log("ERROR: " + err);
  })
  .finally(() => {
    $done();
  });

async function manager() {
  const v4_ip = $network.v4.primaryAddress;

  // get current outbound mode
  const previousMode = $persistentStore.read("surge_auto_policy_mode") || "RULE";

  console.log(`Previous outbound mode: ${previousMode}`)

  // no network connection
  if (!config.silence && !v4_ip) {
    $notification.post("Surge 自动策略", "❌ 当前无网络", "");
    return;
  }

  const ssid = $network.wifi.ssid;

  const targetMode = ssid ? getSSIDMode(ssid) : config.cellular;

  console.log(`Switch from mode ${previousMode} to ${targetMode}`);

  if (previousMode === "RULE" && targetMode !== "RULE") {
    // save decisions
    saveDecisions();
    // policy switch
    for (let group of Object.keys(groups)) {
      if (config.whitelist.indexOf(group) !== -1) continue;
      const decision = targetMode === "PROXY" ? config.global_proxy : config.global_direct;
      $surge.setSelectGroupPolicy(group, decision);
      console.log(`Switch Policy: ${group} ==> ${decision}`);
    }
  }
  if (previousMode !== "RULE" && targetMode === "RULE") {
    // load decisions
    restoreDecisions();
  }

  $persistentStore.write(targetMode, "surge_auto_policy_mode");
  if (!config.silence) {
    $notification.post(
      "Surge 自动策略",
      `当前网络：${ssid ? ssid : "蜂窝数据"}`,
      `Surge已切换至${lookupOutbound(targetMode)}`
  );
  }
}

function saveDecisions() {
  // get current policy groups
  let { decisions } = $surge.selectGroupDetails();
  for (let d of Object.keys(decisions)) {
    if (!groups[d]) delete decisions[d];
  }
  $persistentStore.write(
    JSON.stringify(decisions),
    "surge_auto_policy_decisions"
  );
}

function restoreDecisions() {
  const decisions = JSON.parse($persistentStore.read("surge_auto_policy_decisions"));
  for (let group of Object.keys(groups)) {
    $surge.setSelectGroupPolicy(group, decisions[group]);
    console.log(`Restore Policy: ${group} ==> ${decisions[group]}`);
  }
}

function getSSIDMode(ssid) {
  const map = {};
  config.all_direct.map((id) => (map[id] = "DIRECT"));
  config.all_proxy.map((id) => (map[id] = "PROXY"));

  const matched = map[ssid];
  return matched ? matched : config.wifi;
}

function lookupOutbound(mode) {
  return {
      "RULE": "🤖规则模式",
      "PROXY": "🚀全局代理模式",
      "DIRECT": "🎯全局直连模式"
  }[mode];
}

function listify(str, sperator = ",") {
  return str.split(sperator).map((i) => i.trim());
}
