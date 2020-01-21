let obj=JSON.parse($response.body)
let url = $request.url;
var cons1 = "get";
var cons2 = "report";
if(url.indexOf(cons1) != -1)
{
obj=

{
  "error_code": 0,
  "purchases": [
    {
      "product_id": "com.ultimake.smartsync.membership.1year.30dayTrial",
      "platform_type": 1,
      "purchase_date": 1571436858000,
      "expiration_date": 4096044858000
    }
  ],
  "error_description": "OK"
};
body= JSON.stringify(obj);
}
if(url.indexOf(cons2) != -1)
{
obj= {
  "error_code": 0,
  "purchases": [
    {
      "error_code": 0,
      "product_id": "com.ultimake.smartsync.membership.1year.30dayTrial"
    }
  ],
  "error_description": "OK"
};
body= JSON.stringify(obj);
}

$done({body});