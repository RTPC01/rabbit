const User = require('../models/user');
const { cloudinary } = require("../cloudinary");

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        user.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Rabbit!');
            res.redirect('/rabbits');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/rabbits';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function(err){
        if (err) { return next(err); }
    });
    req.flash('success', "Successfully Logout!");
    return res.redirect('/rabbits');
}