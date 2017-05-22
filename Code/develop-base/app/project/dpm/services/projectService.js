var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var nodeGrass = require('../../utils/nodegrass');
var config = require('../../../../config');
var alertService = require('./alertService');
var http = require('http');

/**
 * 获取项目的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page, size, conditionMap, cb) {
    var sql = " select t1.*,d.version as deployVersion from pass_develop_project_resources t1 left join pass_develop_project_deploy d on t1.id=d.projectId where 1=1";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectCode) {
            sql += " and (t1.projectCode like '%" + conditionMap.projectCode + "%')";
        }
        if(conditionMap.projectName) {
            sql += " and (t1.projectName like '%" + conditionMap.projectName + "%')";
        }
    }
    var orderBy = " order by d.version desc";
    console.log("查询项目信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

//获取项目版本数据
exports.versionList = function(conditionMap, cb) {
    var sql = " select t.* from pass_develop_project_versions t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.projectId) {
            sql += " and t.projectId=?";
            condition.push(conditionMap.projectId);
        }
    }
    sql += " order by t.id desc";
    // 查询数据库默认版本数据
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取版本信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取版本信息成功', results, null));
        }
    });
}
//获取项目进度情况
exports.projectProcess = function(cb) {
    var sql = " select sum(case WHEN step = 1 then 1 else 0 end) as developNum,sum(case WHEN step = 2 then 1 else 0 end) as testNum," +
        "sum(case WHEN step in (3,4) then 1 else 0 end) as deployNum,sum(case WHEN step in (3,4) then 1 else 0 end) as operationNum  " +
        "from pass_develop_project_resources";
    // 查询项目进度情况数据
    mysqlPool.query(sql,[],function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取项目进度信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取项目进度信息成功', result, null));
        }
    });
}

exports.deployedPageList = function(page, size, conditionMap, cb) {
    var sql = " select t1.*,concat('" + config.platform.marathonLb + "',':',t1.webSite) as url,t2.projectCode,t2.projectName from pass_develop_project_deploy t1,pass_develop_project_resources t2 where t1.projectId = t2.id";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectName) {
            sql += " and (t2.projectName like '%" + conditionMap.projectName + "%')";
        }
    }
    var orderBy = " order by t1.createTime desc";
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

//根据projectCode获取项目数据
exports.getProject = function(conditionMap, cb) {
    var sql = " select t.* from pass_develop_project_resources t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.projectCode) {
            sql += " and t.projectCode=?";
            condition.push(conditionMap.projectCode);
        }
    }
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取项目信息异常', null, err));
        } else {
            if(results&& results.length>0){
                cb(utils.returnMsg(false, '1000', '项目已存在', results, null));
            }else{
                //获取gitlab所有项目
                var url = config.platform.gitlabUrl+'/api/v3/projects?private_token='+config.platform.private_token;
                nodeGrass.get(url,function(data,status,headers){
                    // console.log(status);
                    // console.log(data);
                    var info = JSON.parse(data);//将拼接好的响应数据转换为json对象
                    var results = [];
                    if (info) {
                        for(var i=0;i<info.length;i++){
                            results.push({"projectId":info[i].id,"projectName":info[i].name});
                        }
                        cb(utils.returnMsg(true, status, '获取项目信息成功。', results, null));
                    } else {
                        cb(utils.returnMsg(false, status, '获取项目信息失败。', results, null));
                    }
                },'utf8').on('error', function(e) {
                    console.log("Got error: " + e.message);
                    cb(utils.returnMsg(false, '404', e.message, null, null));
                });
            }
        }
    });
}

/**
 * 创建项目信息
 * @param data
 * @param cb
 */
exports.add = function(data, cb) {
    var sql = "insert into pass_develop_project_resources(projectCode,projectName,gitAddress,healthCondition,resourceUse,remark,createTime,createUser,projectType,gitlabProjectId,type,homeUrl) values(?,?,?,?,?,?,now(),?,?,?,1,?)";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '创建项目信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '创建项目信息成功', result, null));
        }
    });
};

