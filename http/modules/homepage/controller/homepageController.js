const express = require('express')
const Auth = require('../../../middlewares/Auth')
const { getNotify } = require('../services/notifyService')
const { buttonDefinitions } = require('../../orders/services/state')
const { LocalStorage } = require('node-localstorage')
const localStorage = new LocalStorage('../../files')

const router = express.Router()

router.get('/', Auth, function (req, res) {
    localStorage.setItem('userId', req.session.authenticate.id)

    buttonDefinitions().then((response) => {
        localStorage.setItem('buttonDefinitions', JSON.stringify(response))
    })
    console.log(JSON.stringify(localStorage.getItem('buttonDefinitions')))
    if (localStorage.getItem('bufferSize') == null) {
        localStorage.setItem('bufferSize', 30)
    }
    res.render('index', { title: 'Express' })
})

router.get('/notification', function (req, res) {
    getNotify(localStorage.getItem('userId')).then((response) => {
        if (response.count > localStorage.getItem('notifyCount')) {
            res.json(response.notifications[0])
        } else {
            res.status(204).json({ value: false })
        }
        localStorage.setItem('notifyCount', response.count)
    }).catch((err) => {
        console.log(err)
    })
})
router.get('/notfound', Auth, (req, res) => {
    res.render('notfound')
})

module.exports = router
