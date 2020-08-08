var obj = JSON.parse($response.body);

obj.subscription= {
  "granted": true
};
$done({body: JSON.stringify(obj)});

// Mô tả
