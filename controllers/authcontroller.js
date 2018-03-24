exports.signup = (req, res) => res.render('signup');
exports.signin = (req, res) => res.render('signin');
exports.google = (req, res) => res.render("google");
exports.logout = (req, res) => {
    req.session.destroy(err => {
        res.redirect('signin');
    });
};

module.exports = exports;