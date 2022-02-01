const express = require('express')
const Auth = require('../../../middlewares/Auth')
const router = express.Router()
const path = require("path");
const { warehouses, printers } = require('../services/settings')
const { LocalStorage } = require('node-localstorage')
const localStorage = new LocalStorage('../../files')
var home = require("os").homedir();

router.get('/settings', Auth, function(req, res) {
    warehouses().then((response) => {
        printers().then((availablePrinters) => {
            console.log()
            res.render('settings', {
                    warehouses: eval(response),
                    printers: availablePrinters,
                    localStorage: localStorage,
                    home: home
                }
            )
        })
    })
})

router.post('/savePrinter', Auth, function(req, res) {
    try {
        localStorage.setItem('printer', req.body.printer)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})

router.post('/saveTicketPrinter', Auth, function(req, res) {
    try {
        localStorage.setItem('ticketPrinter', req.body.printer)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})

router.post('/saveWarehouse', Auth, function(req, res) {
    try {
        localStorage.setItem('warehouse', req.body.warehouse)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})

router.post('/saveBuffer', Auth, function(req, res) {
    try {
        localStorage.setItem('bufferSize', req.body.buffer)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})

router.post('/savePage', Auth, function(req, res) {
    try {
        localStorage.setItem('PageWidth', req.body.width)
        localStorage.setItem('PageHeight', req.body.height)
        localStorage.setItem('PageValue', req.body.value)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})

router.post('/saveMargin', Auth, function(req, res) {
    try {
        localStorage.setItem('PageFont', req.body.font)
        localStorage.setItem('PageTop', req.body.top)
        localStorage.setItem('PageLeft', req.body.left)
        localStorage.setItem('PageRight', req.body.right)
        localStorage.setItem('PageBottom', req.body.bottom)
        res.json({ result: 'success' })
    } catch (exception) {
        console.log(exception)
    }
})


router.post('/upload-back', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.back;
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv(home + '\\Documents\\COMNotesFolder\\background\\' + avatar.name);
            avatar.mv(path.join(__dirname, "../../../public/images/" + avatar.name)).then((response) => {
                console.log(response)
            }).catch(err => console.log(err))
                localStorage.setItem('ImgBackground', avatar.name)
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router
