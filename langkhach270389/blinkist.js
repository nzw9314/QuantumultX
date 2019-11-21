let obj=JSON.parse($response.body);
let url = $request.url;
const cons1= "https://api.blinkist.com/v4/me";
const cons2= "https://api.blinkist.com/v4/me.json";
const cons3= "https://api.blinkist.com/v4/me/access";
if((url===cons1)||(url===cons2))
{
obj["user"]["trial_ending_at"]="2099-11-07T19:26:12.000+00:00";
obj["user"]["free_access_ending_at"] = "2099-11-02T10:43:43.483+00:00";
obj["user"]["subscription_period_ending_at"]= "2099-11-02T10:43:43.483+00:00";
obj["user"]["access_type"]= "premium";
obj["user"]["access_source"]="itunes";
obj["user"]["features"]=
[
   "read",
   "text_marker",
   "audio",
   "send_to_kindle",
   "evernote",
   "minute",
   "sync_to_evernote",
   "home_row_localization"
  ];
  obj["user"]["current_minute_id"]= "onboarding_4";
  obj["user"] ["current_minute_id_expires_at"]= "2099-11-06T23:00:00.000Z";
 obj["user"] ["minute_subscribed_at"]= "2019-11-01T14:46:17.000Z";
}
if(url===cons3)
{
obj["user_access"]["type"]="premium";
obj["user_access"]["marketplace"]= "itunes";  obj["user_access"]["valid_until"]= "2099-11-07T19:26:12.000+00:00";
obj["user_access"]["premium"]= "softpaywall";
}
$done({body: JSON.stringify(obj)});