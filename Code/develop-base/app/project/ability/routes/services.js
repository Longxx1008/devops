/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();

var serviceService = require('../services/serviceService');
var utils = require('../../../common/core/utils/app_utils');

//分页查询服务仓库数据列表
router.route('/develop/sm/pageList').get(function(req,res){
    // 分页条件
    var type = req.query.type;
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    if(type){
        conditionMap.type = type;
    }
    // 调用分页
    serviceService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

//分页查询服务管理数据列表
router.route('/develop/sm/smPageList').get(function(req,res){
    // 分页条件
    var type = req.query.type;
    var currentUser = utils.getCurrentUser(req);
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    if(type){
        conditionMap.type = type;
    }
    conditionMap.userId = currentUser.login_account;
    // 调用分页
    serviceService.smPageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

/**
 * 查询服务版本数据
 */
router.route('/develop/sm/verList').get(function(req,res){
    var projectId = req.query.projectId;
    var conditionMap = {};
    if(projectId){
        conditionMap.projectId = projectId;
    }
    // 调用
    serviceService.versionList(conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

/**
 * 创建服务版本
 */
router.route('/develop/sm/add').post(function(req,res) {
    // 获取提交信息
    var data=[];
    var serVerData=[];
    var conditionMap = {};
    var currentUser = utils.getCurrentUser(req);
    var version = req.body.proVersion;
    var projectId = req.body.projectId;
    var gitAddress = req.body.gitAddress;
    if(version){
        conditionMap.proVersion = version;
    }
    if(projectId){
        conditionMap.projectId = projectId;
    }

    data.push(2);
    data.push(projectId);
    serVerData.push(version);
    serVerData.push(projectId);
    serVerData.push(currentUser.login_account);
    serviceService.addSerVer(data,serVerData,function(verResult){
        utils.respJsonData(res, verResult);
    });
});
/**
 * 修改服务
 */
router.route('/develop/sm/update').put(function(req,res) {
    // 获取提交信息
    var data=[];
    var corrdata=[];
    var currentUser = utils.getCurrentUser(req);
    data.push(req.body.status);
    data.push(req.body.remark);
    data.push(currentUser.login_account);
    data.push(currentUser.login_account);
    corrdata.push(req.body.serviceId);
    corrdata.push(currentUser.login_account);
    corrdata.push(req.body.projectType);
    corrdata.push(currentUser.login_account);
    serviceService.update(data,corrdata, function(result) {
        utils.respJsonData(res, result);
    });
});
router.route('/develop/sm/:id').delete(function(req,res) {
    // 获取提交信息
    var id = req.params.id;
    serviceService.delete(id, function(result) {
        utils.respJsonData(res, result);
    });
});

router.route('/doc/{id}/{type}').get(function(req,res){

});

module.exports = router;