//从gitlab获取版本信息
exports.getVerByGitLab = function(gitProjectId,projectId){
    var url = config.platform.gitlabUrl+'/api/v3/projects/'+gitProjectId+'/pipelines?private_token='+config.platform.private_token+'&scope=tags';
    nodeGrass.get(url,function(data,status,headers){
        // console.log(status);
        // console.log(data);
        var info = JSON.parse(data);//将拼接好的响应数据转换为json对象
        if (info) {
            var i = 0;
            forVersionInfo(info,i,projectId);
        } else {
            console.log( '创建项目时 项目版本信息不存在...');
        }
    },'utf8').on('error', function(e) {
        console.log("Got error: " + e.message);
        console.log( '创建项目时 获取项目版本信息错误：'+e.message);
    });
    
}

function forVersionInfo(versions,i,projectId){
    if(versions && versions.length > i){
        console.log('创建项目时 检查版本状态：',versions[i].status);
        if(versions[i].status == 'success'){
            //根据projectId和版本号查询项目对应版本是否存在
            var sersql = "select id from pass_develop_project_versions where versionNo=? and projectId=?";
            mysqlPool.query(sersql,[versions[i].ref,projectId],function(err,serresult) {
                if(err) {
                    console.log('创建项目时 查询相关项目版本信息异常');
                } else {
                    if(serresult && serresult.length == 0){//如果项目版本不存在，就插入该版本信息
                        var results=[];
                        var sql = "insert into pass_develop_project_versions(versionNo,projectId,createTime) values(?,?,now())";
                        results.push(versions[i].ref);
                        results.push(projectId);
                        mysqlPool.query(sql,results,function(err,result) {
                            if(err) {
                                console.log( '创建项目时 插入gitlab相关项目版本信息异常...');
                            } else {
                                console.log('创建项目时 插入gitlab相关项目版本信息成功...');
                            }
                            forVersionInfo(versions,++i,projectId);
                        });
                    }else{
                        forVersionInfo(versions,++i,projectId);
                        console.log( '创建项目时 项目版本信息已存在...');
                    }
                }
            });
        }
    }
}

/**
 * 更新项目信息
 * @param data
 * @param cb
 */
exports.update = function(data, cb) {
    var sql = "update pass_develop_project_resources set projectCode = ?,projectName = ?,gitAddress = ?,healthCondition = ?,resourceUse = ?,remark = ?,projectType = ?,homeUrl = ? where id = ?";
    mysqlPool.query(sql, data, function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新项目信息成功', result, null));
        }
    });
};

/**
 * 更新项目阶段
 * @param data
 * @param cb
 */
exports.updateStep = function(data, cb) {
    var sql = "update pass_develop_project_resources set step = ? where id = ?";
    mysqlPool.query(sql, data, function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新项目阶段信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新项目阶段信息成功', result, null));
        }
    });
};

/**
 * 更新项目类型信息
 * @param data
 * @param cb
 */
exports.updateType = function(data,corrdata, cb) {
    var sql = "update pass_develop_project_resources set type = ? where id = ?";
    mysqlPool.query(sql, data, function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新项目类型信息异常', null, err));
        } else {
            if(data[0] == 2){//为服务时插入数据到服务对应表
                var corrsql = "insert into pass_project_service_corres_info(projectId,userId,type,createTime,createUser) values(?,?,?,now(),?)";
                mysqlPool.query(corrsql,corrdata,function(err,results){
                    if(err) {
                        cb(utils.returnMsg(false, '1000', '服务创建异常', null, err));
                    } else {
                        cb(utils.returnMsg(true, '0000', '服务创建成功', null, null));
                    }
                });
            }

        }
    });
};

/**
 * 删除项目信息
 * @param id
 * @param cb
 */
exports.delete = function(id, cb) {
    var sql = "delete from pass_develop_project_resources where id = ?";
    mysqlPool.query(sql,[id],function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '删除项目信息成功', null, null));
        }
    });
}

