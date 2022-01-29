const express = require('express')
const { authenticate, login, logout } = require('../services/Authenticate')
const router = express.Router()
const macaddress = require('macaddress')
const { body, validationResult } = require('express-validator')
const Auth = require('../../../middlewares/Auth')

router.get('/authenticate', async (req, res) => {
  macaddress.one().then(async function (mac) {
    let status = false
    await authenticate({ mac: mac }).then((response) => {
      if (response.value === true) {
        status = true
        req.session.authenticate = JSON.parse(response.data);
      }
      res.json({ value: status })
    })
  })
})

router.get('/server', (req, res) => {
  res.json({ value: false })
})
router.post('/login', body('username').isAlpha().isLength({ min: 3, max: 20 }),
  body('password').isLength({
    min: 3
  }), (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }
    macaddress.one().then(async function (mac) {
      const data = req.body
      data.mac = mac
      login(data).then((response) => {
        req.session.authenticate = response
        res.status(200).json({
          success: true,
          message: response
        })
      }).catch((response) => {
        return res.status(400).json({
          success: false,
          errors: { error: { msg: response.message } }
        })
      })
    })
  })

router.get('/logout', Auth, function (req, res) {
  macaddress.one().then(async function (mac) {
    logout({ mac: mac }).then((response) => {
      req.session.authenticate = response

      try {
        req.session.authenticate = null
        res.status(200).json({
          value: true,
          message: response
        })
      } catch (e) {
        res.json(e)
      }
    })
  })
})
module.exports = router
