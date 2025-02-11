var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(
    function(req,res,next){
        console.log('The common middleware called');
        next();
    }
);

app.use('/example',
    function(req,res,next){
        console.log('The example middleware called');
        next();
    }
);


app.get('/example',
    function(request,response){
        response.send('I am example');
        console.log('I am example');
    }
);

app.get('/example/:name',
    function(request,response){
        response.send('Hello '+request.params.name);
    }
);

app.get('/example2/:firstName/:lastName',
    function(request, response){
        response.send('Hello '+request.params.firstName+" "+request.params.lastName);
    }
);

app.post('/',
    function(request,response){
        response.send(request.body);
        console.log(request.body);
    }
);


module.exports = app;
