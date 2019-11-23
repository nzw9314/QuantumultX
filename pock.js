var obj = JSON.parse($response.body);
 obj= {
  "status": "ok",
  "data": {
  "contact_id": 27326,
  "name": "大雄脚本组",
  "firstname": "脚本组",
  "lastname": "大雄",
   "email": "",
 "userpic": "https://pocketlists.com/wa-data/public/contacts/photos/26/73/27326/1472772364.512x512.jpg",
   "userpic_minor": "",
   "update_datetime": 1574144842,
   "signup_date": "2019-11-19",
   "subscription_type": "premium",
   "subscription_expires": "2022-11-25",
   "family_id": null,
   "family_invitation_key": null,
   "family_role": "adult",
   "family_hash": null,
   "device_stat": {
    "desktop_first_login_datetime": 0,
    "mobile_first_login_datetime": 1574144846,
    "desktop_last_login_datetime": 0,
    "mobile_last_login_datetime": 1574144846,
    "desktop_login_counter": 0,
    "mobile_login_counter": 1
   }
  }
 };
$done({body: JSON.stringify(obj)});
//
