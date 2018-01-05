/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();
var formidable=require("formidable");
var fs=require("fs");
var fss=require("fs-extra");

var imageService = require('../services/imageManagerService');
var utils = require('../../../common/core/utils/app_utils');

//pageList分页查询的Controller
router.route('/develop/im/pageList').get(function(req,res){
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    imageService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});


/**
 * 查询项目版本数据
 */
router.route('/develop/im/verList').get(function(req,res){
    // 分页条件
    var imageCode = req.query.imageCode;

    var conditionMap = {};
    if(imageCode){
        conditionMap.imageCode = imageCode;
    }
    // 调用查询
    imageService.versionList(conditionMap,function(results){
        utils.respJsonData(res, results);
    });
});


/**
 * 创建项目 更新项目都是用此接口
 */
router.route('/develop/im/add').post(function(req,res) {
    var currentUserNo = req.session.current_user.user_no;
    var imageCode = '';
    var imageResource = '';
    var imageName = ''
    var channels = '';
    var pictureName = "";
    var pictureNames = "";
    var pictureType = '';
    var picture = '';
    var appPicture='';
    var simpleIntroduction = '';
    var detailIntroduction = '';
    var catagory = '';
    var updateBy = req.session.current_user.login_account;

    var data_map = [];//新增Map 存到另外一张表的数据专用数组
    var data_add = [];//新增 info表数据
    var data_update_pic = [];//更新info表带有图标图片和应用截图数据的更新
    var data_update = [];//更新info表不带图片的数据
    var data_update_apppic=[] ; //更新info表带有应用图片数据的更新
    var data_update_logopic = [];//更新info表带有图标图片数据的更新
    var form = new formidable.IncomingForm();
    var path = "";
    var buf = "";
    var bufs="";
    var sqlUpdatePicture = "update pass_develop_image_info set imageResource = ?,imageName = ?,channels = ?,pictureName=?,pictureType = ?,picture=?,appPicture=?,pictureNames=?," +
        "simpleIntroduction=?,detailIntroduction=?,catagory=?,updateBy=?,updateDate=now() where imageCode = ?";
    var sqlUpdate = 'update pass_develop_image_info set imageResource = ?,imageName = ?,channels = ?,simpleIntroduction = ?,detailIntroduction=?,catagory=?,updateBy=?' +
        ',updateDate = now() where imageCode = ?';
    var sqlUpateAppPicture='update pass_develop_image_info set appPicture=?,pictureNames=?,imageResource = ?,imageName = ?,channels = ?,simpleIntroduction = ?,detailIntroduction=?,catagory=?,updateBy=?' +
        ',updateDate = now() where imageCode = ?';
    var sqlUpdatelogoPicture="update pass_develop_image_info set imageResource = ?,imageName = ?,channels = ?,pictureName=?,pictureType = ?,picture=?," +
        "simpleIntroduction=?,detailIntroduction=?,catagory=?,updateBy=?,updateDate=now() where imageCode = ?";
    form.parse(req, function (error, fields, files) {
        if (error) {
            return console.log(error);
        } else {
            pictureName = files.picture.name;
            pictureType = files.picture.type;
            path = files.picture.path;
            if(pictureName !=''){
                picture = fs.readFileSync(path);
            }
            // pictureNames=files.appPicture.name;
            // paths = files.appPicture.path;
            // appPicture=fs.readFileSync(paths);
            buf = new Buffer(picture);
            bufs=new Buffer(appPicture);
            picture = buf.toString("base64");
            appPicture=bufs.toString("base64");
            console.log(pictureName);
            console.log("apppppppppppppppppp"+appPicture);
            imageResource = fields.imageResource;
            imageCode = fields.imageCode;
            imageName = fields.imageName;
            channels = fields.channels;
            simpleIntroduction = fields.simpleIntroduction;
            detailIntroduction = fields.detailIntroduction;
            catagory = fields.catagory;

            if (imageCode) {
                //更新 用imageCode判断是否需要更新
                if (pictureName&&pictureNames) {//图标截图都更新
                    data_update_pic.push(imageResource);
                    data_update_pic.push(imageName);
                    data_update_pic.push(channels);
                    data_update_pic.push(pictureName);
                    data_update_pic.push(pictureType);
                    data_update_pic.push(picture);
                    data_update_pic.push(appPicture);
                    data_update_pic.push(pictureNames);
                    data_update_pic.push(simpleIntroduction);
                    data_update_pic.push(detailIntroduction);
                    data_update_pic.push(catagory);
                    data_update_pic.push(updateBy);
                    data_update_pic.push(imageCode);
                    imageService.update(sqlUpdatePicture, data_update_pic, function (result) {
                        utils.respJsonData(res, result);
                    });
                }else if(pictureNames){//更新截图
                    data_update_apppic.push(appPicture);
                    data_update_apppic.push(pictureNames);
                    data_update_apppic.push(imageResource);
                    data_update_apppic.push(imageName);
                    data_update_apppic.push(channels);
                    data_update_apppic.push(simpleIntroduction);
                    data_update_apppic.push(detailIntroduction);
                    data_update_apppic.push(catagory);
                    data_update_apppic.push(updateBy);
                    data_update_apppic.push(imageCode);
                    imageService.update(sqlUpateAppPicture, data_update_apppic, function (result) {
                        utils.respJsonData(res, result);
                    });
                }else if(pictureName) {//更新图标
                    data_update_logopic.push(imageResource);
                    data_update_logopic.push(imageName);
                    data_update_logopic.push(channels);
                    data_update_logopic.push(pictureName);
                    data_update_logopic.push(pictureType);
                    data_update_logopic.push(picture);
                    data_update_logopic.push(simpleIntroduction);
                    data_update_logopic.push(detailIntroduction);
                    data_update_logopic.push(catagory);
                    data_update_logopic.push(updateBy);
                    data_update_logopic.push(imageCode);
                    imageService.update(sqlUpdatelogoPicture, data_update_logopic, function (result) {
                        utils.respJsonData(res, result);
                    });
                }
                else {
                    data_update.push(imageResource);
                    data_update.push(imageName);
                    data_update.push(channels);
                    data_update.push(simpleIntroduction);
                    data_update.push(detailIntroduction);
                    data_update.push(catagory);
                    data_update.push(updateBy);
                    data_update.push(imageCode);
                    imageService.update(sqlUpdate, data_update, function (result) {
                        utils.respJsonData(res, result);
                    });
                }
            } else {
                //新增
                data_map.push(currentUserNo);

                data_add.push(imageResource);
                data_add.push(imageName);
                data_add.push(channels);
                data_add.push(pictureName);
                data_add.push(pictureType);
                data_add.push(picture);
                data_add.push(appPicture);
                data_add.push(simpleIntroduction);
                data_add.push(detailIntroduction);
                data_add.push(catagory);
                imageService.add(data_add, data_map, function (result) {
                    utils.respJsonData(res, result);
                });
            }

        }


    });

})

