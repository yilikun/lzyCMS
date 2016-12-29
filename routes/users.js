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
var DBSet = require('../models/db');
var siteFunc = require('../models/db/siteFunc');
//加密类
var crypto = require('crypto');
//时间格式化
var moment = require('moment');
//站点的配置
var settings = require('../models/db/settings');
var shortid = require('shortid');
//系统相关操作
var system = require("../util/system");
//数据校验
var filter = require('../util/filter');




var returnUserRouter = function(io){
    //判断是否登录
    function isLogined(req){
        return req.session.logined;
    }
    //用户注册的页面
    router.get('/reg',function(req,res,next){
         res.render('web/userReg',{
            title:'用户注册',
            logined:req.session.logined,
            userInfo:req.session.user
        });
    })
    //用户注册的行为
    router.post('/doReg',function(req,res,next){
        var errors;
        var userName = req.body.userName;
        var email = req.body.email;
        var password = req.body.password;
        var confirmPsd = req.body.confirmPassword;
        //检验数据
        if(!validator.matches(userName,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/)){
            errors = "用户名5-12个英文数字组合";
        }
        if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/) || !validator.isLength(password,6,12)){
            errors = "6-12位，只能包含字母、数字和下划线";
        }
        if(password !== confirmPsd)
        {
            errors = "密码不匹配，请重新输入";
        }
        if(!validator.isEmail(email)){
            errors = "请填写正确的邮箱地址";
        }
        if(errors){
            res.end(errors);
        }else{
            var regMsg = {
                email : email,
                userName : userName
            };
            //邮箱和用户名都必须唯一
            var query=User.find().or([{'email' : email},{userName : userName}]);
            query.exec(function(err,user){
                if(user.length > 0){
                    errors = "邮箱或用户名已存在！";
                    res.end(errors);
                }else{
                    //发送一个注册信息的邮件。
                    system.sendEmail(settings.email_notice_user_reg,regMsg,function(err){
                        if(err && err == 'notCurrentEmail'){
                            res.end('乱写邮箱被我发现了吧！');
                        }else{
                            var newPsd = DBSet.encrypt(password,settings.encrypt_key);
                            req.body.password = newPsd;
                            //发送系统消息给管理员
                            siteFunc.sendSystemNoticeByType(req,res,'reg',userName);
                            DBSet.addOne(User,req, res)
                        }
                    });
                }
            });
        }
    })
    //用户的登录页面
    router.get('/login',function(req,res,next){
        if(isLogined(req)){
              res.redirect('/');
        }else{
              res.render('web/userLogin',{
                title:'用户登录',
                logined:req.session.logined,
                userInfo:req.session.user
            })
        }
    })
    //用户的登录行为
    router.post('/doLogin',function(req,res,next){
        var email = req.body.email;
        var password = req.body.password;
        var errors;
        var newPsd = DBSet.encrypt(password,settings.encrypt_key);
        if(!validator.isEmail(email)){
            errors = '邮箱格式不正确';
        }
        if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/) || !validator.isLength(password,6,12)){
            errors = '密码6-12个字符';
        }
        if(errors){
            res.end(errors);
        }else{
            //成功之后
            User.findOne({email:email,password:newPsd},function(err,user){
                if(user){
                    //将cookie存入缓存
                    filter.gen_session(user,res);
                    res.end('success');
                }else{
                    res.end('用户名或者密码错误!');
                }
            })
        }
    })
    //用户退出
    router.get('/logout',function(req,res){
        req.session.destroy();
        res.clearCookie(settings.auth_cookie_name);
        res.end('success');
    })
    //用户中心
    router.get('/userCenter',function(req,res){
        if(isLogined(req)){
            res.render('web/userCenter',{
                title:'用户中心',
                logined:req.session.logined,
                userInfo:req.session.user
            })
        }else{
            res.render('web/userLogin',{
                title:'用户登录',
                logined:req.session.logined,
                userInfo:req.session.user
            })
        }
    })
    //通过ID查找指定的注册用户信息
    router.get('/userInfo',function(req,res,next){
        var params = url.parse(req.url,true);
        var currentId = params.query.uid;
        if(shortid.isValid(currentId)){
            User.findOne({_id:currentId},function(err,result){
                if(err){
                    console.log(err);
                }else{
                    if(result && result.password){
                        //console.log(result);
                        var decipher = crypto.createDecipher("bf",settings.encrypt_key);
                        var oldPsd = "";
                        oldPsd += decipher.update(result.password,"hex","utf8");
                        oldPsd += decipher.final("utf8");
                        result.password = oldPsd;
                    }
                    return res.json(result);
                }
            })
        }
    })
    //修改用户的信息
    router.post('/userInfo/modify',function(req,res,next){
        var errors ;
        var email = req.body.email;
        var password = req.body.password;
        var userName = req.body.userName;
        var name = req.body.name;
        var city = req.body.city;
        var company = req.body.company;
        var qq = req.body.qq;
        var phoneNum = req.body.phoneNum;
        //数据验证
        if(!validator.matches(userName,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/)){
            errors = "用户名5-12个英文字符";
        }
        if(name && !validator.matches(name,/[\u4e00-\u9fa5]/)){
            errors = "姓名格式不正确";
        }
        if(!validator.isEmail(email)){
            errors = "请填写正确的邮箱地址";
        }
        if(city && !validator.isLength(city,3,16)){
            errors = "请填写正确的城市名称";
        }
        if(company && !validator.isLength(company,3,16)){
            errors = "请填写正确的学校中文名称";
        }
        if(qq && !validator.matches(qq,/^[1-9][0-9]{4,9}$/)){
            errors = "请填写正确的QQ号码";
        }
        if(phoneNum && !validator.matches(phoneNum,/^1[3|4|5|8][0-9]\d{4,8}$/)){
            errors = "请填写正确的手机号码";
        }
        if(errors){
            res.end(errors);
        }else{
            var newPsd = DBSet.encrypt(password,settings.encrypt_key);
            req.body.password = newPsd;
            DBSet.updateOneByID(User,req, res,"modify regUser");
        }
    })
    return router;
}
module.exports = returnUserRouter;

