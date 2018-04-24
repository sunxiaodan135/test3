var express = require("express");
var app = express();
//引入session的中间件，以使Express来支持session
/*
	使用步骤：
		1.下载安装
			npm i express-session --save
		2.引入
			var session = require("express-session");
		3.将其设置为中间件
			 app.use(session({
				 resave:false,
				 saveUninitialized:false,
				 secret:"hello"
			 }));
 */
var session = require("express-session");

app.use(session({
	resave:false,
	saveUninitialized:false,
	secret:"hello"
}));


//配置页面的路由
app.get("/ts",function (req , res) {

	//console.log(req.session);
	//向session中添加一个属性
	/*
		session的使用流程
			- 当第一次使用req.session时，服务器会自动创建一个全新session对象
				每一个session对象都会有一个唯一id（sessionid）
			- 当对象创建完毕以后，服务器会将sessionid以cookie的形式发送给浏览器
	 			set-cookie: connect.sid=s%3AUuHWxUt1bvr4foD7ITX4_ruSKUBG0p1Y.8GuawyCH4UeyIRRGAsqeHyrnHEGLN91duwUFu1R%2FpwY; Path=/; HttpOnly
	 		- 当浏览器收到cookie以后，会自动将cookie保存，下次访问服务器时，会将该cookie发回，
	 			服务器收到请求，会首先读取浏览器的cookie，检查cookie中是否含有connect.sid如果没有，则重复第一步，
	 				如果有，则会自动根据cookie值，去服务器中寻找session对象，并返回
	 */
	req.session.username = "孙悟空";

	res.send("testSession路由返回的内容");
});

app.get("/ts2",function (req , res) {



	res.send("testSession2"+　req.session.username);

});


app.listen(3000 , function () {
	console.log("ok");
});