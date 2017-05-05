/**
 * Created by hama on 2016/12/8.
 */

//后台业务逻辑集合


var url  = require('url');
var settings = require('./settings');
//数据库操作对象
var DBSet = require('../db');
//管理员
var AdminUser = require('../AdminUser');
//用户组
var AdminGroup = require('../AdminGroup');
//文章
var Article = require('../Article');
//分类
var Category = require('../Category');
//标签
var Tag = require('../Tag');
//留言
var Message = require('../Message');
//前台用户
var User = require('../User');
//文件
var Files = require('../Files');
//消息详情
var Notify = require('../Notify');
//消息
var UserNotify = require('../UserNotify');

//工具
var shortid =require('shortid');
var validator = require('validator');
var system = require('../../util/system');
var request = require('request');

var adminFunc = {
    getAdminNotices:function(req,res,callback){
        //在消息表中找到对应的管理员的消息.并且是未读状态的.
        UserNotify.find({'systemUser':req.session.adminUserInfo._id,'isRead':false})
            .populate('user').populate('notify').exec(function(err,docs){
                if(err){
                    res.end(err);
                }else{
                    var regNoticeArr = [];
                    var msgNoticeArr = [];
                    if(docs.length > 0){
                        for(var i=0;i<docs.length;i++){
                            var item = docs[i];
                            if(item.notify && item.notify.action == 'reg'){
                                regNoticeArr.push(item)
                            }else if(item.notify && item.notify.action == 'msg'){
                                msgNoticeArr.push(item)
                            }
                        }
                    };
                    var noticeObj = {
                        regNotices : regNoticeArr,
                        msgNotices : msgNoticeArr,
                        totalCount : regNoticeArr.length + msgNoticeArr.length
                    };
                    callback(noticeObj);
                }
            })

    },
    //通过后台栏目的名称，找到对应要查询的表名
    getTargetObj :function(currentPage){
        var targetObj ;
        if(currentPage === 'sysTemManage_user'){
            targetObj = AdminUser;
        }else if(currentPage === 'sysTemManage_uGroup'){
            targetObj = AdminGroup;
        }else if(currentPage === 'contentManage_content'){
            targetObj = Article;
        }else if(currentPage === 'contentManage_cateGory'){
            targetObj = Category;
        }else if(currentPage === 'contentManage_tag'){
            targetObj = Tag;
        }else if(currentPage === 'contentManage_msg'){
            targetObj = Message;
        }else if(currentPage === 'contentManage_notice'){
            targetObj = UserNotify;
        }else if(currentPage === 'userManage_user'){
            targetObj = User;
        }else{
            targetObj = Article;
        }
        return targetObj;
    }
}


module.exports = adminFunc;