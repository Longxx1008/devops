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
    var serviceId = req.query.serviceId;
    var conditionMap = {};
    if(serviceId){
        conditionMap.serviceId = serviceId;
    }
    // 调用
    serviceService.versionList(conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

/**
 * 创建服务
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

    serVerData.push(version);
    //查询服务表是否有对应projectId的数据
    serviceService.getServiceByProId(conditionMap,function(results){
        console.info(results);
        if(results.success && results.data.length == 0){//如果服务表无相关项目数据,则新增相关服务数据与服务版本数据
            data.push(projectId);
            serviceService.add(data, function(result) {
                console.log("-----seradd----",result);
                if(result.success){
                    serVerData.push(result.data.insertId);
                    serVerData.push('部署文件名称');
                    serVerData.push('部署文件内容');
                    serVerData.push(currentUser.login_account);
                    serviceService.addSerVer(serVerData,function(verResult){
                        utils.respJsonData(res, verResult);
                    });
                }else{
                    utils.respJsonData(res, result);
                }

            });
        }else if(results.success && results.data.length > 0){//如果查询有相关项目数据，则查询是否有对应的版本数据
            conditionMap.serviceId = results.data[0].id;
            serviceService.getServiceVerByProIdAndVerNo(conditionMap,function(verResults){
                if(verResults.success && verResults.data.length == 0){//如果相关服务无对应的版本数据则新增版本数据

                    serVerData.push(results.data[0].id);
                    serVerData.push('部署文件名称');
                    serVerData.push('部署文件内容');
                    serVerData.push(currentUser.login_account);
                    serviceService.addSerVer(serVerData,function(verResult){
                        utils.respJsonData(res, verResult);
                    });
                }else{
                    utils.respJsonData(res, utils.returnMsg(false, '1000', '相关服务版本已经存在', null, null));
                }
            });
            
        }else{
            utils.respJsonData(res, results);
        }

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