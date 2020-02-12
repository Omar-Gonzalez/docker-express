const express = require('express');
const router = express.Router();
const passport = require('passport');
const {check, validationResult} = require('express-validator');
const UserModel = require('../models/user-model');

/**
 * Login
 * @type {Route}
 */

router.get('/login', async (req, res) => {
  if (req.user) {
    res.redirect('/profile')
  } else {
    res.render('user/login', {
      errors: req.flash('error'),
    })
  }
});

router.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: 'Wrong credentials, please verify and try again'
    }
  ));

router.get('/logout', async (req, res) => {
  req.logout();
  res.redirect('/');
});

/**
 * Register new user
 * @type {Route}
 */

router.get('/register', async (req, res) => {
  if (req.user) {
    res.redirect('/profile');
  } else {
    res.render('user/register', {
      errors: [],
    })
  }
});


router.post('/register', [
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password must be at least 4 characters').isLength({min: 4})
], async (req, res) => {
  const results = await validationResult(req);
  if (results.errors.length > 0) {
    const message = results.errors.map(e => e.msg).join(', ');
    res.render('user/register', {
      errors: [message],
    })
  }
  try {
    const user = await UserModel.create(req.body);
    req.login(user, function (err) {
      if (err) {
        res.render('user/register', {
          errors: err.message,
        })
      } else {
        /**
         * success user created and authenticated
         */
        res.redirect('/profile');
      }
    });
  } catch (err) {
    res.render('user/register', {
      errors: ['An account with that email already exist, try login instead'],
    })
  }
});

/**
 * Profile
 * @type {Route}
 */

router.get('/profile', async (req, res) => {
  if (req.user) {
    res.render('user/profile')
  } else {
    res.status(401).redirect('/login')
  }
});

module.exports = router;
