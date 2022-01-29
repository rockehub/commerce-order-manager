const express = require('express')
const router = express.Router()

// GET home page.
router.get('/login', function (req, res) {
  res.render('login', { title: 'loginPage' })
})

router.get('/mainApp', function (req, res) {
  res.render('mainApp', { title: 'loginPage' })
})
module.exports = router
