const {LocalStorage} = require("node-localstorage");
var localStorage = new LocalStorage('../files');

function Auth(req, res, next) {
    if (req.session.authenticate !== undefined) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = Auth;