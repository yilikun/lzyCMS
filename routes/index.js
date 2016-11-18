var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
    //这里，应该让用户能够顺利的访问到首页的静态页面
    //同时，将数据展示在首页上.
    res.render('web/index');
})

module.exports = router;
