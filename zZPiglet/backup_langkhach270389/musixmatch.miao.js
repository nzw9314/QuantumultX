let obj=JSON.parse($response.body);
let usr=obj.message.body;
usr.app_config.trial=false;
usr.app_config.active_products=[
          {
            "product_id" : "com.musixmatch.offers.removeads.autorenewable.oneyear",
            "start_date" : "2019-10-27T16:27:38.000Z",
            "creation_date" : "2019-10-27T16:27:38.000Z",
            "credits" : 10,
            "end_date" : "2099-11-03T17:27:38.000Z",
            "product_type" : "subscription",
            "features" : {
              "no_ads" : 1,
              "clean_metadata" : 1,
              "party_mode" : 1,
              "lyrics_offline" : 1
            }
          }
        ],
        
usr.app_config.reference= "active";
usr.app_config.last_modified="Fri Nov 08 2019 17:35:48 GMT+0000 (UTC)";
$done({body: JSON.stringify(obj)});