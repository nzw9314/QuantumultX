var obj = JSON.parse($response.body);
 obj={
  "vip": [
   {
    "id": 9005757,
    "auth_type": 1,
    "auth_value": 1999999999
   }
  ]
};
$done({body: JSON.stringify(obj)});
//
