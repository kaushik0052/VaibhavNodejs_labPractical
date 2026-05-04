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

router.post('/register', ensureGuest, async (req, res) => {
  const { username, password, age, gender, fitnessGoal } = req.body;
  if (!username || !password || !age || !gender || !fitnessGoal) {
    return res.render('register', {
      title: 'Register',
      error: 'All fields are required.',
    });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.render('register', {
        title: 'Register',
        error: 'Username is already taken.',
      });
    }

    const ageNumber = Number(age);
    if (Number.isNaN(ageNumber) || ageNumber < 1) {
      return res.render('register', {
        title: 'Register',
        error: 'Age must be a positive number.',
      });
    }

    const user = new User({ username, password, age: ageNumber, gender, fitnessGoal });
    await user.save();
    res.redirect('/login?success=Account%20created%20successfully');
  } catch (err) {
    res.render('register', {
      title: 'Register',
      error: 'Unable to create account. Please try again.',
    });
  }
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
