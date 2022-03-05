const express = require('express')
const Auth = require('../../../middlewares/Auth')
const { getNotify } = require('../../homepage/services/notifyService')
const { getOrder } = require('../services/notidy')
const os = require("os");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage(os.homedir()+'/storage/data');
}

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
