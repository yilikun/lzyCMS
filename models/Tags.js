/**
 * Created by hama on 2016/12/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var TagsSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:  String,
    alias : String, //别名
    date: { type: Date, default: Date.now },
    comments : String
});
var Tags = mongoose.model('Tags',TagsSchema);
module.exports = Tags;
