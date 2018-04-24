var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
//设置模板引擎
app.set("view engine","ejs");
app.set("views" , "views");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));

//创建一个中间件，用来将cookie发送给页面
app.use(function (req , res , next) {
	res.locals.cookie = req.cookies;
	next();
});

//创建路由处理登录
app.post("/login",function (req , res) {

	//获取用户填写的用户名和密码
	var username = req.body.username;
	var password = req.body.password;

	//验证用户是否登录成功
	//只要密码是123123，全都登录成功
	if(password == "123123"){
		//登录成功
		//创建一个Cookie用来保存用户的用户名
		res.cookie("username",username,{maxAge:1000*60*60*24*7});

		//返回响应
		res.send("登录成功~~~");



	}else{
		//登录失败
		res.send("登录失败~~");
	}

});

//配置页面的路由
app.get("/login",function (req , res) {
	res.render("login.ejs");
});


app.listen(3000 , function () {
	console.log("ok");
});