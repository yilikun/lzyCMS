/**
 * Created by hama on 2016/12/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var CategorySchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    uid : { type: Number, default: 0 },
    name:  String,
    keywords : String,
    sortId : { type: Number, default: 1 }, // 排序 正整数
    parentID : { type: String, default: "0" },
    state : { type: String, default: "1" },  //是否公开 默认公开
    date: { type: Date, default: Date.now },
    contentTemp : { type: String, ref: "TemplateItems" }, // 内容模板
    defaultUrl : { type: String, default: "" }, // 父类别的默认目录
    homePage : { type: String, default: "ui" }, // 必须唯一
    sortPath : { type: String, default: "0" }, //存储所有父节点结构
    comments : String
});
CategorySchema.statics = {
    //根据Id查询类别信息
    getCateInfoById : function(cateId,callBack){
        Category.findOne({"_id": cateId}).populate('contentTemp').exec(function(err,doc){
            if(err){
                res.end(err);
            }else{
                callBack(doc);
            }
        })
    }
}

var Category = mongoose.model('Category',CategorySchema);
module.exports = Category;