const fetch = require('node-fetch')
const base64 = require('base-64')
const nodePrinter = require('@thiagoelg/node-printer')


async function warehouses() {
    let data = await fetch(appHost + '/api/warehouses', {
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

async function printers() {
    return await nodePrinter.getPrinters()
}

function getPrinterSize() {

}

module.exports = { warehouses, printers }
