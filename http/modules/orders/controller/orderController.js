const express = require('express')
const Auth = require('../../../middlewares/Auth')
const router = express.Router()
const { LocalStorage } = require('node-localstorage')
const { state } = require('../services/state')
const { orders, printOrder, order, changeStatus, printNote } = require('../services/orders')
const localStorage = new LocalStorage('../../files')

router.get('/orders', Auth, async function(req, res) {
    state().then((response) => {
        res.render('orders', { localStorage: localStorage, states: response })
    }).catch((response) => {
        console.log(response)
        return res.status(400).json({
            success: false,
            errors: { error: { msg: response.message } }
        })
    })
    console.log(localStorage.getItem('warehouse'))
    if (localStorage.getItem('orderState') == null) {
        localStorage.setItem('orderState', JSON.stringify(['26']))
    }
    console.log(localStorage.getItem('orderState'))
    if (localStorage.getItem('orderSwitch') == null) {
        localStorage.setItem('orderSwitch', false)
    }
    console.log(localStorage.getItem('orderSwitch'))
})

router.post('/saveState', Auth, function(req, res) {
    try {
        if (req.body.states == undefined) {
            req.body.states = []
        }
        localStorage.setItem('orderState', JSON.stringify(req.body.states))
        res.json({ message: 'salved with success' })
    } catch (e) {
        console.log(e)
    }
})

router.post('/saveSwitch', Auth, function(req, res) {
    try {
        localStorage.setItem('orderSwitch', req.body.switch)
        res.json({ message: 'salved with success' })
    } catch (e) {
        console.log(e)
    }
})

router.get('/getOrders/:page', Auth, function(req, res) {
    orders(localStorage.getItem('warehouse'), localStorage.getItem('orderState'), req.params.page, localStorage.getItem('orderSwitch')).then((response) => {
        res.json(response)
    }).catch((response) => {
        console.log(response)
    })
})

router.get('/buttonDefinitions', Auth, function(req, res) {
    res.json(JSON.parse(localStorage.getItem('buttonDefinitions')))
})

router.post('/printOrder', Auth, function(req, res) {
    order(req.body.order).then((response) => {
        console.log(response)
        if (req.body.printerOption == 4) {
            printNote(response).then((response) => {
                if (response === true) {
                    res.json({ value: 'bilhete Imprimido com sucesso' })
                }
            }).catch((err) => {
                res.json({ value: err.message })

            })
        } else {
            printOrder(response, req.body.printerOption).then((response) => {
                if (response === true) {
                    res.json({ value: 'Pedido Imprimido com sucesso' })
                }
            }).catch((response) => {
                res.status(500).json({ error: response })
            })
        }
    })
})
router.post('/changeStatus', Auth, function(req, res) {
    changeStatus(req.body.order, req.body.status).then((response) => {
        res.json(response)
    }).catch((response) => {
        console.log(response)
    })
})

module.exports = router
