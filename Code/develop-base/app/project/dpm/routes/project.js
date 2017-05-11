/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var projectService = require('../services/projectService');
var utils = require('../../../common/core/utils/app_utils');

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
    var conditionMap = {};
    if(projectId){
        conditionMap.projectId = projectId;
    }
    // 调用查询
    projectService.versionList(conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});


router.route('/develop/pm/version/list').get(function(req,res){
    var projectId = req.query.projectId;
    var conditionMap = {};
    if(projectId){
        conditionMap.projectId = projectId;
    }
    // 调用查询
    projectService.versionList(conditionMap,function(result){
        utils.respJsonData(res, result.data);
    });
});
/**
 * 创建项目
 */
router.route('/develop/pm/project').post(function(req,res) {
    var data=[];
    // var results = [];
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
            var gitProjectId = null;
            //判断是否从gitlab获取项目集合成功
            if(result.data && result.data.length>0){
                var flag = true;
                for(var i=0;i<result.data.length;i++){
                    if(pcode == result.data[i].projectName){
                        data.push(result.data[i].projectId);
                        gitProjectId = result.data[i].projectId;
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
            var projectId = null;
            projectService.add(data, function(results) {
                if(results.success){
                    projectId = results.data.insertId;
                    console.log("gitprojectid===",gitProjectId);
                    console.log("projectId===",projectId);
                    //从gitlab pipelines拉取项目版本
                    if(gitProjectId && projectId){
                        projectService.getVerByGitLab(gitProjectId,projectId);
                    }
                }
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

router.route('/develop/pm/deploy').post(function(req,res){
    var projectId = req.body.deployProjectId;
    var projectVersion = req.body.deployProjectVersion;
    var clusterId = req.body.deployClusterId;
    if(!projectId) {
        utils.respMsg(res, false, '2001', '请求参数不全，请重试。', null, null);
    }
    if(!projectVersion) {
        utils.respMsg(res, false, '2001', '版本编号不能为空。', null, null);
    }
    if(!clusterId) {
        utils.respMsg(res, false, '2001', '部署集群不能为空。', null, null);
    }
    var params = [];
    params.push(projectId);
    params.push(clusterId);
    projectService.getDeployedList(param, function(result){
        if(result.success){
            if(result.data != null && result.data.length != 0){//已经部署过了
                utils.respJsonData(res, utils.returnMsg(false, '0000', '所选应用在该集群已经部署过了，不能重复部署', null, null));
            }else{
                //TODO 部署集群
                params.clear();
                params.push(projectId);
                params.push(projectVersion);
                projectService.getVersionInfo(param, function(result){
                    if(result.success){
                        if(result.data != null && result.data.length == 1){
                            var deployJson = JSON.parse(result.data[0].deployJson);
                            var request = require('request');
                            var options = {
                                headers : {"Connection": "close"},
                                url : 'http://192.168.31.91:8080/v2/apps',//TODO 需要根据集群ID查询集群的marathon-lb接口地址
                                method : 'POST',
                                json : true,
                                body : {data : deployJson}
                            };
                            function callback(error, response, data) {
                                if (!error && response.statusCode == 200) {
                                    console.log('----info------',data);
                                }
                                //插入启动的服务信息
                                params.clear();
                                params.push(projectId);
                                params.push(projectVersion);
                                params.push(clusterId);
                                params.push("http://192.168.31.91" + ":" + deployJson.container.docker.portMappings[0].servicePort);
                                params.push(data);
                                var currentUser = utils.getCurrentUser(req);
                                params.push(currentUser.login_account);
                                projectService.saveDeployInfo(params,function(result){
                                    utils.respJsonData(res, result);
                                });
                            }
                            request(options, callback);
                        } else{
                            utils.respJsonData(res, utils.returnMsg(false, '0000', '获取项目版本部署信息异常', null, null));
                        }
                    }else{
                        utils.respJsonData(res, result);
                    }
                });
            }
        }else{
            utils.respJsonData(res, result);
        }
    });
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