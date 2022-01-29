const express = require('express')
const Auth = require('../../../middlewares/Auth')
const { getNotify } = require('../../homepage/services/notifyService')
const { getOrder } = require('../services/notidy')
const { LocalStorage } = require('node-localstorage')
const localStorage = new LocalStorage('../../files')

const router = express.Router()

router.get('/notify', Auth, (req, res) => {
    getNotify(req.session.authenticate.id).then((response) => {
        res.render('notify', { notify: Object.keys(response.notifications).map(key => response.notifications[key]) })
    })
})
router.get('/newOrder', (req, res) => {
    getOrder(localStorage.getItem('warehouse')).then((response) => {
        res.status(200).json(response)
    })
})
module.exports = router
