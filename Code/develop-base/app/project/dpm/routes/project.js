/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();

var projectService = require('../services/projectService');
var utils = require('../../../common/core/utils/app_utils');

router.route('/develop/pm/pageList').get(function(req,res){
    // 分页条件
    var projectCode = req.query.projectCode;
    var projectName = req.query.projectName;
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    if(projectCode){
        conditionMap.projectCode = projectCode;
    }
    if(projectName) {
        conditionMap.projectName = projectName;
    }
    // 调用分页
    projectService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});
/**
 * 创建项目
 */
router.route('/develop/pm/add').post(function(req,res) {
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