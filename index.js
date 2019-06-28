require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
// module allows use of sessions
const session = require('express-session');
// imports passport local strategy
const passport = require('./config/passportConfig');
// module for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn');
//wear a helmet!
const helmet = require('helmet');

// this is only used by the session store in this file
const db = require('./models')

const app = express();

// this line makes the session use sequelize to write sessions data to a postgres table
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  expiration: 1000 * 60 * 30
});

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(ejsLayouts);
app.use(helmet());

// Configures express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// use this line once to set up the store table
sessionStore.sync();

// starts the flash middleware
app.use(flash());

// link passport to the express session
// MUST BE BELOW SESSION
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