exports.getUserList = function(conditionMap,cb){
    var sql = " select t.* from pass_develop_project_members t where 1=1 ";
    var condition = [];
    var page = 1;
    var size = 50;
    if(conditionMap) {
        if(conditionMap.projectId) {//gitlab项目Id
            sql += " and t.projectId=?";
            condition.push(conditionMap.projectId);
        }
    }
   var orderBy = 'order by t.id desc';
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, condition, cb);
}
/**
 * 获取已已部署的项目列表
 * @param conditionMap
 * @param cb
 */
exports.getDeployedList = function(conditionMap, cb){
    var sql = " select t1.*,t2.projectCode,t2.projectName from pass_develop_project_deploy t1,pass_develop_project_resources t2 where t1.projectId=t2.id ";
    sql += " and t1.projectId=? and t1.clusterId=?";
    mysqlPool.query(sql, conditionMap, function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '查询已部署项目时出现错误', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '查询已部署项目成功', result, null));
        }
    });
}

exports.getDeployedInfo = function(id, cb){
    var sql = " select t1.*,t2.projectCode,t2.projectName from pass_develop_project_deploy t1,pass_develop_project_resources t2 where t1.projectId=t2.id ";
    sql += " and t1.id = ?";
    mysqlPool.query(sql, [id], function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '查询已部署项目信息出现错误', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '查询已部署项目信息成功', result, null));
        }
    });
}


/**
 * 获取指定版本的信息
 * @param conditionMap
 * @param cb
 */
exports.getVersionInfo = function(conditionMap, cb){
    var sql = "select t1.*,t2.projectCode,t2.projectName,t2.homeUrl from pass_develop_project_versions t1,pass_develop_project_resources t2 where t1.projectId=t2.id ";
    sql += " and t1.projectId=? and t1.versionNo=?";
    mysqlPool.query(sql, conditionMap, function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '查询项目版本信息时出错', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '查询项目版本信息成功', result, null));
        }
    });
}

/**
 * 保存项目部署信息
 * @param conditionMap
 * @param cb
 */
exports.saveDeployInfo = function(conditionMap, cb){
    var sql = "insert into pass_develop_project_deploy(type,projectId,mesosId,version,clusterId,webSite,status,remark,createTime,createBy,updateTime) values('1',?,?,?,?,?,'1',?,now(),?,now())";
    mysqlPool.query(sql, conditionMap, function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '保存项目部署信息出错', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '保存项目部署信息成功', result, null));
        }
    });
}
/**
 * 删除已部署应用
 * @param conditionMap
 * @param cb
 */
exports.deleteDeployInfo = function(id, cb){
    var sql = "delete from pass_develop_project_deploy where id=?";
    mysqlPool.query(sql, [id], function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除项目部署信息出错', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '删除项目部署信息成功', result, null));
        }
    });
}

exports.updateDeployStatus = function(conditionMap,cb){
    var sql = "update pass_develop_project_deploy set status=?,healthStatus=?,resources=?,hostName=?,hostIp=?,containerId=?,containerName=? where id=?";
    mysqlPool.query(sql, conditionMap, function(err, result){
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新运行状态失败', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新运行状态失败', null, null));
        }
    });
}

exports.queryDetailTree = function(projectId,cb){
    var sql = "select * from pass_project_service_detail where projectId = ? ";
    mysqlPool.query(sql, [projectId], function(err, results){
        if(err) {
            cb(utils.returnMsg(false, '1000', '保存项目部署信息出错', null, err));
        } else {
            if(results && results.length > 0){
                var trees = [];
                for(var i=0;i<results.length;i++){
                    var parentMap = {};
                    var childMap = {};
                    var childs = [];
                    parentMap.id = results[i].id;
                    parentMap.text = results[i].menuName;
                    for(var j = 0;j<results.length;j++){
                        if(results[j].parentId && results[i].id == results[j].parentId){
                            childMap.id = results[j].id;
                            childMap.text = results[j].menuName;
                            childs.push(childMap);
                        }
                    }
                    parentMap.children = childs;
                    trees.push(parentMap);
                }
                cb(trees);
            }else{//无数据，先插入父节点，再查询
                var pv = ["文档说明","术语","接口规则","流程场景","API列表","错误码","SDK下载"];
                var j = 0;
                addParent(pv,j,'',projectId,cb);
            }
        }
    });
}

