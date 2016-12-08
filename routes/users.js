/**
 * Created by hama on 2016/12/8.
 */
//登录注册的路由

var express = require('express');
var router = express.Router();

//加载依赖
var url = require('url');

var returnUserRouter = function(io){
    return router;
}
module.exports = returnUserRouter;

