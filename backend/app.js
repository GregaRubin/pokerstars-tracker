var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// vključimo mongoose in ga povežemo z MongoDB
var mongoose = require('mongoose');
var mongoDB = "mongodb://127.0.0.1/vaja3";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// vključimo routerje
var usersRouter = require('./routes/userRoutes');
var sessionRouter = require('./routes/sessionRoutes');

var app = express();

//get real ip address
app.set('trust proxy', true)

var cors = require('cors');
var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    // Allow requests with no origin (mobile apps, curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin)===-1){
      var msg = "The CORS policy does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Vključimo session in connect-mongo.
 * Connect-mongo skrbi, da se session hrani v bazi.
 * Posledično ostanemo prijavljeni, tudi ko spremenimo kodo (restartamo strežnik)
 */
var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: mongoDB})
}));
//Shranimo sejne spremenljivke v locals
//Tako lahko do njih dostopamo v vseh view-ih (glej layout.hbs)
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use('/users', usersRouter);
app.use('/sessions', sessionRouter);

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
  //res.render('error');
  res.json({"message" : err.message});
});

module.exports = app;
