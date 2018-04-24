/*
 定义一个模块，用来连接MongoDB数据库
 */
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/todolist");
mongoose.connection.once("open",function () {
	console.log("数据库连接成功~~~");
});