//Enter the appid, for example, Quantumultx: https://testflight.apple.com/join/VCIvwk2g
//appid is VCIvwk2g

let appid = 'VCIvwk2g'
let url = `https://testflight.apple.com/join/${appid}`

$httpClient.get(url, (error, response, data) => {
  if (error) {
    $notification.post('error', 'error', 'error')
    $done({})
  }
  else {
    //console.log(data)

    if (data.match('This beta is full') || data.match('测试员已满')) {
      //$notification.post('Full','Full','Full')
    } else {
      $notification.post('Open', 'Join', `itms-beta://testflight.apple.com/join/${appid}`)
    }
    $done({})
  }
})
