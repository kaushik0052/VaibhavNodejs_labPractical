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

router.post('/workout', async (req, res) => {
  const { workoutType, duration, caloriesBurned, workoutDate, notes } = req.body;
  if (!workoutType || !duration || !caloriesBurned || !workoutDate || !notes) {
    return res.render('new-workout', {
      title: 'New Workout',
      workout: req.body,
      error: 'All fields are required.',
    });
  }

  try {
    const workout = new Workout({
      owner: req.user.id,
      workoutType,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      workoutDate,
      notes,
    });
    await workout.save();
    res.redirect('/workouts');
  } catch (err) {
    res.render('new-workout', {
      title: 'New Workout',
      workout: req.body,
      error: 'Unable to save workout. Please check the form and try again.',
    });
  }
});

router.get('/workouts/:id', async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, owner: req.user.id });
    if (!workout) {
      return res.status(404).render('404', { title: 'Workout Not Found' });
    }
    res.render('workout-details', { title: 'Workout Details', workout });
  } catch (err) {
    res.status(500).send('Unable to load workout details.');
  }
});

router.get('/workouts/:id/edit', async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, owner: req.user.id });
    if (!workout) {
      return res.status(404).render('404', { title: 'Workout Not Found' });
    }
    res.render('edit-workout', { title: 'Edit Workout', workout, error: null });
  } catch (err) {
    res.status(500).send('Unable to load workout edit form.');
  }
});

router.put('/workouts/:id', async (req, res) => {
  const { duration, caloriesBurned, workoutDate, notes } = req.body;
  if (!duration || !caloriesBurned || !workoutDate || !notes) {
    const workout = await Workout.findOne({ _id: req.params.id, owner: req.user.id });
    return res.render('edit-workout', {
      title: 'Edit Workout',
      workout,
      error: 'All editable fields are required.',
    });
  }

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      {
        duration: Number(duration),
        caloriesBurned: Number(caloriesBurned),
        workoutDate,
        notes,
      },
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).render('404', { title: 'Workout Not Found' });
    }
    res.redirect(`/workouts/${workout.id}`);
  } catch (err) {
    const workout = await Workout.findOne({ _id: req.params.id, owner: req.user.id });
    res.render('edit-workout', {
      title: 'Edit Workout',
      workout,
      error: 'Unable to update workout. Please check the form and try again.',
    });
  }
});

router.delete('/workouts/:id', async (req, res) => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    res.redirect('/workouts');
  } catch (err) {
    res.status(500).send('Unable to delete workout.');
  }
});

module.exports = router;
