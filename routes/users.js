const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//USerModel
const User = require('../models/user-model');
const {
    forwardAuthenticated
} = require('../config/auth');


//login page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login');
});

// registration  page
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register');
});

// Register validation
router.post('/register', forwardAuthenticated, (req, res) => {
    const {
        fullName,
        email,
        password,
        password2
    } = req.body;
    const errors = [],
        regex = /^\S+@\S+\.\S+$/;
    if (!fullName || !email || !password || !password2) {
        errors.push({
            msg: "Please enter all fields"
        });
    } else if (regex.test(email) === false) {
        errors.push({
            msg: "Please enter a valid email"
        });
    } else if (password.length < 6) {
        errors.push({
            msg: "Password must be at least 6 characters"
        });
    } else if (password != password2) {
        errors.push({
            msg: "Password do not match"
        });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            fullName,
            email,
            password,
            password2
        })
    } else {
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    errors.push({
                        msg: "Email already exists"
                    });
                    res.render('register', {
                        errors,
                        fullName,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        fullName,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash(
                                        'successMessage',
                                        'you are account created successfully and can log in '
                                    );
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
    }

});


//login validation
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/dashboard');
    }
);


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('successMessage', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router;