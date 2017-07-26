var express = require("express");
var app = express();
var router = require("./controller");

//设置模板引擎
app.set("view engine", "ejs");



//路由的中间件
//中间路由
app.use(express.static("./public"));
app.use(express.static("./uploads"));

//首页
app.get("/", router.showIndex);
app.get("/:albumName", router.showAlbum);
app.get("/upload", router.showUp);
//上传图片
app.post("/upload", router.doPost);

//添加文件夹
app.get("/newfils", router.addFils);

//404
app.use( function(req,res){
	res.render("err")
});

app.listen(8181, "192.168.1.71");