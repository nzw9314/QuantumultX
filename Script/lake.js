let body= $response.body; 
var obj = JSON.parse(body); 
obj=
[
 {
  "product_id": "com.lake.coloring.sub.all1.yearly1",
  "expired": false,
  "purchase_date": "2020-01-17T08:38:43.000Z",
  "expires": "2030-01-24T08:38:43.000Z"
 }
]
$done({body: JSON.stringify(obj)});