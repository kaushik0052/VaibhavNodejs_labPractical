const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/workouts', (req, res) => {
    res.render('workout');
});
app.get('/workouts/new', (req, res) => {
    res.render('new_workout');
});
app.get('/workouts/:id', (req, res) => {
    res.render('workout');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});