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
var settings = require('../models/db/settings');
var adminFunc = require('../models/db/adminFunc');

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
//刷新验证码
router.get('/vnum',function(req,res){
    var word = req.session.vnum;
    pngword.createPNG(word,function(word){
        res.end(word);
    })
})
//登录提交行为
router.post('/doLogin',function(req,res){
    var userName = req.body.userName;
    var password = req.body.password;
    var vnum = req.body.vnum;
    var newPsd = DbSet.encrypt(password,settings.encrypt_key);
    console.log(newPsd);
    if(vnum != req.session.vnum){
        req.session.vnum = rw.random(4);
        res.end('验证码有误!');
    }else{
        if(validator.matches(userName,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/) && validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/)){
           /* AdminUser.findOne({'userName':userName,'password':newPsd}).populate('group').exec(function(err,user){
                if(err){
                    res.end(err);
                }
                if(user) {
                    req.session.adminPower = user.group.power;
                    req.session.adminlogined = true;
                    req.session.adminUserInfo = user;
                    //获取管理员通知信息
                    adminFunc.getAdminNotices(req,res,function(noticeObj){
                        req.session.adminNotices = noticeObj;
                        res.end("success");
                    });
                }else{
                    console.log("登录失败");
                    res.end("用户名或密码错误");
                }
            });*/
            res.end('success');
        }else{
            res.end('非法参数');
        }
    }
})

//主界面
router.get('/manage',function(req,res){
    res.render('manage/main',{
        title:'后台首页',
        layout:'manage/public/adminTemp',
        bigCategory:'sysTemManage',
        currentLink:req.originalUrl
    });
})
//用户组
router.get('/manage/adminGroupList',function(req,res){
    res.render('manage/adminGroupList',{
        title:'系统用户组管理',
        layout:'manage/public/adminTemp',
        bigCategory:'sysTemManage_uGroup',
        currentLink:req.originalUrl
    })
})
//用户
router.get('/manage/adminUsersList',function(req,res){
    res.render('manage/adminUsersList',{
        title:'系统用户管理',
        layout:'manage/public/adminTemp',
        bigCategory:'sysTemManage_user',
        currentLink:req.originalUrl
    })
})
//文章内容
router.get('/manage/contentList',function(req,res){
    res.render('manage/contentList',{
        title:'文章内容管理',
        layout:'manage/public/adminTemp',
        bigCategory:'contentManage_content',
        currentLink:req.originalUrl
    })
})
//文章分类
router.get('/manage/contentCategorys',function(req,res){
    res.render('manage/contentCategorys',{
        title:'文章分类管理',
        layout:'manage/public/adminTemp',
        bigCategory:'contentManage_cateGory',
        currentLink:req.originalUrl
    })
})
//文章的标签
router.get('/manage/contentTags',function(req,res){
    res.render('manage/contentTags',{
        title:'文章标签管理',
        layout:'manage/public/adminTemp',
        bigCategory:'contentManage_tag',
        currentLink:req.originalUrl
    })
})
//文章的留言
router.get('/manage/messageList',function(req,res){
    res.render('manage/messageList',{
        title:'文章留言管理',
        layout:'manage/public/adminTemp',
        bigCategory:'contentManage_msg',
        currentLink:req.originalUrl
    })
})
//系统消息列表
router.get('/manage/sysTemBackStageNotice',function(req,res){
    res.render('manage/systemNotice',{
        title:'系统消息',
        layout:'manage/public/adminTemp',
        bigCategory:'contentManage_notice',
        currentLink:req.originalUrl
    })
})
//注册用户的管理
router.get('/manage/regUsersList',function(req,res){
    res.render('manage/regUsersList',{
        title:'注册用户管理',
        layout:'manage/public/adminTemp',
        bigCategory:'userManage_user',
        currentLink:req.originalUrl
    })
})
//-------------------------后台模块访问入口结束----------------------------

//-------------------------对象列表查询开始(带分页)------------------------

router.get('/manage/getDocumentList/:defaultUrl',function(req,res){
    var targetObj = adminFunc.getTargetObj(req.params.defaultUrl);
    //根据当前的栏目以及分页信息参数查询所有的内容并返回
    DbSet.pagination(targetObj,req,res);
})




module.exports = router;