
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var settings = require('../models/db/settings');
var UserNotify = require('../models/UserNotify');
//用户实体类
var User = require("../models/User");

function gen_session(user, res) {
    var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    res.cookie(settings.auth_cookie_name, auth_token,
        {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true}); //cookie 有效期30天
}

exports.gen_session = gen_session;
exports.authUser = function (req, res, next) {

    if (settings.debug && req.cookies['mock_user']) {
        var mockUser = JSON.parse(req.cookies['mock_user']);
        req.session.user = new UserModel(mockUser);
        return next();
    }
    //如果是其他的静态资源的请求，这里就不再生成user这个信息了.
    if (req.session.user) {
        UserNotify.getNoReadNotifyCountByUserId(req.session.user._id,'user',function(err,count){
            req.session.user.msg_count = count;
            req.session.logined = true;
            return next();
        })
    } else {
        //第一次登录的时候,根据cookie生成session.
        //如果我清除了cookie,它是无法通过cookie生成session的.
        var auth_token = req.signedCookies[settings.auth_cookie_name];
        if (!auth_token) {
            return next();
        }else{
            var auth = auth_token.split('$$$$');
            var user_id = auth[0];
            //根据cookie中的ID去user表中找用户信息
            User.findOne({'_id' : user_id},function(err,user){
                if(err){
                    console.log(err)
                }else{
                    if(!user){
                        return next();
                    }
                    UserNotify.getNoReadNotifyCountByUserId(user_id,'user',function(err,count){
                        user.msg_count = count;
                        req.session.user = user;
                        req.session.logined = true;
                        return next();
                    })
                }
            })
        }
    }
};