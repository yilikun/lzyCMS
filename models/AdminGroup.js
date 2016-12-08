/**
 * Created by hama on 2016/12/8.
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;


var AdminGroupSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    name:  String,
    power : String,
    date: { type: Date, default: Date.now },
    comments : String
});


var AdminGroup = mongoose.model("AdminGroup",AdminGroupSchema);

module.exports = AdminGroup;