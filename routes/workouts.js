const express = require('express');
const Workout = require('../models/workout');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

router.use(ensureAuthenticated);

router.get('/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find({ owner: req.user.id }).sort({ workoutDate: -1 });
    res.render('workouts', { title: 'My Workouts', workouts });
  } catch (err) {
    res.status(500).send('Unable to load workouts.');
  }
});

router.get('/workout/new', (req, res) => {
  res.render('new-workout', { title: 'New Workout', workout: {} });
});




module.exports = router;
