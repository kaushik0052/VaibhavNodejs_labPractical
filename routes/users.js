const express = require('express');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

function ensureGuest(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/workouts');
  }
  next();
}

router.get('/register', ensureGuest, (req, res) => {
  res.render('register', { title: 'Register', error: null });
});



router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    title: 'Login',
    error: req.query.error || null,
    success: req.query.success || null,
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/workouts',
    failureRedirect: '/login?error=Invalid%20username%20or%20password',
  })
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
