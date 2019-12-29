//remote script url
const url = 'https://raw.githubusercontent.com/langkhach270389/Scripting/master/Terminus.js'
// id number
const id = "1234567"
async function handleRequest(request) {
    const init = {
        headers: {
            'content-type': 'text;charset=UTF-8',
        },
    }
    const response = await fetch(url, init)
    //const response = await fetch(url)
    const results = await gatherResponse(response)
    return new Response(results, init)
    //return new Response(results)
}
addEventListener('fetch', event => {
    return event.respondWith(handleRequest(event.request))
})

async function gatherResponse(response) {
    const body = await response.body
    const newStatus = response.status
    const headers = response.headers
    var text = response.text()
    var text_result = text.then(function(value)
    {

        //value = value.replace(/host/g, "DOMAIN")
        //value = value.replace(/keyword/g, "KEYWORD")
        value = "/** \n* @supported "+ id +"\n*/\n\n" + value
/**
 * @supported FA9BF7EE1A24
 */
        return value
    });

    return  text_result
}

