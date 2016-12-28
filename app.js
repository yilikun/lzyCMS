var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//新增的功能
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var io = require('socket.io')();
var fs = require('fs');

var moment = require('moment');
var partials = require('express-partials');
//系统功能支持
var system = require('./routes/system');
//站点的配置
var settings = require('./models/db/settings');
//路由的加载
var routes = require('./routes/index');
var users = require('./routes/users')(io);//用户的登录注册用到了io
//位置很重要，要放在路由的后边
var filter = require('./util/filter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(settings.session_secret));
//设置session
app.use(session({
    secret: settings.session_secret,
    store: new RedisStore({
        port: settings.redis_port,
        host: settings.redis_host,
        pass : settings.redis_psd,
        ttl: 1800 // 过期时间
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(filter.authUser);
//存储本地信息
/*app.use(function(req, res, next){
//    针对注册会员
    res.locals.logined = req.session.logined;
    res.locals.userInfo = req.session.user;
//    针对管理员
    res.locals.adminlogined = req.session.adminlogined;
    res.locals.adminUserInfo = req.session.adminUserInfo;
    res.locals.adminNotices = req.session.adminNotices;
//    指定站点域名
    res.locals.myDomain = req.headers.host;
    next();
});*/

//事件监听
app.io = io;
io.on('connection', function (socket) {
//    socket.emit('news', { hello: 'world' });
//    socket.on('my other event', function (data) {
//        console.log(data);
//    });
});
//数据格式化
app.locals.myDateFormat = function(date){
    moment.locale('zh-cn');
    return moment(date).startOf('hour').fromNow();
};

app.locals.searchKeyWord = function(content,key){
    var newContent = content;
    if(newContent && key){
        var keyword = key.replace(/(^\s*)|(\s*$)/g, "");
        if(keyword != ''){
            var reg = new RegExp(keyword,'gi');
            newContent = content.replace(reg, '<span style="color:red">'+key+'</span>');
        }
    }
    return newContent;
};

app.use(express.static(path.join(__dirname, 'public')));


//首页路由
app.use('/', routes);
//登录注册的路由
app.use('/users', users);
//系统需要的功能
app.use('/system',system);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000,function(){
    console.log('node is OK');
})
module.exports = app;
