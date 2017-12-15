/**
 * Created by Administrator on 2017/9/26 0026.
 */

var express = require('express');
var router = express.Router();
var formidable=require("formidable");
var fs=require("fs-extra");


var utils = require('../../../common/core/utils/app_utils');
var informationManageService = require('../services/informationManageService');
var users=require('../../../common/core/models/user_model');

router.route('/')
    .get(function(req,res){
        var page=req.query.page;
        var size=req.query.rows;
        var information_title='';
        var conditionMap=utils.getCurrentUser(req)._id;
        var title=req.query.information_title;
        if(title){
            information_title=title;
        }
        var sql='select * from pass_develop_information_info t where information_issuer_id="'+conditionMap+'" ' +
            'and information_title like "'+"%"+information_title+"%"+'"';

     informationManageService.getInformationManage(sql,page,size,conditionMap,function(result){
         // console.log('====================',result);
         utils.respJsonData(res,result);
     });

    })
    .post(function(req,res){
        var filedir = '../public/static/images/image_information/';
        fs.ensureDir(filedir, function (err) { //改变上传文件夹的方法fs.ensureDir
            if(err){
                console.log('ensureDir error')
                res.send('no ensuredir');
            }
            //console.log(filedir)
            var form = new formidable.IncomingForm();   //创建上传表单
            form.encoding = 'utf-8';		//设置编辑
            form.uploadDir = filedir;	 //设置上传目录
            form.keepExtensions = true;	 //保留后缀
            form.maxFieldsSize = 5 * 1024 * 1024;   //文件大小
            var information_title='';
            var information_type='';
            var information_picture_name='';
            var information_link='';
            var information_introduce='';
            var information_picture='';
            var information_picture_type='';
            var information_content='';
            var path='';
            var information_issuer_id='';
            var id='';
            var data_add=[];
            var data_update=[];

            var user=utils.getCurrentUser(req)._id;
            var userName=users.$.find({"_id":user},function(err,doc){
                if(err){
                    console.error(err);
                }
                information_issuer_id=doc[0]["user_name"];
                console.log("1",doc[0]["user_name"]);
                console.log('3',doc);

                var sqlUpdatePicture = 'update pass_develop_information_info set information_title = ?,information_type = ?,information_content=?,information_link=?,information_introduce=?,information_picture_name = ?,information_picture_type=?,information_picture=? where id =?';

                var sqlUpdate= 'update pass_develop_information_info set information_title = ?,information_type = ?,information_content=?,information_link=?,information_introduce=? where id =?';

                //------------------下面为上传图片内容------//
            form.parse(req, function (error, fields, files) {
                console.log("nijhfkehurhfs");
                if (error) {
                    res.send('no-parse');
                } else {
                    //console.log('yes----------------****',fields,files)
                    //进到这里了，能拿到文件
                    information_title=fields.inputInformationTitle;
                    information_type=fields.inputInformationType;
                    console.log('========类型测试======',fields);
                    information_content=fields.information_content;
                    id=fields.value;
                    information_link=fields.inputInformationLink;
                    information_introduce=fields.inputInformationBrief;
                    information_picture_name=files.inputInformationImage['name'];
                    information_picture_type=files.inputInformationImage['type'];
                    // information_picture='/tmp/'+information_picture_name;
                    path=filedir+information_picture_name;
                    if(id!='' && id!=null && files.inputInformationImage['name']==''){//对应修改时没有上传资料时的处理
                        data_update.push(information_title);
                        data_update.push(information_type);
                        data_update.push(information_content);
                        data_update.push(information_link);
                        data_update.push(information_introduce);
                        data_update.push(id);
                        informationManageService.update(sqlUpdate,data_update,function(result){
                            // console.log('=============-更新成功-------',result);
                            utils.respJsonData(res,result);
                        });
                    }

                    else{//对于增加或修改时上传了图片的部分
                    // console.log(files.inputInformationImage['path'],path)
                    fs.rename(files.inputInformationImage['path'],path,function(err){
                        if(err){
                            res.send('no rename');
                        }
                        else {
                            console.log('rename success')
                       //     information_picture=path;
                            information_picture = fs.readFileSync(path);
                            buf = new Buffer(information_picture);
                            information_picture = buf.toString("base64");
                            data_add.push(information_title);
                            data_add.push(utils.getCurrentUser(req)._id);
                            data_add.push(information_issuer_id);
                            data_add.push(new Date());
                            data_add.push('0');
                            data_add.push(information_type);
                            data_add.push(information_content);//information_content
                            data_add.push(information_picture_name);
                            data_add.push(information_link);
                            data_add.push('0');
                            data_add.push(information_introduce);
                            data_add.push(information_picture_type);
                            data_add.push(information_picture);
                            // res.send('yes');
                            if(id){
                                data_update.push(information_title);
                                data_update.push(information_type);
                                data_update.push(information_content);
                                data_update.push(information_link);
                                data_update.push(information_introduce);
                                data_update.push(information_picture_name);
                                data_update.push(information_picture_type);
                                data_update.push(information_picture);
                                data_update.push(id);
                                informationManageService.update(sqlUpdatePicture,data_update,function(result){
                                    // console.log('=============-更新成功-------',result);
                                    utils.respJsonData(res,result);
                                });
                            }
                            else{
                                informationManageService.add(data_add,function(result){
                                    utils.respJsonData(res,result);
                                });
                            }
                        }
                    });}
                }
            });
            });
        });
    });

router.route('/:id')
    .get(function(req,res){
        var id=req.params.id;
        var page=req.query.page;
        var size=req.query.rows;

        var conditionMap=id;
        informationManageService.getInformationManageUpdate(page,size,conditionMap,function(result) {
            utils.respJsonData(res, result);
        });

    })

.delete(function(req,res){
    var id = req.params.id;
    if (!id) {
        utils.respMsg(res, false, '2004', 'id不能为空。', null, null);
    }
    informationManageService.deleteInfo(id,function(result){
        utils.respJsonData(res, result);
    });
});


module.exports = router;