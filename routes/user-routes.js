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
      appName: process.env.APP_NAME
    })
  }
});

router.post('/xhr/auth', (req, res) => {
  passport.authenticate('local', function (err, user) {
    if (err) {
      res.status(500).send({message: err.message});
    }
    if (!user) {
      res.send(401, {message: 'Wrong credentials, please verify and try again'});
    }
    req.login(user, function (err) {
      if (err) {
        res.status(500).send({message: err.message});
      } else {
        /**
         * success user authenticated and logged in
         */
        res.status(200).send({
          message: `logged ${req.user.email} successfully`
        });
      }
    });
  })(req, res);
});

router.get('/logout', async (req, res) => {
  try {
    req.logout();
    res.status(200).redirect('/');
  } catch (e) {
    res.status(500).send({
      message: e.message
    })
  }
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
      appName: process.env.APP_NAME
    })
  }
});

router.post('/xhr/user', [
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password must be at least 4 characters').isLength({min: 4})
], async (req, res) => {
  const results = await validationResult(req);
  if (results.errors.length > 0) {
    const message = results.errors.map(e => e.msg).join(', ');
    res.status(400).send({
      message: message
    });
  }
  try {
    const user = await UserModel.create(req.body);
    req.login(user, function (err) {
      if (err) {
        res.status(500).send({message: err.message});
      } else {
        /**
         * success user created and authenticated
         */
        res.status(201).send({
          message: `register ${req.user.email} successfully`
        });
      }
    });
  } catch (e) {
    res.status(400).send({
      message: "Your email is already in use, try login instead"
    });
  }
});

/**
 * Profile
 * @type {Route}
 */

router.get('/profile', async (req, res) => {
  if (req.user) {
    res.render('user/profile', {
      user: req.user
    })
  } else {
    res.status(401).redirect('/login')
  }
});

module.exports = router;