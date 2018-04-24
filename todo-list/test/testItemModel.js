//连接数据库
require("../tools/conn_mongo");
//引入ItemModel
var Item = require("../models/item");

Item.create({
    title:"吃西瓜",
    userId:"59c9ba84dc2a371ae091f09c"
},function (err) {
    if(!err){
        console.log("插入成功~~~");
    }
});