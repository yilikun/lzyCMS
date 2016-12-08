/**
 * Created by hama on 2016/12/8.
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;


var FilesSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:  String,
    size : String, //别名
    date: { type: Date, default: Date.now },
    comments : String
});

var Files = mongoose.model("Files",FilesSchema);

module.exports = Files;