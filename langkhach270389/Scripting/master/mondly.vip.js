var obj = JSON.parse($response.body);

obj["pucharses"]= [10];
obj["subscriptions"]=  {
  "10": "2099-09-09 05:05:05"
};
obj["subscription"]=  {
  "10": "2099-09-09 05:05:05"
};
obj["parsed_transactions"]= [
  "540000370283138"
];
$done({body: JSON.stringify(obj)});
