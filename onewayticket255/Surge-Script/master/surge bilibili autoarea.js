/*
b站自动解除区域限制，需要自备台湾节点

[Rule]
SCRIPT,Bangumi,台湾 BGP 中继 1
[Script]
rule Bangumi script-path=https://raw.githubusercontent.com/onewayticket255/Surge-Script/master/surge%20bilibili%20autoarea.js,script-update-interval=-1

*/
let url = $request.url
let seasonurl = "api.bilibili.com/pgc/view/app/season"
let episodeurl = "api.bilibili.com/pgc/player/api/playurl"


if (url && (url.indexOf(seasonurl) != -1 || url.indexOf(episodeurl) != -1)) {

  if (url.indexOf(seasonurl) != -1) {
    let regex = /season_id=(.*?)&/
    let season = regex.exec(url)
    let sid = season[1]
    let api = `https://bangumi.bilibili.com/anime/${sid}`


    $httpClient.get(url, (error, response, data) => {
      if (error) $done({ matched: false })
      else {
        console.log(response)
        console.log(data)
        if (data.match(`"code":-404`) || data.match("僅")) $done({ matched: true })
        else $done({ matched: false })
      }
    })
  }


  if (url.indexOf(episodeurl) != -1) {
    let regex = /ep_id=(.*?)&/
    let episode = regex.exec(url)
    let epid = episode[1]
    let api = `https://www.bilibili.com/bangumi/play/ep${epid}`


    $httpClient.get(url, (error, response, data) => {
      if (error) $done({ matched: false })
      else {
        if (data.match(`"code":-10403`) || data.match("僅")) $done({ matched: true })
        else $done({ matched: false })
      }
    })
  }


}

else {
  $done({ matched: false })
}

