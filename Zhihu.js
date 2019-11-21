// @supported 2755B369
let body = $response.body
body=JSON.parse(body)
var data=body["data"]
for(var i=0;i<data.length;i++){
  if(data[i]["type"]=="feed_advert"||data[i]["type"]=="market_card"){
    data.splice(i,1)
    i-=1
  }
}
body=JSON.stringify(body)
$done({body})
