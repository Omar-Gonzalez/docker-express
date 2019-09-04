const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./models/user-model');

/**
 * Moongose connection
 * @type connection{string}
 */
const connection = `mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@mongodb/${process.env.DB_NAME}?authSource=admin`;
mongoose.connect(connection, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

/**
 * Configure app middleware
 */
const app = express();
app.set('view engine', 'ejs');
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public/css-dist'),
  debug: true,
  indentedSyntax: false,
  outputStyle: 'compressed',
}));
app.use('/styles', express.static('public/css-dist/styles'));
app.use('/bootstrap-js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/', express.static(__dirname + '/views/react/dist'));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
  app.use(morgan('dev'));
} else {
  //production
  const logStream = fs.createWriteStream(path.join(__dirname + '/logs', 'access.log'), {flags: 'a'})
  app.use(morgan('combined', {stream: logStream}));
}

/**
 * initialize passport local strategy
 */
passport.use(new LocalStrategy(
  {usernameField: 'email'}, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({email: email, password: password})
      return done(null, user);
    } catch (e) {
      return done(null, false);
    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  UserModel.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

/**
 * enable sessions
 */
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: db})
}));

/**
 * initialize auth middleware
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * define app routes
 */
const userEndpoints = require('./routes/user-routes');

app.use('/', userEndpoints);

app.get('/', async (req, res) => {
  res.render('home', {
    appName: process.env.APP_NAME,
    author: 'Omar Gonzalez',
    year: new Date().getFullYear(),
    user: req.user,
  });
});

/**
 * 404
 */
app.use(async (req, res) => {
  const status = 404;
  res.status(status).render('error', {
    msg: 'NOT FOUND',
    status: status
  });
});

app.listen(process.env.PORT, process.env.HOST);
const status = ` 
  express app running with cmd : "${process.env.START_COMMAND}"
  express app running on http://${process.env.HOST}:${process.env.PORT}
  mongodb status: ${db.readyState === 1 ? 'connected' : 'failed to connect'}
  node env : ${process.env.NODE_ENV}`;
console.log(status)
