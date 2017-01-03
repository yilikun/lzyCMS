/**
 * Created by hama on 2016/12/29.
 */
var express = require('express');
var router = express.Router();
//开启大小写不敏感功能
router.caseSensitive = true;
var url = require('url');

//管理员
var AdminUser = require('../models/AdminUser');
//用户组
var AdminGroup = require('../models/AdminGroup');
//文章
var Article = require('../models/Article');
//文章分类
var Category = require('../models/Category');
//文章标签
var Tags = require('../models/Tags');
//文章留言
var Message = require('../models/Message');
//前台用户
var User = require('../models/User');
//系统消息
var Notify = require('../models/Notify');
//用户消息
var UserNotify = require('../models/UserNotify');

//功能
var validator = require('validator');
var shortid = require('shortid');
var system = require('../util/system');
var cache = require('../util/cache');
var crypto = require('crypto');
//通用数据库操作类
var DbSet = require('../models/db');

//文件操作
var unzip = require('unzip');
var fs = require('fs');
var iconv = require('iconv-lite');
var http = require('http');
var request = require('request');

//生成随机数
var PW = require('png-word');
var RW = require('../util/randomWord');
var rw = RW('abcdefghijklmnopqrstuvwxyz1234567890');
var pngword = new PW(PW.GRAY);

//管理员的登录页面
router.get('/',function(req,res){
    req.session.vnum = rw.random(4);
    res.render('manage/adminLogin',{
        title:'后台管理首页'
    })
})




module.exports = router;