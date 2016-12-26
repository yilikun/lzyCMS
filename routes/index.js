//首页的路由
var express = require('express');
var router = express.Router();

//引入数据库操作对象
var DBSet = require('../models/db');
router.get('/',function(req,res,next){
    //这里，应该让用户能够顺利的访问到首页的静态页面
    //同时，将数据展示在首页上.
    function isLogined(req){
        return req.session.logined;
    }
     res.render('web/index',{
         title:'首页',
         logined:isLogined(req),
         userInfo:req.session.user
     });
})
module.exports = router;
