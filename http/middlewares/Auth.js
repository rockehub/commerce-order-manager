function Auth(req, res, next) {
    if (req.session.authenticate !== undefined) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = Auth;