const express = require('express')
const Auth = require('../../../middlewares/Auth')
const router = express.Router()
const { warehouses, printers } = require('../services/settings')
const { LocalStorage } = require('node-localstorage')
const localStorage = new LocalStorage('../../files')

router.get('/settings', Auth, function (req, res) {
    warehouses().then((response) => {
        printers().then((availablePrinters) => {
            res.render('settings', {
                warehouses: eval(response),
                printers: availablePrinters,
                localStorage: localStorage
            })
        })
    })
})
router.post('/savePrinter', Auth, function (req, res) {
    try {
        localStorage.setItem('printer', req.body.printer)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})

router.post('/saveWarehouse', Auth, function (req, res) {
    try {
        localStorage.setItem('warehouse', req.body.warehouse)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})

router.post('/saveBuffer', Auth, function (req, res) {
    try {
        localStorage.setItem('bufferSize', req.body.buffer)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})
module.exports = router
