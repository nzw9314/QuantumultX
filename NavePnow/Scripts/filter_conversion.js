//put your surge or quanx filter link here
const url = 'https://raw.githubusercontent.com/Leped/Unlock/master/Unlock.list'

async function handleRequest(request) {
    const init = {
        headers: {
            'content-type': 'text;charset=UTF-8',
        },
    }
    const response = await fetch(url, init)
    const results = await gatherResponse(response)
    return new Response(results, init)
    //return new Response(results)
}
addEventListener('fetch', event => {
    return event.respondWith(handleRequest(event.request))
})

async function gatherResponse(response) {
    var text = response.text()
    // put your conversion regex expression here
    var text_result = text.then(function (value) {

        value = value.replace(/host/g, "DOMAIN")
        value = value.replace(/keyword/g, "KEYWORD")
        //console.log(value)
        return value
    });

    return text_result
}
