//引入express
var express = require("express");
//引入UserModel
var User = require("../models/user");
//引入sha1
var sha1 = require("sha1");
//引入ItemModel
var Item = require("../models/item");


//创建一个router
var router = express.Router();


//设置3个ejs的路由
router.get("/" , function (req , res) {
    //重定向到item_list
    res.redirect("/item_list");
});

router.get("/login",function (req , res) {
    //渲染页面
    res.render("login.ejs");
});

router.get("/register",function (req , res) {
    //渲染页面
    res.render("register.ejs");
});

//用来检查用户是否登录
function checkLogin (req , res , next) {
    if(req.session.loginUser){
        //如果有，则表示用户已经登录
        next();
    }else{
        //没有loginUser，用户没有登录，跳转到登录页面
        res.render("login.ejs",{msg:{err:"请登录后再访问！"}});
    }

}

router.get("/item_list",checkLogin,function (req , res) {

    //该页面如果用户没有登录，则不能访问，检查用户是否登录
    /*if(req.session.loginUser){
        //如果有，则表示用户已经登录
        //渲染页面
        res.render("item_list.ejs");
    }else{
        //没有loginUser，用户没有登录，跳转到登录页面
        res.render("login.ejs",{msg:{err:"请登录后再访问！"}});
    }*/

    //console.log(req.session.loginUser);

    //获取用户的id
    var userId = req.session.loginUser._id;
    //根据用户的id去数据库中查询待办事项
    Item.find({userId:userId , state:{$ne:2}} , function (err , items) {
        res.render("item_list.ejs",{items:items});
    });



});


//创建一个路由，用来检查用户名是否可用
router.get("/checkUsername",function (req , res) {
    //获取用户的用户名
    var username = req.query.username;

    //检查用户名是否可用
    User.findOne({username:username} , function (err , doc) {
        if(doc){
            //如果doc存在，证明用户名已被占用，用户名不能使用
            res.send({status:"error"});

        }else{
            //doc不存在，用户名可用
            res.send({status:"ok"});
        }
    });

});
//添加一个路由，用来修改待办事项的title
router.post("/updateTitle",checkLogin,function (req , res) {

    //获取要修改的事项的id
    var itemId = req.body.itemId;

    //console.log(itemId);

    //获取要修改的事项的title
    var title = req.body.title;

    //获取当前用户的userId
    var userId = req.session.loginUser._id;

    //调用ItemModel修改数据库
    Item.updateOne({_id:itemId , userId:userId} , {$set:{title:title , state:0}} , function () {
        //插入完成，跳转到item_list
        res.redirect("/item_list");
    });


});

//添加一个路由，修改待办事项的状态
router.get("/updateState" , checkLogin , function (req , res) {

    //获取要修改的事项的id
    var itemId = req.query.itemId;

    //获取要修改为的状态
    var state = req.query.state;

    //获取当前用户的id
    var userId = req.session.loginUser._id;

    //调用模型操作数据库
    Item.updateOne({_id:itemId , userId:userId} , {$set:{state:state}} , function () {
        //插入完成，跳转到item_list
        res.redirect("/item_list");
    });

});



//创建一个路由，用来添加待办事项
router.post("/addItem" , checkLogin , function (req , res) {

    //获取待办事项的内容
    var title = req.body.title;
    //获取用户的id
    var userId = req.session.loginUser._id;

    //将待办事项插入进数据库
    Item.create({
        title:title,
        userId:userId
    },function (err) {
        //插入完成，跳转到item_list
        res.redirect("/item_list");
    });

});

//创建一个路由处理用户的登出
router.get("/logout",function (req , res) {

    //删除session中存储的用户信息
    delete req.session.loginUser;

    //重定向到登录页面
    res.redirect("/login");

});

//创建一个路由来处理用户的登录
router.post("/login",function (req , res) {

    //获取用户的信息
    var username = req.body.username.trim();
    var password = req.body.password.trim();

    //创建一个对象，用来保存错误消息
    var msg = {username:username};

    //验证用户名和密码是否正确
    User.findOne({username:username},function (err , user) {

        //判断用户是否登录成功
        if(!err && user && user.password == sha1(password)){

            //将user转换为普通对象
            user = user.toObject();

            //password字段不应该放入到session中，需要将其删除
            delete user.password;

            //console.log(user);

            //登录成功，需要将用户的信息保存到session中
            //console.log(req.session);
            req.session.loginUser = user;

            //登录成功，跳转到item_list
            res.redirect("/item_list")
        }else{
            //登录失败
            //设置错误消息
            msg.err = "用户名或密码错误，请重新输入";

            res.render("login.ejs",{msg:msg});
        }

    });

});


//创建一个处理用户注册的路由
router.post("/register" , function (req , res) {

    //获取用户填写的请求username password repwd email
    var username = req.body.username.trim();
    var password = req.body.password.trim();
    var repwd = req.body.repwd.trim();
    var email = req.body.email.trim();

    //创建一个msg对象
    var msg = {
        username:username,
        email:email
    };


    //res.send(username + " , "+password + " , "+repwd + " , "+email);
    //验证用户输入的内容是否合法
    //创建三个正则表达式
    var nameReg = /^[a-z0-9_-]{3,16}$/i;
    var pwdReg = /^[a-z0-9_-]{6,18}$/i;
    var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;

    //验证用户名是否合法
    if(!nameReg.test(username)){
        //进入判断证明用户名不符合规范，向msg中设置错误消息
        msg.nameErr = "请输入一个3-16位，可以含有数字、字母、_、-的用户名";
    }

    //验证密码是否合法
    if(!pwdReg.test(password)){
        //进入判断证明用户名不符合规范，向msg中设置错误消息
        msg.pwdErr = "请输入一个6-18位，可以含有数字、字母、_、-的密码";
    }

    //验证确认密码
    if(repwd != password){
        msg.repwdErr = "两次输入的密码不一致";
    }

    //验证电子邮件
    if(!emailReg.test(email)){
        msg.emailErr = "电子邮件的格式不正确";
    }

    //判断验证是否通过
    if(msg.nameErr || msg.pwdErr || msg.repwdErr || msg.emailErr){
        //渲染页面，并传递错误消息
        res.render("register.ejs",{msg:msg});
        //没有通过验证，则不继续向下执行
        return;
    }



    //验证通过，将用户信息插入进数据库
    User.create({
        username:username,
        password:sha1(password),
        email:email
    },function (err) {
        if(!err){
            //用户注册成功，重定向到登录页面
            res.redirect("/login");
        }else{
            //注册失败，返回注册页面
            //res.redirect("/register");
            msg.err = "用户名已存在";
            res.render("register.ejs",{msg:msg});
        }
    });

});



//将router暴露
module.exports = router;
