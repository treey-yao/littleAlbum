var fs = require("fs");

//遍历文件夹名字
exports.getAllablums = function(callback) {
	fs.readdir("./uploads", function(err, files) {
		if(err) {
			callback("找不到uploads文件夹", null);
			return;
		}
		var allAblums = [];
		(function iteratir(i) {
			//			遍历结束
			if(i == files.length) {
				callback(null, allAblums);
				return;
			}

			fs.stat("./uploads/" + files[i], function(err, stats) {

				if(err) {
					callback("找不到" + files[i] + "文件夹", null)
					return;
				}

				if(stats.isDirectory()) {
					allAblums.push(files[i]);
				}
				iteratir(i + 1)
			});
		})(0);
	});
}

//遍历文件夹中文件
exports.getAlimgName = function(imgesName, callback) {
	fs.readdir("./uploads/" + imgesName, function(err, files) {
		if(err) {
			callback("找不"+imgesName+"文件夹", null);
			return;
		}
		var allimgNames = [];

		(function iteratir(i) {
			//			遍历结束
			if(i == files.length) {
				callback(null, allimgNames);
				return;
			}

			fs.stat("./uploads/" + imgesName + "/" + files[i], function(err, stats) {

				if(err) {
					callback("找不到" + files[i] + "文件夹", null)
					return;
				}

				if(stats.isFile()) {
//					判断是否为图片
					var filesname = files[i].split('.');
					if(filesname[1] == "jpg" || filesname[1] == "png" || filesname[1] == "gif") {
						allimgNames.push(files[i]);
					}
				}
				iteratir(i + 1)
			});
		})(0);

	})
}