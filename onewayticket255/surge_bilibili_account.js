let body = $response.body

body = JSON.parse(body)
body['data']['sections'] = [
    {
        "title": "个人中心",
        "items": [
            {             
                "title": "历史记录",
                "uri": "bilibili://user_center/history"
            },
            {   
                "title": "我的收藏",              
                "uri": "bilibili://user_center/favourite"
            },
            {
                "title": "稍后再看",
                "uri": "bilibili://user_center/watch_later"
            },
            {
                "title": "离线缓存",
                "uri": "bilibili://user_center/download"
            },
        ]
    }
]

body = JSON.stringify(body)
$done({ body })