//
    router.route('/develop/im/:id').delete(function(req,res) {
        // 获取提交信息
        var id = req.params.id;
        imageService.delete(id, function(result) {
            utils.respJsonData(res, result);
        });
    });

////获取图片
//router.route('/develop/im/base64Pic').post(function (req, res) {
//
//    var filedir = 'public/static/images/image_information/';
//    fss.ensureDir(filedir, function (err) { //改变上传文件夹的方法fs.ensureDir
//        if (err) {
//            console.log('ensureDir error')
//            res.send('no ensuredir');
//        }
//        console.log("s达到s","ss");
//        var name ='';
//        var path = '';
//        var picture = '';
//        var buf = '';
//        var form = new formidable.IncomingForm();
//        var result = '';
//        form.parse(req, function (error, fields, files) {
//            console.log("呜呜呜",files);
//
//            if (error) {
//                return console.log(error);
//            } else {
//
//                name=files['editormd-image-file'].name;
//                path=filedir+name;
//                //path = files['editormd-image-file'].path;
//                //picture = fs.readFileSync(path);
//                //buf = new Buffer(picture);
//                //picture = buf.toString("base64");
//                fss.rename(files['editormd-image-file'].path,path,function(err){
//                    if(err){
//                        res.send('no rename');
//                    }else{
//                        //并且存入数据库作为删除的备份
//
//                        result = {
//                            'success' : 1,
//                            'message': 'success',
//                            'url': path
//                        };
//                        res.send(result);
//
//                    }
//                });
//
//            }
//        });
//
//    });
//});
//获取图片
router.route('/develop/im/base64Pic').post(function (req, res) {

    var filedir = 'public/static/images/image_information/';
    fss.ensureDir(filedir, function (err) { //改变上传文件夹的方法fs.ensureDir
        if (err) {
            console.log('ensureDir error');
            res.send('no ensuredir');
        }
        var name ='';
        var path = '';
        var form = new formidable.IncomingForm();
        var result = '';
        form.parse(req, function (error, fields, files) {
            if (error) {
                throw err;
            } else {
                name=files['editormd-image-file'].name;
                path=filedir+name;
                var readStream=fs.createReadStream(files['editormd-image-file'].path);
                var writeStream=fs.createWriteStream(path);
                readStream.pipe(writeStream);
                res.send({'success' : 1,'message': 'success','url': '/project' + path.substr(6,path.length)});
            }
        });
    });
});


    module.exports = router;