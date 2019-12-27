/*http-request ^https:\/\/sk\.ulysses\.app\/api\/v1\/user_offers$ script-path= cleancacheulysses.js
*/

//mitm: sk.ulysses.app


const headers = $request.headers
delete headers["If-None-Match"]
$done({headers})