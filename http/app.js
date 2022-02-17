const express = require('express')
const path = require('path')
global.appHost = "https://mirelladoceshomolog.com.br";
global.basicUsername = "a04afc85-d725-4679-bbfe-f9494f8d427f"
global.basicPassword = "f0b80972-e9ee-4872-8624-5f66c4115bb6"
global.alloweDToPrepare = ['26']
// favicon = require('serve-favicon'),
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./routes')
const app = express()
const session = require('express-session')
const fileUpload = require('express-fileupload');

const authenticateController = require('./modules/authenticate/controller/authenticateController')
const homepageController = require('./modules/homepage/controller/homepageController')
const settingsController = require('./modules/settings/controller/settingsController')
const ordersController = require('./modules/orders/controller/orderController')
const consultController = require('./modules/consult/controller/consultController')
const notifyController = require('./modules/notification/controller/notificationController')

app.use(session({
    secret: 'akhfkahfkahfkjsdhfkashfdjk',
    cookie: { maxAge: 30000000 },
    resave: true,
    saveUninitialized: true
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(fileUpload({
    createParentPath: true
}));

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes)
app.use('/', authenticateController)
app.use('/', homepageController)
app.use('/', settingsController)
app.use('/', ordersController)
app.use('/', consultController)
app.use('/', notifyController)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

app.locals = {
    customFieldValue: function (custom_field) {
        switch (custom_field.custom_field.type) {
        case 'checkbox':
            return custom_field.value
        case 'dropdown':
            return custom_field.display_value
        case 'text':
            return custom_field.value
        case 'textarea':
            return custom_field.value
        case 'image':
            return custom_field.display_value
        case 'color':
            return custom_field.display_value
        default:
            console.log('custom field not found: ')
        }
    }
}
module.exports = app
