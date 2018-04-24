/*
	用来定义Student的模型
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
	username:{
		type:String,
		unique:true
	},
	password:String,
	email:String
});

//定义模型
module.exports = mongoose.model("user",userSchema);