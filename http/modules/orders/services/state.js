const fetch = require('node-fetch')
const base64 = require('base-64')

async function state () {
    let data = await fetch(appHost + '/api/states', {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + base64.encode(basicUsername + ':' + basicPassword),
            Accept: '*/*',
            'Content-Type': 'application/json'
        }
    })
    data = await data
    const $data = data.json()
    if (!data.ok) {
        // create error object and reject if not a 2xx data code
        const err = new Error(data.statusText + ' ' + data.status)
        err.data = data
        err.status = data.status
        throw err
    }
    return $data
}

async function buttonDefinitions () {
    let data = await fetch(appHost + '/api/buttonDefinitions', {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + base64.encode(basicUsername + ':' + basicPassword),
            Accept: '*/*',
            'Content-Type': 'application/json'
        }
    })
    data = await data
    const $data = data.json()
    if (!data.ok) {
        // create error object and reject if not a 2xx data code
        const err = new Error(data.statusText + ' ' + data.status)
        err.data = data
        err.status = data.status
        throw err
    }
    return $data
}

module.exports = { state, buttonDefinitions }
