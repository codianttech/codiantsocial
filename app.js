var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var compression = require('compression');
var LocalStrategy = require('passport-local').Strategy;
var PassportUtil = require('./lib/PassportUtil');
var CronJob = require('cron').CronJob;

var Core = require('./core/load.js');
var app = express();
var expressValidator = require('express-validator');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));
app.use('images', express.static(path.join(__dirname, 'assets/images')));


//All Cross Domain Access
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg
        };
    }
}));
//app.use('/', routes);
//app.use('/users', users);
app.set('rootDirectory', __dirname);
var env = app.get('env') || 'production';

var config = Core.loadConfig(app.get('rootDirectory'), env);
app.set('config', config);
mongoose.connect(config.database.mongodb.url, function (err) {
    if (err) {
        console.log(err);
        process.exit(0);
    } else {
        console.log('Mongodb connected');
    }
});
//mongoose.set('debug', true);

Core.loadRoutes(app.get('rootDirectory'), app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            success: false,
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message,
        error: err
    });
});
var CronJobs = require('./lib/CronJobs');
var job = new CronJob({
    cronTime: '02 00 * * *',
    onTick: function () {
        console.log('Cron Executed', new Date());
//add job
    },
    start: false
    //timeZone: 'America/Los_Angeles'
});
job.start();

module.exports = app;
