const express = require('express')
const Auth = require('../../../middlewares/Auth')
const { consultOrder } = require('../services/consult')

const router = express.Router()

router.get('/consultOrder', Auth, function (req, res) {
    consultOrder(req.params.code).then((response) => {
        res.render('consult', { orderData: response, host: appHost })
    }).catch((err) => {
        console.log(err)
        res.render('consult', { orderData: [] })
    })
})


router.get('/consultAllOrder', Auth, function (req, res) {

})
module.exports = router
