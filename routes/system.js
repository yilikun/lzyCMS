/**
 * Created by hama on 2016/12/28.
 */
//系统功能
var express = require('express');
var router = express.Router();
//文件上传的类
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
//时间格式化
var moment = require('moment');
var gm = require('gm');
var url = require('url');
var mime = require('../util/mime').types;
var system = require('../util/system');
//站点的配置文件
var settings = require('../models/db/settings');

router.post('/upload',function(req,res,next){
    //获取传入的参数
    var params = url.parse(req.url,true);
    var fileType = params.query.type;
    var fileKey = params.query.key;
    // 初始化
    var form = new formidable.IncomingForm();
    // 设置它的上传地址
    form.uploadDir = 'public/upload/images/';
    var files = [];
    var fields = [];
    var docs = [];
    var updatePath = "public/upload/images/";
    var smallImgPath = "public/upload/smallimgs/";
    //如果从表单那里接收到的是key/value这种数据的话
    //将数据放到fields数组里面.
    form.on('field',function(field,value){
        fields.push([field,value]);
    }).on('file',function(field,file){
        //如果接受到的是文件的话
        files.push([field,file]);
        docs.push(file);
        //校验文件的合法性
        var realFileType = system.getFileMimeType(file.path);
        var contentType  = mime[realFileType.fileType] || 'unknown';
        if(contentType == 'unknown'){
            res.end('typeError');
        }

        var typeKey = "others";
        var thisType = file.name.split('.')[1];
        var date = new Date();
        var ms = moment(date).format('YYYYMMDDHHmmss').toString();

        if(fileType == 'images'){
            typeKey = "img"
        }
        newFileName = typeKey + ms + "."+thisType;

        if(fileType == 'images'){
            if(realFileType.fileType == 'jpg' || realFileType.fileType == 'jpeg' || realFileType.fileType == 'png'  || realFileType.fileType == 'gif'){
                if(settings.imgZip){
                    fs.rename(file.path,updatePath + newFileName,function(err){
                        if(err){
                            console.log(err)
                        }else{
                            // 图片缩放
                            var input =  updatePath + newFileName;
                            var out = smallImgPath + newFileName;

                            if(fileKey == 'ctTopImg'){
                                gm(input).resize(270,162,'!').autoOrient().write(out, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('done');
                                    }
                                });
                            }else if(fileKey == 'plugTopImg'){ // 插件主题图片
                                gm(input).resize(270,162,'!').autoOrient().write(out, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('done');
                                    }
                                });
                            }else if(fileKey == 'userlogo'){ // 用户头像
                                gm(input).resize(100,100,'!').autoOrient().write(out, function (err) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('done');
                                    }
                                });
                            }
                        }
                    })
                }else{
                    fs.rename(file.path,updatePath + newFileName,function(err){
                        if(err){
                            console.log(err)
                        }
                    })
                }
            }else{
                res.end('typeError');
            }
        }
    }).on('end',function(){
        // 返回文件路径
        if(settings.imgZip && (fileKey == 'ctTopImg' || fileKey == 'plugTopImg' || fileKey == 'userlogo')){
            res.end('/upload/smallimgs/'+newFileName);
        }else{
            res.end('/upload/images/'+newFileName);
        }

    })
    //该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);
        console.log('parsing done');
    });






})
module.exports = router;