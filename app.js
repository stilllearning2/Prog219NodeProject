var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

let option = { useNewUrlParser: true };  // new
const MongoClient = require('mongodb').MongoClient;
const mongoUrl = "mongodb+srv://BCuser:538492@Lh@cluster0-h371x.mongodb.net/test?retryWrites=true"
// pull in our to files with 2 families of route (get, put, etc)
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
//pp.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/assets/favicon/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  // new
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// new code from example
const port = 3000;
MongoClient.connect(mongoUrl, option, (err, database) => {
    if (err) return console.log(err)
    let db = database.db("Prog219DB")
    require('./routes/index')(app, db);

    app.listen(port, () => {
        console.log('Web server is live on ' + port);
    });
})