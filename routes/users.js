/**
 * Created by hama on 2016/12/8.
 */
//登录注册的路由

var express = require('express');
var router = express.Router();

//加载依赖
var url = require('url');
//验证
var validator = require('validator');
//数据库操作类
var User = require('../models/User');
var Notify = require('../models/Notify');
//var DBSet = require('../models/db');
var siteFunc = require('../models/db/siteFunc');
//加密类
var crypto = require('crypto');
//时间格式化
var moment = require('moment');
//站点的配置
var settings = require('../models/db/settings');
var shortid = require('shortid');




var returnUserRouter = function(io){
    return router;
}
module.exports = returnUserRouter;

