var obj = JSON.parse($response.body);
if(obj.user.is_on_free_trial == false)
{
obj.user.is_on_free_trial= true;
obj.user.subscription_expiration_date_epoch= 5555555555;
obj.user.current_subscription= {
"sku": "com.elevateapp.elevate.renewable.free_trial_year_subscription_16",
 "duration": "annual",
 "store": "App Store"
 };
 obj.user.can_purchase= false;
 }

$done({body: JSON.stringify(obj)});