/**
 * Created by hama on 2016/11/18.
 */
//所有的数据库操作公共方法都会放在这里

//引入url模块
var url = require('url');
//引入加密模块
var crypto = require('crypto');
//引入short-id模块
var shortid = require('shortid');
//引入数据库配置文件
var mongoose = require('mongoose');
var settings = require('./db/settings');
//引入mongoose配置文件
//感觉这里不太需要
//链接数据库开始
var db = mongoose.connect(settings.URL);
//mongoose.connect('mongodb://localhost:27017')


var DbSet = {
    //通用的信息删除操作
    del:function(obj,req,res,logMsg){
        var params  = url.parse(req.url,true);
        var targetId = params.query.uid;
        if(shortid.isValid(targetId)){
            obj.remove({_id:targetId},function(err,result){
                if(err){
                    res.end(err);
                }else{
                    console.log(logMsg + 'success');
                    res.end('success');
                }
            })
        }else{
            res.end('非法参数');
        }
    },
    //通用的查询所有的操作
    findAll:function(obj,req,res,logMsg){
        obj.find({},function(err,result){
            if(err){
                res.next(err);
            }else{
                console.log(logMsg+'success');
                return res.json(result);
            }
        })
    },
    //通用的查询一条数据的操作
    findOne:function(obj,req,res,logMsg){
        var params = url.parse(req.url,true);
        var targetId = params.query.uid;
        if(shortid.isValid(targetId)){
            obj.findOne({_id:targetId},function(err,result){
                if(err){
                    res.next(err);
                }else{
                    console.log(logMsg+'success');
                    return res.json(result);
                }
            })
        }
    },
    //通用的更新一条数据的操作
    updateOneByID:function(obj,req,res,logMsg){
        var params = url.parse(req.url,true);
        var targetId = params.query.uid;
        if(shortid.isValid(targetId)){
            var coditions = {_id:targetId};
            req.body.updateDate = new Date();
            var update = {$set:req.body};
            obj.update(coditions,update,function(err,result){
                if(err){
                    res.end(err);
                }else{
                    console.log(logMsg+'success');
                    res.end('success');
                }
            })
        }else{
            res.end("非法参数");
        }
    },
    //通用的新增一条数据的操作
    addOne:function(obj,req,res){
        var newObj = new obj(req.body);
        newObj.save(function(err){
            if(err){
                res.end(err);
            }else{
                res.end('success');
            }
        })
    },
    //分页
    pagination:function(obj,req,res,conditions){
        var params = url.parse(req.url,true);
        //从第几条开始, 当前的页数-1 * 每页多少条 + 1
        var startNum = (params.query.currentPage - 1)*params.query.limit + 1;
        //当前第几页
        var currentPage = Number(params.query.currentPage);
        //每页的条数
        var limit = Number(params.query.limit);
        var pageInfo;
        //根据条件查询下
        var query;
        if(conditions && conditions.length > 1){
            query = obj.find().or(conditions)
        }else if(conditions){
            query = obj.find(conditions);
        }else{
            query = obj.find({})
        }
        query.sort({'date':-1});

        //先省略
        query.exec(function(err,docs){
            if(err){
                console.log(err);
            }else{
                pageInfo = {
                    "totalItems":docs.length,
                    "currentPage":currentPage,
                    "limit":limit,
                    "startNum":Number(startNum)
                };
                return res.json({
                    docs : docs.slice(startNum - 1,startNum + limit -1),
                    pageInfo : pageInfo
                })
            }
        })
    },
    //搜索关键词，带分页，filed为指定的字段
    getPaginationResult:function(obj,req,res,q,filed){
        var searchKey = req.query.searchKey;
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.limit);
        //默认是第一页
        if(!page) page = 1;
        //默认每一页15条
        if(!limit) limit = 15;
        var order  = req.query.order;
        var sq = {},Str,A='problemID',B='asc';
        //是否有排序的请求
        if(order){
            Str = order.split('_');
            A = Str[0];B=Str[1];
            sq[A] = B; //关联数组增加查询条件
        }else{
            sq.data = -1;//默认的排序查询条件
        }
        var startNum = (page-1)*limit;
        var resultList;
        var resultNum;
        if(q && q.length > 1){
            //多条件只要其中一条符合就可以
            resultList = obj.find({'state':true}).or(q,filed).sort(sq).skip(startNum).limit(limit);
            resultNum = obj.find({'state':true}).or(q,filed).count();
        }else{
            resultList = obj.find(q,filed).sort(sq).skip(startNum).limit(limit);
            resultNum = obj.find(q,filed).count();
        }
        //分页参数
        var pageInfo = {
            "totalItems":resultNum,
            "currentPage":page,
            "limit":limit,
            "startNum":startNum + 1,
            "searchKey":searchKey
        };
        return {
            docs:resultList,
            pageInfo:pageInfo
        }

    },
    //不带分页的查询结果
    getDatasByParam:function(obj,req,res,q){
        var order = req.query.order;
        var limit = parseInt(req.query.limit);
        var sq = {}, Str, A = 'problemID', B = 'asc';
        if (order) {    //是否有排序请求
            Str = order.split('_');
            A = Str[0]; B = Str[1];
            sq[A] = B;    //关联数组增加查询条件，更加灵活，因为A是变量
        } else {
            sq.date = -1;    //默认排序查询条件
        }
        if(!limit){
            return obj.find(q).sort(sq);
        }else{
            return obj.find(q).sort(sq).skip(0).limit(limit);
        }

    },
    getKeyArrByTokenId : function(tokenId){
        var newLink = DbSet.decrypt(tokenId,'lzy');
        var keyArr = newLink.split('$');
        return keyArr;
    },
    getCount : function(obj,req,res,conditions){ // 查询指定对象的数量
        obj.count(conditions, function (err, count) {
            if (err){
                console.log(err);
            }else{
                return res.json({
                    count : count
                });
            }

        });
    },
    encrypt : function(data,key){ // 密码加密
        var cipher = crypto.createCipher("bf",key);
        var newPsd = "";
        newPsd += cipher.update(data,"utf8","hex");
        newPsd += cipher.final("hex");
        return newPsd;
    },
    decrypt : function(data,key){ //密码解密
        var decipher = crypto.createDecipher("bf",key);
        var oldPsd = "";
        oldPsd += decipher.update(data,"hex","utf8");
        oldPsd += decipher.final("utf8");
        return oldPsd;
    }


}
//暴露给全局的使用.
module.exports = DbSet;
