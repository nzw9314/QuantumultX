var obj = JSON.parse($response.body); 
obj['will_renew_subscription'] = true; 
obj['is_subscribed'] = true; 
$done({body: JSON.stringify(obj)});