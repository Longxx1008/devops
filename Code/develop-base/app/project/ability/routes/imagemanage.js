/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();

var imageService = require('../services/imageManagerService');
var utils = require('../../../common/core/utils/app_utils');

//pageList分页查询的Controller
router.route('/develop/im/pageList').get(function(req,res){
    // // 分页条件
    // var imageCode = req.query.imageCode;
    // var imageName = req.query.projectName;
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    // if(imageCode){
    //     conditionMap.projectCode = imageCode;
    // }
    // if(imageName) {
    //     conditionMap.projectName = imageName;
    // }
    // 调用分页
    imageService.pageList(page, length, conditionMap,function(result){
        console.log("------result------");
        console.log(result)

        utils.respJsonData(res, result);
    });
});

//修改起止位置 2017-05-03 黄浩浩

/**
 * 创建项目
 */
router.route('/develop/im/add').post(function(req,res) {
    // 获取提交信息
    var data=[];
    var channels = req.body.channels;
    var 
    //暂时截取git地址最后的名字作为编号,如：git@code.dev.gz.cmcc:develop-base/develop-base.git，develop-base就是编号
    var pcode = gitaddress.substring(gitaddress.lastIndexOf('/')+1,gitaddress.lastIndexOf('.'));
    data.push(pcode);
    data.push(req.body.projectName);
    data.push(gitaddress);
    data.push(req.body.healthCondition);
    data.push(req.body.resourceUse);
    data.push(req.body.remark);
    var currentUser = utils.getCurrentUser(req);
    data.push(currentUser.login_account);
    projectService.add(data, function(result) {
        utils.respJsonData(res, result);
    });
});
/**
 * 修改项目
 */
router.route('/develop/pm/update').put(function(req,res) {
    // 获取提交信息
    var data=[];
    var gitaddress = req.body.gitAddress;
    //暂时截取git地址最后的名字作为编号,如：git@code.dev.gz.cmcc:develop-base/develop-base.git，develop-base就是编号
    var pcode = gitaddress.substring(gitaddress.lastIndexOf('/')+1,gitaddress.lastIndexOf('.'));
    data.push(pcode);
    data.push(req.body.projectName);
    data.push(gitaddress);
    data.push(req.body.healthCondition);
    data.push(req.body.resourceUse);
    data.push(req.body.remark);
    projectService.update(data, function(result) {
        utils.respJsonData(res, result);
    });
});
router.route('/develop/pm/:id').delete(function(req,res) {
    // 获取提交信息
    var id = req.params.id;
    projectService.delete(id, function(result) {
        utils.respJsonData(res, result);
    });
});

router.route('/doc/{id}/{type}').get(function(req,res){

});

module.exports = router;