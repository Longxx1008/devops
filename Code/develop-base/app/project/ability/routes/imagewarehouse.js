/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();
var formidable=require("formidable");
var fs=require("fs");

var imageService = require('../services/imagewarehouseService');
var utils = require('../../../common/core/utils/app_utils');

//pageList分页查询的Controller
router.route('/develop/im/pageList').get(function(req,res){
    console.log("进入了imagewarehouse 的查询页面")
    var page = req.query.page;
    var length = req.query.rows;
    var flag = req.query.flag;
    var type = req.query.type;
    var conditionMap = {};
    if(flag){
        conditionMap.flag = flag;
    }
    if(type){
        conditionMap.type = type;
    }
    var currentUser = utils.getCurrentUser(req);
    conditionMap.loginUser = currentUser.login_account;

    imageService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
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
    var pictureType = '';
    var picture = '';
    var simpleIntroduction = '';
    var catagory = '';
    var updateBy = req.session.current_user.login_account;

    var data_map = [];//新增Map 存到另外一张表的数据专用数组
    var data_add = [];//新增 info表数据
    var data_update_pic = [];//更新info表带有图片数据的更新
    var data_update = [];//更新info表不带图片的数据

    var form = new formidable.IncomingForm();
    var path = "";
    var buf = "";
    var sqlUpdatePicture = "update pass_develop_image_info set imageResource = ?,imageName = ?,channels = ?,pictureName=?,pictureType = ?,picture=?," +
        "simpleIntroduction=?,catagory=?,updateBy=?,updateDate=now() where imageCode = ?";
    var sqlUpdate = 'update pass_develop_image_info set imageResource = ?,imageName = ?,channels = ?,simpleIntroduction = ?,catagory=?,updateBy=?' +
        ',updateDate = now() where imageCode = ?';
    form.parse(req, function (error, fields, files) {
        if (error) {
            return console.log(error);
        } else {
            pictureName = files.picture.name;
            pictureType = files.picture.type;
            path = files.picture.path;
            picture = fs.readFileSync(path);
            buf = new Buffer(picture);
            picture = buf.toString("base64");
            imageResource = fields.imageResource;
            imageCode = fields.imageCode;
            imageName = fields.imageName;
            channels = fields.channels;
            simpleIntroduction = fields.simpleIntroduction;
            catagory = fields.catagory;
            if (imageCode) {
                //更新 用imageCode判断是否需要更新
                if (pictureName) {
                    data_update_pic.push(imageResource);
                    data_update_pic.push(imageName);
                    data_update_pic.push(channels);
                    data_update_pic.push(pictureName);
                    data_update_pic.push(pictureType);
                    data_update_pic.push(picture);
                    data_update_pic.push(simpleIntroduction);
                    data_update_pic.push(catagory);
                    data_update_pic.push(updateBy);
                    data_update_pic.push(imageCode);
                    imageService.update(sqlUpdatePicture, data_update_pic, function (result) {
                        utils.respJsonData(res, result);
                    });
                } else {
                    data_update.push(imageResource);
                    data_update.push(imageName);
                    data_update.push(channels);
                    data_update.push(simpleIntroduction);
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
                data_add.push(simpleIntroduction);
                data_add.push(catagory);
                imageService.add(data_add, data_map, function (result) {
                    utils.respJsonData(res, result);
                });
            }

        }


    });

})
/**
 * 记录收藏或下载数
 */
router.route('/develop/im/collectOrDownload').put(function(req,res){
    var imageCode = req.body.imageCode;
    var collectNum = req.body.collectNum;
    var imagetype = req.body.imagetype;
    var downloadNum = req.body.downloadNum;
    var flag = req.body.flag;
    var conditionMap = {};
    var data = [],mapdata = [];
    if(flag && flag == "download"){
        conditionMap.downloadNum = downloadNum;
        data.push(downloadNum);
    }else{
        data.push(collectNum);
        mapdata.push(imagetype);
        mapdata.push(imageCode);
        var currentUser = utils.getCurrentUser(req);
        mapdata.push(currentUser.login_account);
    }
    data.push(imageCode);
    imageService.imageCollectOrDownload(conditionMap,data,mapdata, function(result) {
        utils.respJsonData(res, result);
    });
});

//
    router.route('/develop/im/:id').delete(function(req,res) {
        // 获取提交信息
        var id = req.params.id;
        imageService.delete(id, function(result) {
            utils.respJsonData(res, result);
        });
    });



    module.exports = router;