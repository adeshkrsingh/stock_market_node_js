const express = require('express');
const logger = require('morgan');
const stocks = require('./routes/stocks') ;
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./app/configurations/database'); //database configuration
var jwt = require('jsonwebtoken');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var path = require('path');

const app = express();
app.set('secretKey', 'myNodejsStockApp'); 
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// please uncomment it to use jwt-auth
/*
app.use('/stocks', validateUser, stocks);
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
  
}
*/




app.get('/', function(req, res){
res.json({"Welcome" : "Stock Data View App"});
});

app.use('/users', users);
/* Please uncomment it to use jwt-auth */
//app.use('/stocks', validateUser, stocks);

app.use('/stocks', stocks);

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});
function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
  
}

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({status:"error 500", message: err.message, data:null});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({status:"error 500", message: err.message, data:null});
});

module.exports = app;