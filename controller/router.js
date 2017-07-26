var file = require("../modular/file.js");

//引入formidable 插件
var formidable = require('formidable');

var path = require("path");
var fs = require("fs");

//时间戳插件
var sd = require('silly-datetime');

//首页渲染
exports.showIndex = function(req, res, next) {
	file.getAllablums(function(err, allAblums) {

		//返回错误信息
		if(err) {
			next();
			return;
		}
		//加载数据
		res.render("index", {
			"ablums": allAblums,
		});
	})
}

exports.showAlbum = function(req, res, next) {
	var imgesName = req.params.albumName;
	file.getAlimgName(imgesName, function(err, allImgName) {
		//返回错误信息
		if(err) {
			next();
			return;
		}
		res.render("details", {
			"imgName": imgesName,
			"allImgName": allImgName
		});
	})
}

//上传页面 渲染
exports.showUp = function(req, res) {

	//命令file模块(自己写的方法) 调用getAllablums方法
	//得到所有文件夹名字(allAblums) 之后的事情 卸载回调函数里面

	file.getAllablums(function(err, allAblums) {
		res.render("upload", {
			"ablums": allAblums,
		});
	})
}

//上传表单
exports.doPost = function(req, res, next) {
	// 文件上传
	var form = new formidable.IncomingForm();

	//	tempup 临时缓存文件夹
	form.uploadDir = path.normalize(__dirname + "/../tempup/");

	form.parse(req, function(err, fields, files) {
		if(err) {
			res.send("请上传失败！");
			return;
		}
		//		判断文件类型
		var type = files.h_flie.type;
		type = type.split("/")
		if(type[0] != "image") {
			res.send("请上传图片格式文件");
			fs.unlink(files.h_flie.path, function(err) {
				if(err) {
					console.log("删除失败！");
				}
			})
			return;
		}
		//判断文件尺寸
		var size = files.h_flie.size;
		if(size > 2097152) {
			res.send("图片尺寸不能大于2M");
			fs.unlink(files.h_flie.path, function(err) {
				if(err) {
					console.log("删除失败！");
				}
			})
			return;
		}

		//选中的文件夹名字
		var hfolder = fields.h_folder;

		//文字名字
		//		当前时间戳
		var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
		//		随机数
		var ran = parseInt(Math.random() * 8999 + 10000);
		//		后缀名字
		var extname = path.extname(files.h_flie.name);
		//旧文件地址
		var oldpath = files.h_flie.path;
		//新文件地址+文件名
		var newpath = path.normalize(__dirname + "/../uploads/" + hfolder + "/" + ttt + ran + extname);

		fs.rename(oldpath, newpath, function(err) {
			if(err) {
				res.send("文件改名失败");
				return;
			}
			res.send("成功")
		})

	});

	return;

}

//新增文件夹
exports.addFils = function(req, res) {
	//通过前台ajax 传入到后台的文件夹名称
	var filename = req.query.name;
	console.log(filename)
	fs.mkdir("./uploads/" + filename, function(err) {
		if(err) {
			res.send("文件创建失败");
			return;
		}
		console.log("文件创建成功。");

		var shuju = [{
			"id": "1",
			"name": filename
		}]

		res.json(shuju);
	});
}