function addParent(pv,j,parentId,projectId,cb){
    var sql = "insert into pass_project_service_detail(menuName,projectId,createTime,createUser) values(?,?,now(),?)";
    if(pv.length > j){
        var data = [];
        data.push(pv[j]);
        data.push(projectId);
        data.push("admin");
        mysqlPool.query(sql, data, function(err, result){
            if(err) {
            } else {
                if(pv.length-1 == j){
                    var psql = "select * from pass_project_service_detail where projectId = ? ";
                    mysqlPool.query(psql, [projectId], function(err, results){
                        if(err) {
                            cb(new Array());
                        } else {
                            if(results && results.length > 0){
                                var trees = [];
                                var parentMap = {};
                                for(var i=0;i<results.length;i++){
                                    var childs = [];
                                    parentMap.id = results[i].id;
                                    parentMap.text = results[i].menuName;
                                    parentMap.children = childs;
                                    trees.push(parentMap);
                                }
                                cb(trees);
                            }
                        }
                        addParent(pv,++j,parentId,projectId,cb);
                    });
                }else{
                    addParent(pv,++j,parentId,projectId,cb);
                }
            }
        });
    }
}

exports.refreshDeployedInfo = function(id, mesosId){
    var url = config.platform.marathonApi  + "/" + mesosId;
    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        res.setEncoding('utf8');
        var chtmlJson = '';
        res.on('data', function (chunk) {//拼接响应数据
            chtmlJson += chunk;
        });
        res.on('end', function () {
            console.log(mesosId + "返回数据为:" + chtmlJson);
            var json = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
            if (json && json.app && json.app.tasks.length != 0) {
                //健康的实例大于1，就认为应用健康
                var status = json.app.tasksHealthy > 0 ? 1 : 0;
                //不健康，需要写入告警信息到告警表
                if(status == 0){
                    var title = "marathon告警信息";
                    var ruleId = "";
                    var ruleName = "";
                    var ruleUrl = "";
                    var state = "";
                    var imageUrl = "";
                    var message = mesosId + "健康检查结果为：服务不可用";
                    var appId = mesosId;
                    var params = [];
                    params.push(appId);
                    params.push("2");// 1 grafana 告警 2 应用监控告警
                    params.push(title);
                    params.push(ruleId);
                    params.push(ruleName);
                    params.push(ruleUrl);
                    params.push(state);
                    params.push(imageUrl);
                    params.push(message);
                    params.push("1");//1 有效 0 无效
                    alertService.save(params,function(err,result){
                        if(!result.success){
                            console.log("同步告警信息到高竞标失败");
                        }else{
                            console.log("同步告警信息到高竞标成功");
                        }
                    });
                }
                var resources = "";
                var instances = json.app.instances;
                if(instances == 0){//实例个数为0
                    resources  = "实例:0个<br>CPU:0个<br>内存:0M";
                    var params = [];
                    params.push(status);
                    params.push(resources);
                    params.push("");
                    params.push("");
                    params.push("");
                    params.push("");
                    params.push(id);
                    mysqlPool.query("update pass_develop_project_deploy set healthStatus=?,resources=?,hostName=?,hostIp=?,containerId=?,containerName=? where id=?", params, function(err, result){
                        if(err){
                            console.log("更新已部署应用健康度等信息异常");
                        }else{
                            console.log("更新已部署应用健康度等信息成功");
                        }
                    });
                }else{
                    var cpus = json.app.cpus;
                    var mem = json.app.mem;
                    var disk = json.app.disk;
                    resources  = "实例:" + instances + "个<br>CPU:" + instances * cpus + "个<br>内存:" + mem * instances + "M";
                    //默认只读取第一个实例
                    var taskId = json.app.tasks[0].id;
                    var host = json.app.tasks[0].host;
                    exports.httpGetContainerInfo(id, mesosId, status, resources, taskId, host);
                }
            } else {
                console.log(mesosId + "接口数据异常");
            }
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

exports.httpGetContainerInfo = function(id, mesosId, status, resources,taskId, hostName){
    var params = [];
    params.push(hostName);
    /*mysqlPool.query("select * from pass_operation_host_info where name=?",params,function(err,result){
        if(err || result == null || result.length == 0){
            console.log("根据host查询IP异常" );
        }else{
            var hostIp = result[0].ip;*/
            var hostIp = "";
            var path = "/containers/json?all=1";
            var filters = "{\"label\":[\"MESOS_TASK_ID=" + taskId + "\"]}";
            path = path + "&filters=" + filters;
            var options = {
                host:hostName,
                port:2375,
                path:path
            };
            http.get(options, function(res) {
                console.log("Got response: " + res.statusCode);
                res.setEncoding('utf8');
                var chtmlJson = '';
                res.on('data', function (chunk) {//拼接响应数据
                    chtmlJson += chunk;
                });
                res.on('end', function () {
                    console.log("根据label查询容器返回数据为:" + chtmlJson);
                    var json = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
                    if (json && json.length != 0) {
                        var containerId = json[0].Id;
                        var containerName = json[0].Names[0].replace("/","");
                        var params = [];
                        params.push(status);
                        params.push(resources);
                        params.push(hostName);
                        params.push(hostIp);
                        params.push(containerId);
                        params.push(containerName);
                        params.push(id);
                        mysqlPool.query("update pass_develop_project_deploy set healthStatus=?,resources=?,hostName=?,hostIp=?,containerId=?,containerName=? where id=?", params, function(err, result){
                            if(err){
                                console.log("更新已部署应用健康度等信息异常");
                            }else{
                                console.log("更新已部署应用健康度等信息成功");
                            }
                        });
                        //同步数据到influxDB
                        syncData2InfluxDB(mesosId, hostName, hostIp, containerId, containerName);
                    } else {
                        console.log(mesosId + "接口数据异常");
                    }
                });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });
        /*}*/
    /*});*/
}

/**
 * 刷新marathon-lb地址
 */
exports.refreshMarathonLbInfo = function(){
    var url = config.platform.marathonApi  + "/marathon-lb";
    http.get(url, function(res) {
        console.log("Got response: " + res.statusCode);
        res.setEncoding('utf8');
        var chtmlJson = '';
        res.on('data', function (chunk) {//拼接响应数据
            chtmlJson += chunk;
        });
        res.on('end', function () {
            console.log("接口查询/marathon-lb地址返回数据为:" + chtmlJson);
            var json = JSON.parse(chtmlJson);//将拼接好的响应数据转换为json对象
            if (json && json.app && json.app.tasks.length != 0) {
                var host = json.app.tasks[0].host;
                config.platform.marathonLb = "http://" + host;
            } else {
                console.log("接口查询/marathon-lb地址返回数据为数据异常");
            }
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function syncData2InfluxDB(appName,hostName,hostIp,containerId,containerName){
    var request = require("request");
    const Influx = require('influxdb-nodejs');
    const client = new Influx(config.platform.influxDB);

    const fieldSchema = {
        value:'string'
    };
    const tagSchema = {
        app_name:'*',
        container_name:'*',
        container_id:'*',
        host_ip:'*',
        host_name:'*'
    };
    client.schema('dockermapping', fieldSchema, tagSchema, {
        // default is false
        stripUnknown: true,
    });
    client.write('dockermapping')
        .tag({
            app_name:appName.replace("/",""),
            container_name:containerName,
            container_id:containerId,
            host_ip:hostName,
            host_name:hostName
        })
        .field({
            value:'1'
        })
        .then(console.info('write point success'))
        .catch(console.error);
}