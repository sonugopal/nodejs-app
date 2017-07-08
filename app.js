var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db=require('./model/db');
var project = require('./routes/project');
var user = require('./routes/user');
var session=require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secretkey'}));

app.use('/project', project);
app.use('/user', user);

// catch 404 and forward to error handler


module.exports = app;

app.get('/',user.home);
app.get('/user',user.index);
app.get('/user/new',user.create);
app.post('/user/new',user.doCreate);
app.get('/login',user.login);
app.post('/login',user.doLogin);
/*app.get('/user/edit',user.edit);
app.post('/users/edit',user.doEdit);
app.get('/user/delete',user.confirmDelete);
app.post('/user/delete',user.doDelete);



app.get('/logout',user.doLogout)

app.get('/project/:id',project.displayInfo);
app.get('/project/edit/:id',project.edit);
app.post('/project/edit/:id',project.doEdit);
app.get('/project/delete/:id',project.confirmDelete);
app.post('/project/delete/:id',project.doDelete);

*/
app.get('/project/new',project.create);
app.post('/project/new',project.doCreate);
app.get('/project/view/:id',project.viewProjects);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
