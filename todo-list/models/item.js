/*
	用来定义Student的模型
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var itemSchema = new Schema({
    title:String,
    state:{
        type:Number,
        default:0  //0 表示未完成 1 表示完成   2表示删除
    },
    userId:Schema.Types.ObjectId
});

//定义模型
module.exports = mongoose.model("item",itemSchema);