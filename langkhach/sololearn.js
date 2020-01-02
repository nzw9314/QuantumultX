var obj = JSON.parse($response.body);
url= $request.url;
const cons1 = "Profile/GetProfile";
const cons2 = "authenticateDevice";
if(url.indexOf(cons1) !=-1)
{
obj["profile"]["isPro"]= true;
}
if(url.indexOf(cons2) !=-1)
{
obj["user"]["isPro"]= true;
}
$done({body: JSON.stringify(obj)});

// Descriptions