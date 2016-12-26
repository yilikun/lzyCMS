/**
 * Created by hama on 2016/12/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var UserSchema = new Schema({
    _id:{
        type:String,
        unique:true,
        'default':shortid.generate
    },
    name:String,
    userName:String,
    password:String,
    email:String,
    qq:Number,
    phoneNum:Number,
    comments:{type:String,default:"这个人很懒,什么都没有留下..."},
    position:String,
    company:String,
    website:String,
    data:{type:Date,default:Date.now},
    logo:{type:String,default:"/upload/images/defaultlogo.png"},
    group:{type:String,default:"0"},
    gender:String,
    province:String,
    city:String,
    year:Number,
    openid:String,
    retrieve_time:{type:Number}
});
var User = mongoose.model('User',UserSchema);
module.exports = User;