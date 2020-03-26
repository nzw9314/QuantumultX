const https = require('https')
const { exec, execSync } = require('child_process')

const barkID = process.argv[2]

const setting = {
    repo: 'https://github.com/surge-networks/snell/releases',
    notification: `https://api.day.app/${barkID}/`,
    interval: 3600000,
}

const regex = /href="(.*?\/(snell-server.*?linux-amd64.zip))"/

let url = ""
let version = ""

init()
setInterval(async () => {
    const res = await request(setting.repo)
    let result = regex.exec(res)

    if (result[1] !== url) {
        url = result[1]
        version = result[2]
        let download = 'https://github.com' + url
        console.log(`Download: ${download} ${"\n"}Version: ${version}`)
        update(download, version)
    }
}, setting.interval)


async function init() {
    const res = await request(setting.repo)
    let result = regex.exec(res)
    url = result[1]
    version = result[2]
    let download = 'https://github.com' + url
    console.log(`Download: ${download} ${"\n"}Version: ${version}`)
    update(download, version)
}

function update(download, version) {

    barkID ? execSync(`curl ${setting.notification}${version}`) : null

    if (execSync(`ls`).toString().match('snell')) {
        execSync(`rm snell*`)
    }

    execSync(`echo "[snell-server]\nlisten = 0.0.0.0:2333\npsk = password\nobfs = http" > snell-server.conf`)
    execSync(`curl -O -L ${download}`)
    execSync(`unzip ${version}`)

    if (execSync(`ps aux | grep snell | grep -v "grep"| awk '{print $2}'`).length > 0) {
        execSync(`ps aux | grep snell | grep -v "grep"| awk '{print $2}'| xargs kill`)
    }


    exec('nohup ./snell-server')
    console.log("Update Done")
    barkID ? execSync(`curl ${setting.notification}Update%20Done`) : null
}

function request(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url)
        req.on('response', res => {
            let resBody = ''
            res.setEncoding('utf8')
            res.on('data', chunk => {
                resBody += chunk
            })
            res.on('end', () => {
                console.log(resBody)
                resolve(resBody)
            })
            res.on('error', e => {
                reject(e)
            })
        })

        req.on('error', e => {
            console.log(e)
            reject(e)
        })

        req.end()
    })

}