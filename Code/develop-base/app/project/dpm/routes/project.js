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


router.route('/develop/pm/version').get(function(req,res){
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
            data.push(req.body.homeUrl);
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
    data.push(req.body.homeUrl);
    projectService.update(data, function(result) {
        utils.respJsonData(res, result);
    });
});
/**
 * 项目进度情况
 */
router.route('/develop/pm/process').get(function(req, res){
    projectService.projectProcess(function(result){
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

router.route('/develop/pm/deploy/logs/:id').get(function(req, res){
    var id = req.params.id;
    projectService.getDeployedInfo(id,function(result){
        if(result.success && result.data.length != 0){
            var url = "http://" + result.data[0].hostIp +  ":2375/containers/" +  result.data[0].containerId + "/logs?stderr=1&stdout=1&timestamps=1&follow=0&tail=1000&since=0";
            var http = require("http");
            http.get(url, function(resp){
                if(resp.statusCode == 200){
                    var rhtml = '';
                    resp.setEncoding('utf8');
                    resp.on('data', function (chunk) {
                        rhtml += chunk;
                    });
                    resp.on('end', function () {
                        console.log("end....");
                        res.end(rhtml,"utf-8");
                    });
                } else{
                    utils.respMsg(res, false, '0000', '查询日志出错：' + resp.statusCode, null, null);
                }
            }).on('error',function(e){
                console.log("Got error: " + e.message);
            });
        }else{
            res.end("","utf-8");
        }
    })
});

router.route('/develop/pm/deploy/stop/:id').put(function(req, res){
    var id = req.params.id;
    var projectId = req.body.projectId;
    projectService.getDeployedInfo(id,function(result){
        if(result.success && result.data.length != 0){
            var request = require('request');
            var scaleJson = {"instances": 0};
            var options = {
                headers : {"Connection": "close"},
                url : config.platform.marathonApi + result.data[0].mesosId,
                method : 'put',
                json : true,
                body : scaleJson
            };
            function callback(error, response, data) {
                console.log(response);
                if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                    console.log('停止应用成功----info------',data);
                    var params = [];
                    params.push("0");
                    params.push("0");
                    params.push("实例:0个<br>CPU:0个<br>内存:0M");
                    params.push("");
                    params.push("");
                    params.push("");
                    params.push("");
                    params.push(id);
                    projectService.updateDeployStatus(params,function(result){
                        if(!result.success){
                            utils.respMsg(res, false, '10000', '停止应用成功，但更新应用状态失败', null, null);
                        }else{
                            var stepData = [];
                            stepData.push(2);
                            stepData.push(projectId);
                            projectService.updateStep(stepData,function(result){
                                if(!result.success){
                                    utils.respMsg(res, false, '10000', '停止应用失败', null, null);
                                }else{
                                    utils.respMsg(res, true, '10000', '停止应用成功', null, null);
                                }
                            });
                        }
                    });
                }else{
                    console.log("停止应用失败，" + error);
                    utils.respMsg(res, false, '10000', '停止应用操作失败', null, null);
                }
            }
            request(options, callback);
        }else{
            utils.respMsg(res, false, '10000', '停止失败，所选应用不存在', null, null);
        }
    })
});

router.route('/develop/pm/deploy/delete/:id').put(function(req, res){
    var id = req.params.id;
    var projectId = req.body.projectId;
    projectService.getDeployedInfo(id,function(result){
        if(result.success && result.data.length != 0){
            var request = require('request');
            var scaleJson = {"instances": 0};
            var options = {
                headers : {"Connection": "close"},
                url : config.platform.marathonApi + result.data[0].mesosId,
                method : 'delete',
                json : true,
                body : scaleJson
            };
            function callback(error, response, data) {
                if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                    console.log('删除应用成功----info------',data);
                    projectService.deleteDeployInfo(id,function(result){
                        if(result.success){
                            var stepData = [];
                            stepData.push(2);
                            stepData.push(projectId);
                            projectService.updateStep(stepData,function(result){
                                if(!result.success){
                                    utils.respMsg(res, false, '10000', '删除应用失败', null, null);
                                }else{
                                    utils.respMsg(res, true, '2001', '应用部署成功', null, null);
                                }
                            });
                        }else{
                            utils.respMsg(res, false, '10000', '删除应用失败', null, null);
                        }
                    });
                }else{
                    console.log("删除应用失败，" + error);
                    utils.respMsg(res, false, '10000', '删除应用操作失败', null, null);
                }
            }
            request(options, callback);
        }else{
            utils.respMsg(res, false, '10000', '删除失败，所选应用不存在', null, null);
        }
    })
});

router.route('/develop/pm/deploy/start/:id').post(function(req, res){
    var id = req.params.id;
    var projectId = req.body.projectId;
    projectService.getDeployedInfo(id,function(result){
        if(result.success && result.data.length != 0){
            var request = require('request');
            var mesosId = result.data[0].mesosId;
            //默认只启动一个实例
            var scaleJson = {"instances": 1};
            var options = {
                headers : {"Connection": "close"},
                url : config.platform.marathonApi + mesosId,
                method : 'put',
                json : true,
                body : scaleJson
            };
            function callback(error, response, data) {
                if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                    console.log('启动应用成功----info------',data);
                    //更新应用状态
                    var params = [];
                    params.push("1");
                    params.push("1");
                    params.push("实例:0个<br>CPU:0个<br>内存:0M");
                    params.push("");
                    params.push("");
                    params.push("");
                    params.push("");
                    params.push(id);
                    projectService.updateDeployStatus(params,function(result){
                        if(!result.success){
                            utils.respMsg(res, false, '10000', '启动应用成功，但更新应用状态失败', null, null);
                        }else{
                            var stepData = [];
                            stepData.push(4);
                            stepData.push(projectId);
                            projectService.updateStep(stepData,function(result){
                                if(!result.success){
                                    utils.respMsg(res, false, '10000', '启动应用成功，但更新应用状态失败', null, null);
                                }else{
                                    utils.respMsg(res, true, '10000', '启动应用成功', null, null);
                                }
                            });
                            //刷新应用状态
                            setTimeout(function(){
                                projectService.refreshDeployedInfo(id, mesosId);
                            },10 * 1000);
                        }
                    });
                }else{
                    console.log("启动应用操作失败，" + error);
                    utils.respMsg(res, false, '10000', '启动应用操作失败', null, null);
                }
            }
            request(options, callback);
        }else{
            utils.respMsg(res, false, '10000', '启动失败，所选应用不存在', null, null);
        }
    })
});
router.route('/develop/pm/deploy/status').get(function(req, res){
    var id = req.query.projectId;
    var mesosId = req.query.projectCode;
    var url = config.platform.marathonApi  + "/" + mesosId;
    var http = require("http");
    http.get(url, function(resp) {
        console.log("Got response: " + resp.statusCode);
        resp.setEncoding('utf8');
        var chtmlJson = '';
        resp.on('data', function (chunk) {//拼接响应数据
            chtmlJson += chunk;
        });
        resp.on('end', function () {
            console.log(mesosId + "返回数据为:" + chtmlJson);
            var json = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
            if (json && json.app) {
                //健康的实例大于1，就认为应用健康
                var status = json.app.tasksHealthy > 0 ? 1 : 0;
                if(status == 1){//健康
                    utils.respMsg(res, true, '1000', '应用健康', null, null);
                    var cpus = json.app.cpus;
                    var mem = json.app.mem;
                    var instances = json.app.instances;
                    var resources  = "实例:" + instances + "个<br>CPU:" + instances * cpus + "个<br>内存:" + mem * instances + "M";
                    //默认只读取第一个实例
                    var taskId = json.app.tasks[0].id;
                    var host = json.app.tasks[0].host;
                    projectService.httpGetContainerInfo(id, mesosId, status, resources, taskId, host);
                }else{
                    utils.respMsg(res, false, '1000', '应用不健康', null, null);
                }
            } else {
                console.log(mesosId + "接口数据异常");
                utils.respMsg(res, false, '1000', '应用不健康', null, null);
            }
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        utils.respMsg(res, false, '1000', '应用不健康', null, null);
    });
});
router.route('/develop/pm/deploy').get(function(req, res){
    // 分页条件
    var projectName = req.query.projectName;
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    if(projectName){
        conditionMap.projectName = projectName;
    }
    // 调用分页
    projectService.deployedPageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
}).post(function(req,res){
    var projectId = req.body.deployProjectId;
    var projectVersion = req.body.deployProjectVersion;
    var clusterId = req.body.deployClusterId;
    var remark = req.body.remark;
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
    projectService.getDeployedList(params, function(result){
        if(result.success){
            if(result.data != null && result.data.length != 0){//已经部署过了
                utils.respJsonData(res, utils.returnMsg(false, '0000', '所选应用在该集群已经部署过了,不能重复部署', null, null));
            }else{
                //TODO 部署集群
                params.splice(0, params.length);
                params.push(projectId);
                params.push(projectVersion);
                projectService.getVersionInfo(params, function(result){
                    if(result.success){
                        if(result.data != null && result.data.length == 1){
                            //TODO 下面的mesos接口地址和marathon-lb的地址都应该根据集群ID从数据库获取
                            console.log(result.data[0].deployJson);
                            var deployJson = JSON.parse(result.data[0].deployJson);
                            var homeUrl = result.data[0].homeUrl;
                            var mesosId = result.data[0].mesosId;
                            var request = require('request');
                            var options = {
                                headers : {"Connection": "close"},
                                url : config.platform.marathonApi,
                                method : 'POST',
                                json : true,
                                body : deployJson
                            };
                            function callback(error, response, data) {
                                if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
                                    console.log('部署成功----info------',data);
                                    //插入启动的服务信息
                                    params.splice(0,params.length);
                                    params.push(projectId);
                                    params.push(data.id);
                                    params.push(projectVersion);
                                    params.push(clusterId);
                                    params.push(config.platform.marathonLb + ":" + deployJson.container.docker.portMappings[0].servicePort);
                                    //params.push(JSON.stringify(data));
                                    params.push(remark);
                                    var currentUser = utils.getCurrentUser(req);
                                    params.push(currentUser.login_account);
                                    projectService.saveDeployInfo(params,function(result){
                                        //utils.respJsonData(res, result);
                                        console.log(result);
                                        if(!result.success){
                                            utils.respMsg(res, false, '2001', '应用部署失败', null, null);
                                        }else{
                                            //刷新应用状态
                                            var deployId = result.data.insertId;
                                            setTimeout(function(){
                                                projectService.refreshDeployedInfo(deployId, mesosId);
                                            },30 * 1000);
                                            var stepdata = [];
                                            if(clusterId != 1){
                                                stepdata.push(4);
                                            }else{
                                                stepdata.push(2);
                                            }
                                            stepdata.push(projectId);
                                            projectService.updateStep(stepdata,function(result){
                                                if(!result.success){
                                                    utils.respMsg(res, false, '2001', '修改项目阶段失败', null, null);
                                                }else{
                                                    utils.respMsg(res, true, '2001', '应用部署成功', null, null);
                                                }
                                            });
                                        }
                                    });
                                }else{
                                    console.log("部署失败，" + error);
                                    utils.respMsg(res, false, '2001', '应用部署失败', null, null);
                                }
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

router.route("/develop/pm/tree").get(function(req,res){
    // 条件
    var projectId = req.query.projectId;
    if(!projectId){
        return false;
    }
    // 调用查询
    projectService.queryDetailTree(projectId,function(results){
        utils.respJsonData(res, results);
    });
});

router.route("/test").post(function(req,res){
    console.log(req.evalMatches);
    console.log(req);
    console.log(res);
});

module.exports = router;