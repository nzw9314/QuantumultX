var obj = JSON.parse($response.body);
obj = {
 "result": {
  "first": 0,
  "page": 0,
  "pageSize": 10,
  "rows": [],
  "total": 0
 },
 "status": 1
}
$done({body: JSON.stringify(obj)});
