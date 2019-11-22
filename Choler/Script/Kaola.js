/**
 * @supported B422643B7EE6
 */

/*
[Script]
http-request ^https://sp\.kaola\.com/api/openad$ script-path=https://Choler.github.io/Surge/Script/Kaola.js

[MITM]
hostname = sp.kaola.com
*/

var data = {
  body: "{}",
  headers: {
    "Content-Type": "application/json"
  }
};
$done({response: data});