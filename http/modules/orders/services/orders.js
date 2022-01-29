const fetch = require('node-fetch')
const base64 = require('base-64')
const { getPrinter, printOut } = require('../../printer/services/printer')
const { printerOrderData } = require('../data/printerOrderData')

async function orders (warehouse, status, page, all) {
    let data = await fetch(appHost + '/api/orders/' + warehouse + '/{"status":' + status + '}/' + page + '/' + all, {
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

async function printOrder (order, printOption) {
    return await printerOrderData(order, printOption).then(async (orderData) => {
        return await printOut(orderData).then(() => {
            return true
        }).catch((err) => {
            console.log(err)
            return false
        })
    })
}

async function order (order) {
    let data = await fetch(appHost + '/api/order/' + order, {
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

async function changeStatus (order, state) {
    let data = await fetch(appHost + '/api/order/' + order + '/' + state, {
        method: 'PUT',
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

module.exports = { orders, printOrder, order, changeStatus }
