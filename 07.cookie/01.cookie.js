var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser());

/*
	可以使用cookie-parser来帮助解析Cookie
		步骤：
			1.下载安装
				npm i cookie-parser --save
			2.引入
				var cookieParser = require("cookie-parser");
			3.设置为中间件
				app.use(cookieParser());
 */

app.get("/testCookie",function (req , res) {

	//修改/删除用户的 username 的cookie
	//cookie一旦发送给浏览器，则我们就不能再修改，但是可以使用同名的Cookie对原有的Cookie进行替换
	//res.cookie("username","zhubajie");

	//删除cookie
	//使用有效期为0的cookie替换原来的cookie，从而删除cookie
	//res.cookie("username","zzz",{maxAge:0});

	//删除指定的cookie
	res.clearCookie("username");

	res.send("新的cookie已经发送~~~");

});

//创建一个路由，用来读取浏览器发回的Cookie
app.get("/getCookie",function (req , res) {

	//获取浏览器发送的Cookie
	//var cookie = req.get("Cookie");

	//当引入cookie-parser中间件以后，req.cookies自动变成一个对象，对象的属性是Cookie的名字 值就是cookie的值
	//我们就可以通过req.cookies 来读取Cookie了
	console.log(req.cookies.username);

	//console.log(typeof cookie);

	res.send("getCookie发回的内容~~~" +　req.cookies.username);

});


//创建一个路由
app.get("/sendCookie" , function (req , res) {

	//创建一个Cookie
	//res.cookie(name, value [, options])
	//res.cookie("username","sunwukong");
	/*res.cookie("age","18");
	res.cookie("gender","male");*/

	/*
		会话：一次打开关闭浏览器的过程
		Cookie不会永远在浏览器中保存，默认有效期是一次会话，关闭浏览器以后Cookie自动失效
	 */

	//设置一个有效期为1分钟的cookie
	//res.cookie("username","sunwukong",{maxAge:1000*60});

	//设置一个永久有效的cookie
	res.cookie("username","sunwukong",{maxAge:1000*60*60*24*365*10});


	//cookie将在响应报文发送时，一起发送给浏览器
	res.send("Cookie已经发送~~~");

});


app.listen(3000,function () {
	console.log("ok");
});
