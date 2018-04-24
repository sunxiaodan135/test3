//引入express
var express = require("express");
//连接MongoDB数据库
require("./tools/conn_mongo");
//引入router
var router = require("./routers/router");

var bodyParser = require("body-parser");


//引入session
var session=require("express-session");

var mongoose=require("mongoose");
//获取app对象
var MongoStore=require("connect-mongo")(session);

var app = express();

//在app中放置一个空的msg对象
app.locals.msg = {};

//设置模板引擎
app.set("view engine" , "ejs");
//设置保存模板的目录
app.set("views" , "./views");



//配置静态资源
app.use(express.static("public"));

//引入bodyParser
app.use(bodyParser.urlencoded({extended:false}));


app.use(session({
	resave:false,
	saveUninitialized:false,
	secret:"atguigu",
	store:new MongoStore({mongooseConnection:mongoose.connection})

}));

//将session放入到res的session，所有的ejs网页都可以访问到session
app.use(function (req,res,next) {
	res.locals.session=req.session;
	next();
})
//配置路由
app.use(router);



//在最后，添加一个中间件
app.use(function (req , res) {
	//一旦进入该路由，则证明路径错误
	res.status(404);
	res.render("404.ejs");
});


//监听3000端口，并启动服务器
app.listen(3000,function () {
	console.log("服务器已经启动~~~~");
});
