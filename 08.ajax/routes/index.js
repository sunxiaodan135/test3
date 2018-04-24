var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//添加一个get路由，用来接收ajax请求
router.get("/ " , function (req , res) {
    console.log("报告！我已经收到请求~~~");

    var username = req.query.username;
    var password = req.query.password;

    console.log(username , password);

    //返回一个响应
    res.send("这是服务器返回的响应");
});


router.post("/testAJAX" , function (req , res) {
    console.log("post请求");

    var username = req.body.username;
    var password = req.body.password;

    console.log(username , password);

    //返回一个响应
    res.send("post返回的响应");
});

router.get("/testAJAX2" , function (req, res) {

    /*
        需要向ajax请求返回一个学生对象，对象含有如下属性
            name age gender address

        1.以XML的格式将数据返回
            <student><name>孙悟空</name><age>18</age><gender>男</gender><address>花果山</address></student>
            - 当我已xml的格式发送数据时，必须设置一个响应头，告诉客户端响应体是一个xml
                Content-type : application/xml

        2.以JSON的格式将数据返回
            {"name":"孙悟空","age":18,"gender":"男","address":"花果山"}
     */
    res.set("Content-type","application/xml");

    res.send("<student><name>孙悟空</name><age>18</age><gender>男</gender><address>花果山</address></student>");
});

router.get("/testAJAX3",function(req , res){
    //res.send('{"name":"孙悟空","age":18,"gender":"男","address":"花果山"}');

    var obj = {
        name:"孙悟空",
        age:28,
        gender:"男",
        address:"花果山"
    };

    //当使用res.send()直接发送一个js对象作为响应时，它会自动将对象转换为JSON发送
    res.send(obj);

});

module.exports = router;
