var obj = JSON.parse($response.body);

obj= {
  "error" : 0,
  "data" : {
    "is_offer_eligible" : true,
    "may_expire" : false,
    "hash" : "c349550ecceff853e31ee2cb4dc4df86",
    "consumable_inapp" : [

    ],
    "is_valid" : true,
    "in_app" : {
      "com.appicfun.translatorfree.01m_03dt_lim50302" : {
        "expired" : false,
        "may_expire" : true,
        "cancelled" : false,
        "is_valid" : true,
        "is_trial" : true,
        "is_intro" : false,
        "transaction_id" : "20000612885421",
        "cancel_reason" : "user",
        "purchase_date_ms" : "1570593305000",
        "expires_date_ms" : "4570852505000",
        "remaining_time_ms" : "3178755000000"
      }
    }
  }
};

$done({body: JSON.stringify(obj)});

// Descriptions