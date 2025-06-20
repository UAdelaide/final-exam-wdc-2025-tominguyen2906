var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// MySQL connection setup
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/dogs', async (req, res, next) => {
  try {
    const [dogs] = await db.execute('SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username FROM Dogs JOIN Users ON Dogs.owner_id = Users.user_id');
    res.json(dogs);
  } catch (err) {
    next(err);
  }
});

app.get('/api/walkrequests/open', async (req, res, next) => {
  try {
    const [walkRequests] = await db.execute('SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username FROM WalkRequests JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id JOIN Users ON Dogs.owner_id = Users.user_id WHERE WalkRequests.status = "open"');
    res.json(walkRequests);
  } catch (err) {
    next(err);
  }
});

app.get('/api/walkers/summary', async (req, res, next) => {
  try {
    const query = `
      SELECT
          u.username AS walker_username,
          IFNULL(ratings.total_ratings, 0) AS total_ratings,
          ratings.average_rating,
          IFNULL(walks.completed_walks, 0) AS completed_walks
      FROM
          Users u
      LEFT JOIN (
          SELECT
              walker_id,
              COUNT(rating_id) AS total_ratings,
              AVG(rating) AS average_rating
          FROM WalkRatings
          GROUP BY walker_id
      ) AS ratings ON u.user_id = ratings.walker_id
      LEFT JOIN (
          SELECT
              wa.walker_id,
              COUNT(wr.request_id) AS completed_walks
          FROM WalkApplications wa
          JOIN WalkRequests wr ON wa.request_id = wr.request_id
          WHERE wa.status = 'accepted' AND wr.status = 'completed'
          GROUP BY wa.walker_id
      ) AS walks ON u.user_id = walks.walker_id
      WHERE u.role = 'walker'
      ORDER BY u.username;
    `;
    const [walkersSummary] = await db.execute(query);
    res.json(walkersSummary);
  } catch (err) {
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
