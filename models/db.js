/**
 * Created by hama on 2016/11/18.
 */
//所有的数据库操作公共方法都会放在这里

//引入url模块
var url = require('url');
//引入加密模块
var crypto = require('crypto');
//引入mongoose模块
var mongoose = require('mongoose');
//引入short-id模块
var shortid = require('short-id');
//引入数据库配置文件
var settings = require('./db/settings')
//引入mongoose配置文件

//链接数据库开始
var db = mongoose.connect(settings.URL);
//mongoose.connect('mongodb://localhost:27017')


var DbSet = {
    //通用的信息删除操作
    del:function(obj,req,res,logMsg){

    }
}
//暴露给全局的使用.
module.export = DbSet;
