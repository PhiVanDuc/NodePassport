const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressEjsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('./passports/passport.local');
const passportGoogle = require('./passports/passport.google');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testOrmRouter = require('./routes/test_orm');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middlewares/auth.middleware');
const validateMiddleware = require('./middlewares/validate.middleware');

const { User } = require('./models/index');

const app = express();
app.use(session({
  secret: 'F8',
  resave: false,
  saveUninitialized: true,
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use('local', passportLocal);
passport.use('google', passportGoogle);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(validateMiddleware);
app.use('/auth', authRouter);
app.use('/test_orm', testOrmRouter);
app.use(authMiddleware);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;