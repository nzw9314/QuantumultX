const headers = $request.headers
delete headers["If-None-Match"]
$done({headers})