/**
 * Created by Administrator on 2017/10/23 0023.
 */
var express=require('express');
var router=express.Router();
var formidable=require('formidable');
var fs=require('fs-extra');

var utils = require('../../../common/core/utils/app_utils');
var startPageManageService = require('../services/startPageManageService');
// var users=require('../../../common/core/models/user_model');

router.route('/')
    .get(function (req,res) {
        var page = req.query.page;
        var size = req.query.rows;
        var conditionMap = '';
        console.log('==js=node==');
        // var conditionMap=utils.getCurrentUser(req)._id;
        // var sql='select * from pass_develop_information_info t where information_issuer_id="'+conditionMap+'" ' +
        //     'and information_title like "'+"%"+information_title+"%"+'"';

        startPageManageService.getStartPageManage(page, size, conditionMap, function (result) {
             console.log('====================',result);
            utils.respJsonData(res, result);
        })
    })
.post(function (req,res) {
    console.log('=====g=======');

    var filedir = '../public/static/images/image_information/';//文件上传路径
    fs.ensureDir(filedir,function (err) {
        if(err){
            console.log('ensureDir error')
            res.send('no ensuredir');
        }
        var form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';		//设置编辑
        form.uploadDir = filedir;	 //设置上传目录
        form.keepExtensions = true;	 //保留后缀
        form.maxFieldsSize = 5 * 1024 * 1024;   //文件大小

        var showType='';
        var imageName='';
        var imageType='';
        var imagePath='';
        var id='';

        var sqlUpdatePicture = 'update pass_develop_homepage_info set showType = ?,imageName= ?,imageType=?,imagePath=? where id =?';

        form.parse(req,function (error, fields, files) {
            console.log('==files==',files);
            console.log('==files==',files['input-file-preview']['name']);
            if (error) {
                res.send('no-parse');
            } else {
               // imageName=files.startPageImage['name'];
               // imageType=files.startPageImage['type'];
                showType=fields.type;
                imageName=files['input-file-preview']['name'];
                imageType=files['input-file-preview']['type'];
                path=filedir+imageName;
                id=fields.value;
                fs.rename(files['input-file-preview']['path'],path,function(err){
                    if(err){
                        res.set({'Content-Type': 'text/json', 'Encodeing': 'utf8'});
                        res.send({'msg':"no rename"});
                    }
                    else {
                        imagePath = fs.readFileSync(path);
                        buf = new Buffer(imagePath);
                        imagePath = buf.toString("base64");
                        var data_add=[];
                        var data_update=[];

                        if(id){
                            console.log("==id=",id);
                            data_update.push(showType);
                            data_update.push(imageName);
                            data_update.push(imageType);
                            data_update.push(imagePath);
                            data_update.push(id);
                            startPageManageService.update(sqlUpdatePicture,data_update,function (result) {
                                utils.respJsonData(res,result);
                            });
                        }else {
                            console.log("==id",id);
                            data_add.push(showType);
                            data_add.push(imageName);
                            data_add.push(imageType);
                            data_add.push(imagePath);
                            startPageManageService.add(data_add, function (result) {
                                utils.respJsonData(res, result);
                            });
                        }
                    }
            });
            }

        });


    });
})
    .delete(function(req,res) {
        var id = req.body.id;
        console.log("idarr",id);
        id=JSON.parse(id);
        if (!id) {
            utils.respMsg(res, false, '2004', 'id不能为空。', null, null);
        }
                startPageManageService.deleteInfo(id, function (result) {
            utils.respJsonData(res, result);
        });
    });
router.route('/:id')
    .get(function(req,res){
        var id=req.params.id;
        var page=req.query.page;
        var size=req.query.rows;
        var conditionMap=id;
        startPageManageService.getStartPageManageUpdate(page,size,conditionMap,function(result) {
            utils.respJsonData(res, result);
        });
    });


module.exports=router;