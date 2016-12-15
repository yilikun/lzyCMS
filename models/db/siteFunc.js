/**
 * Created by hama on 2016/12/8.
 */

//前台业务逻辑集合
var DBSet = require('../db');
var settings = require('./settings');
var Notify = require('../../models/Notify');
var UserNotify = require('../../models/UserNotify');
var siteFunc = {
    //给注册的用户拼接邮件内容
    setNoticeToUserRegSuccess : function(obj){
        var html ='';
        html += '亲爱的 '+obj.userName+' （'+obj.email+') ，恭喜您成为 <strong>' + settings.SITETITLE + '</strong> 的新用户！ 您现在可以 <a href="'+settings.SITEDOMAIN+'/users/login" target="_blank">点击登录</a>';
        return html;
    },
    //注册好的用户直接发送给系统管理员.告知有人注册成功了.
    sendSystemNoticeByType : function(req,res,type,value){
        var noticeObj;
        if(type == 'reg'){
            noticeObj = {
                type : '2',
                systemSender : 'lzyCMS',
                title : '用户注册提醒',
                content : '新增注册用户 ' + value,
                action : type
            };
        }else if(type == 'msg'){
            noticeObj = {
                type : '2',
                sender : value.author,
                title : '用户留言提醒',
                content : '用户 ' + value.author.userName + ' 给您留言啦！',
                action : type
            };
        }
        Notify.sendSystemNotice(res,noticeObj,function(users,notify){
            UserNotify.addNotifyByUsers(res,users,notify);
        });
    },

}
module.exports = siteFunc;