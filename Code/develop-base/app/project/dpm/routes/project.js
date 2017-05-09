/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var projectService = require('../services/projectService');
var utils = require('../../../common/core/utils/app_utils');
// 连接服务
var gitlab = require('gitlab')({
    url   : config.platform.gitlabUrl,
    token : config.platform.private_token
});

//分页查询项目数据列表
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
 * 查询项目版本数据
 */
router.route('/develop/pm/verList').get(function(req,res){
    // 分页条件
    var projectId = req.query.projectId;
    var gitProjectId = req.query.gitProjectId;

    var conditionMap = {};
    if(projectId){
        conditionMap.projectId = projectId;
    }
    if(gitProjectId){
        conditionMap.gitProjectId = gitProjectId;
    }
    // 调用查询
    projectService.versionList(conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

/**
 * 创建项目
 */
router.route('/develop/pm/add').post(function(req,res) {
    var data=[];
    var results = [];
    var gitaddress = req.body.gitAddress;
    //暂时截取git地址最后的名字作为编号,如：git@code.dev.gz.cmcc:develop-base/develop-base.git，develop-base就是编号
    var pcode = gitaddress.substring(gitaddress.lastIndexOf('/')+1,gitaddress.lastIndexOf('.'));
    var conditionMap = {};
    conditionMap.projectCode = pcode;
    // 调用查询
    projectService.getProject(conditionMap,function(result){//根据projectcode查询项目是否存在
        if(result.success){
            // 获取提交信息
            data.push(pcode);
            data.push(req.body.projectName);
            data.push(gitaddress);
            data.push(req.body.healthCondition);
            data.push(req.body.resourceUse);
            data.push(req.body.remark);
            var currentUser = utils.getCurrentUser(req);
            data.push(currentUser.login_account);
            data.push(req.body.projectType);
            //判断是否从gitlab获取项目集合成功
            if(result.data && result.data.length>0){
                var flag = true;
                for(var i=0;i<result.data.length;i++){
                    if(pcode == result.data[i].projectName){
                        data.push(result.data[i].projectId);
                        flag = true
                        break;
                    }else{
                        flag = false;
                    }
                }
                if(!flag){//如果没有匹配的项目编号(名称)，设空值
                    data.push(null);
                }
            }else{
                data.push(null);
            }
            projectService.add(data, function(results) {
                utils.respJsonData(res, results);
            });
        }else{
            utils.respJsonData(res, result);
        }
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
    data.push(req.body.projectType);
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

/**
 * 查询项目成员数据
 */
router.route('/develop/pm/proUserList').get(function(req,res){
    // 条件
    var projectId = req.query.projectId;

    var conditionMap = {};
    if(projectId){
        conditionMap.projectId = projectId;
    }else{
        return false;
    }
    // 调用查询
    projectService.getUserList(conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

module.exports = router;