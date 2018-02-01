var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var nodeGrass = require('../../utils/nodegrass');
var config = require('../../../../config');
var alertService = require('./alertService');
var http = require('http');
var mysql = require('mysql');
var ng=require("nodegrass");
var $util = require('../../../common/util/util');
var marathon_add="192.168.9.61";
var marathon_port="8080";
var superagent=require("superagent");
var Promise=require("bluebird");
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));

/**
 * 获取项目的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page, size, conditionMap, cb) {
    //var sql = " select t1.*,d.version as deployVersion,d.gray_version from pass_develop_project_resources t1 left join pass_develop_project_deploy d on t1.id=d.projectId where 1=1";
    var sql="select p.gitlabProjectId,p.id,p.projectCode,p.projectName,d.gray_version,d.blue_version,d.formal_version from pass_develop_project_resources_copy2 p left join (select formal_version,gray_version,blue_version,projectName from pass_develop_project_deploy_copy2 where formal_version is not null) d on d.projectName=p.projectName where 1=1"
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectCode) {
            sql += " and (p.projectCode like '%" + conditionMap.projectCode + "%')";
        }
        if(conditionMap.projectName) {
            sql += " and (p.projectName like '%" + conditionMap.projectName + "%')";
        }
    }
    var orderBy = " order by gitlabProjectId desc";
    console.log("查询项目信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

//获取项目版本数据
exports.versionList = function(conditionMap, cb) {
    var sql = " select t.* from pass_develop_project_versions_copy2 t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.projectId) {
            sql += " and t.projectId=?";
            condition.push(conditionMap.projectId);
        }
    }
    sql += " order by t.id desc";
    console.log(sql);
    // 查询数据库默认版本数据
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取版本信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取版本信息成功', verAarry(results), null));
        }
    });
}
function verAarry(data){
    var arr = [];
    for(var i=0;i<data.length;i++){
        arr.push(data[i].versionNo);
    }
    //进行倒序排序
    arr.sort(function(o1,o2){
        var a1 = o1.replace('v','').split('.');
        var a2 = o2.replace('v','').split('.');
        var length = Math.max(a1.length,a2.length);
        for(var i = 0; i < length; i++){
            var n1 = parseInt(a1[i] || 0);
            var n2 = parseInt(a2[i] || 0);
            if(n1 - n2 != 0){
                return n2 - n1;
            }
        }
    });

    var datanew = [];
    for(var j=0;j<arr.length;j++){
        datanew.push({"versionNo":arr[j]});
    }
    return datanew;
}
//获取项目进度情况
exports.projectProcess = function(cb) {
    var sql = " select sum(case WHEN step = 1 then 1 else 0 end) as developNum,sum(case WHEN step = 2 then 1 else 0 end) as testNum," +
        "sum(case WHEN step in (3,4) then 1 else 0 end) as deployNum,sum(case WHEN step in (3,4) then 1 else 0 end) as operationNum  " +
        "from pass_develop_project_resources where type = '1'";
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

    /*var sql="select * from (SELECT r.projectName,g.* FROM pass_develop_project_gray_deploy g,pass_develop_project_resources_copy2 r WHERE g.gitlabProjectId = r.gitlabProjectId UNION ALL"+
        " SELECT r.projectName,f.* FROM pass_develop_project_formal_deploy f,pass_develop_project_resources_copy2 r WHERE f.gitlabProjectId = r.gitlabProjectId) g";*/
    var sql="select * from pass_project_app_info g";
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectName) {
            sql += " and (g.projectName like '%" + conditionMap.projectName + "%')";
        }
    }
    var orderBy = " order by g.id desc";
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

exports.fdeployedPageList = function(page, size, conditionMap, cb) {
    /*  var sql = "select a.*,case  when da.alertNum is NULL then 0 else da.alertNum end alertNum from ( select t1.*,\"" + config.platform.marathonLb + "\" as marathonLB, t2.projectCode,t2.projectName from pass_develop_project_deploy t1,pass_develop_project_resources t2 where t1.projectId = t2.id"+
          " ) a LEFT JOIN (select appId,count(appId) as alertNum from pass_develop_deploy_alert where status = '1' GROUP BY appId) da ON a.projectCode = da.appId where 1=1 ";*/
    var sql="select r.projectName,g.* from pass_develop_project_formal_deploy g,pass_develop_project_resources_copy2 r where g.gitlabProjectId=r.gitlabProjectId"
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.projectName) {
            sql += " and (r.projectName like '%" + conditionMap.projectName + "%')";
        }
    }
    var orderBy = " order by r.id desc";
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
            var projectId = result.insertId;
            var condition=[projectId];
            var sqlInsertMysql="insert into pass_project_service_monitor (projectId,serviceName,type,monitorPort,status,monitorUrl,createTime) value(?,'mysql','数据库','192.168.9.48:3306','1','http://192.168.9.48:3000/dashboard/db/mysql-metrics?refresh=5s&orgId=1',now());";
            var sqlInsertMongdb="insert into pass_project_service_monitor (projectId,serviceName,type,monitorPort,status,monitorUrl,createTime) value(?,'mongodb','数据库','192.168.9.48:27017','1','http://192.168.9.48:3000/dashboard/db/mongodb-dashboard?refresh=5s&orgId=1',now())";
            mysqlPool.query(sqlInsertMysql,condition,function(errs,mresult){
                if(errs){
                    console.log(errs);
                } else{
                    mysqlPool.query(sqlInsertMongdb,condition,function(errors,rets){
                        cb(utils.returnMsg(true, '0000', '创建项目信息成功', result, null));
                    });
                }
            });
            
        }
    });
};

//从gitlab获取版本信息
exports.getVerByGitLab = function(gitProjectId,projectId,projectCode){
    var url = config.platform.gitlabUrl+'/api/v3/projects/'+gitProjectId+'/pipelines?private_token='+config.platform.private_token+'&scope=tags';
    nodeGrass.get(url,function(data,status,headers){
        // console.log(status);
        // console.log(data);
        var info = JSON.parse(data);//将拼接好的响应数据转换为json对象
        if (info) {
            var i = 0;
            forVersionInfo(info,i,projectId,projectCode);
        } else {
            console.log( '创建项目时 项目版本信息不存在...');
        }
    },'utf8').on('error', function(e) {
        console.log("Got error: " + e.message);
        console.log( '创建项目时 获取项目版本信息错误：'+e.message);
    });
    
}

function forVersionInfo(versions,i,projectId,projectCode){
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
                        // var results=[];
                        // var sql = "insert into pass_develop_project_versions(versionNo,projectId,createTime) values(?,?,now())";
                        // results.push(versions[i].ref);
                        // results.push(projectId);
                        // mysqlPool.query(sql,results,function(err,result) {
                        //     if(err) {
                        //         console.log( '创建项目时 插入gitlab相关项目版本信息异常...');
                        //     } else {
                        //         console.log('创建项目时 插入gitlab相关项目版本信息成功...');
                        //     }
                        //     forVersionInfo(versions,++i,projectId,projectCode);
                        // });
                        getDeployJson(versions,i,projectId,projectCode);
                    }else{
                        forVersionInfo(versions,++i,projectId,projectCode);
                        console.log( '创建项目时 项目版本信息已存在...');
                    }
                }
            });
        }else{
            forVersionInfo(versions,++i,projectId,projectCode);
        }
    }
}

function getDeployJson(versions,i,projectId,projectCode){
    var results=[];
    var sql = "insert into pass_develop_project_versions(versionNo,projectId,deployJson,createTime) values(?,?,?,now())";
    results.push(versions[i].ref);
    results.push(projectId);
    //读取部署信息
    //http://192.168.9.48/cmcc/develop-base/raw/dev/architecture?pivate_token=BgNLAke5cybnRcqc-
    var url = config.platform.gitlabUrl + '/cmcc/' + projectCode + '/raw/dev/architecture?private_token=' + config.platform.private_token;
    nodeGrass.get(url,function(data,status,headers){
        console.log("--------------");
        results.push(data);
        mysqlPool.query(sql,results,function(err,results) {
            if(err) {
                console.log(' 插入gitlab相关项目版本信息异常...');
            } else {
                console.log(' 插入gitlab相关项目版本信息成功...');
            }
            forVersionInfo(versions, ++i, projectId, projectCode);
        });
    },'utf8').on('error', function(e) {
        console.log( '获取项目部署信息失败：'+e.message);
    });
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
            sql += " and t.projectId=? ";
            condition.push(conditionMap.projectId);
        }
    }
   var orderBy = ' order by t.id desc';
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
    var content_type="application/x-www-form-urlencoded";
    console.log(mesosId);
    ng.get("http"+"://"+marathon_add+":"+marathon_port+"/v2/apps/"+mesosId,
        function (res_deploy, status, headers) {
            // console.log(protocol+"://"+marathon_add+":"+marathon_port+"/v2/apps");
            // console.log(status);
            if (status=="200") {
                // console.log(mesosId + "返回数据为:" + res_deploy);
                var json = JSON.parse(res_deploy);//将拼接好的响应数据转换为json对象
                // console.log(json);
                if (json && json.app && json.app.tasks) {
                    //实例数为0 或者健康数为0
                    if(json.app.tasks.length != 0 || json.app.tasksHealthy == 0){
                        pool.getConnection(function (err, conn) {
                            if (err != null) {
                                console.log(err.message);
                            } else {
                                //更新应用状态为不正常
                                var healthStatus=json.app.tasksHealthy;
                                var cpus=json.app.cpus;
                                var mem=json.app.mem;
                                var instances=json.app.instances;
                                var resources  = "实例:"+instances+"个<br>CPU:"+cpus+"个<br>内存:"+mem+"M";
                                // var params = [];
                                params.push(json.app.tasksHealthy);
                                params.push(resources);
                                params.push("");
                                params.push("");
                                params.push("");
                                params.push("");
                                params.push(id);
                                var sql = "update pass_develop_project_deploy set healthStatus=?,resources=?,hostName=?,hostIp=?,containerId=?,containerName=? where id=?";
                                conn.query(sql,params,function (err, result) {
                                    if(err){
                                        console.log(err);
                                        console.log("更新已部署应用健康度等信息异常");
                                    }else {
                                        // console.log(result);
                                        console.log("更新已部署应用健康度等信息成功");
                                    }
                                    conn.release();
                                });
                            }
                        });
                        //写入告警信息到告警表
                        var title = "marathon告警信息";
                        var ruleId = "";
                        var ruleName = "";
                        var ruleUrl = "";
                        var state = "";
                        var imageUrl = "";
                        var message = mesosId + "健康检查结果为：服务不可用";
                        var appId = mesosId.replace("/","");
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
                        alertService.save(params,function(result){
                            if(!result.success){
                                console.log("同步告警信息到高竞标失败");
                            }else{
                                console.log("同步告警信息到高竞标成功");
                                exports.httpGetContainerInfo(id, mesosId, "1", resources, taskId, host);
                            }
                        });
                    }else{//应用健康
                        var resources = "";
                        var instances = json.app.instances;
                        var cpus = json.app.cpus;
                        var mem = json.app.mem;
                        var disk = json.app.disk;
                        resources  = "实例:" + instances + "个<br>CPU:" + instances * cpus + "个<br>内存:" + mem * instances + "M";
                        //默认只读取第一个实例
                        var taskId = json.app.tasks[0].id;
                        var host = json.app.tasks[0].host;
                        exports.httpGetContainerInfo(id, mesosId, "1", resources, taskId, host);
                    }
                } else {
                    console.log(mesosId + "接口数据异常");
                }

            }else if(status=="404") {
                ng.get("http"+"://"+marathon_add+":"+marathon_port+"/v2/groups/"+mesosId,
                    function (res, status, headers) {
                        // console.log(protocol+"://"+marathon_add+":"+marathon_port+"/v2/groups/"+mesosId);
                        console.log(status);
                        pool.getConnection(function (err, conn) {
                            if (status == "200") {
                                // console.log(mesosId + "返回数据为:" + res);
                                var json = JSON.parse(res);//将拼接好的响应数据转换为json对象
                                // console.log(json);
                                var apps = json.apps;
                                var tasksHealthy = "0";
                                var cpus = 0;
                                var mem = 0;
                                var disk = 0;
                                var instances = 0;
                                for (var i in apps) {

                                    var app = apps[i];
                                    // console.log("=====================>  ", app);
                                    instances += app.instances;
                                    cpus += (app.cpus)*(app.instances);
                                    mem +=(app.mem)*(app.instances);
                                    disk += (app.disk)*(app.instances);

                                    tasksHealthy = app.tasksHealthy
                                }

                                var resources = "实例:" + instances + "个<br>CPU:" + cpus + "个<br>内存:" + mem + "M";
                                var params = [];
                                params.push(tasksHealthy);
                                params.push(resources);
                                params.push("");
                                params.push("");
                                params.push("");
                                params.push("");
                                params.push(id);
                                var sql = "update pass_develop_project_deploy set healthStatus=?,resources=?,hostName=?,hostIp=?,containerId=?,containerName=? where id=?";
                                conn.query(sql, params, function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        console.log("更新已部署应用健康度等信息异常");
                                    } else {
                                        console.log(result);
                                        console.log("更新已部署应用健康度等信息成功");
                                    }
                                    conn.release();
                                });


                            }
                        })
                    },
                    content_type,
                    null,
                    'utf8').
                on('error', function (e) {
                    console.log("Got error: " + e.message);
                });


                // console.log("登录失败。");
            }
        },
        content_type,
        null,
        'utf8').
    on('error', function (e) {
        console.log("Got error: " + e.message);
    });


}

exports.httpGetContainerInfo = function(id, mesosId, status, resources,taskId, hostName){
    var params = [];
    console.log(id,mesosId,status,resources,taskId,hostName);

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
            console.log(options);
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
                console.log("marathon-lb当前运行地址为:" + host);
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


/**
 * 刷新mesos leader地址
 */
exports.refreshMesosInfo = function(){
    var url = config.platform.mesosHost + "/state";
    superagent.get(url).end(function(error,data){
        if(error){
            console.log("error exception occured while refresh mesos leader!");
            return next(error);
        }
        console.log("mesos leader地址为:!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+data.body.hostname);
        config.platform.mesosHost=data.body.hostname;
    });
}

/**
 * 更新marathon部署的项目到表，并根据部署项目id更新项目具体信息
 */
exports.refreshDeployed =function(cb){
    var projectId=new Array();//装marathon上面的项目id
    var projectName=new Array();//获取gitlab上面的项目名
    var project_id=new Array();//判断gitlab上面的项目名在marathon上是否部署
    var url = config.platform.marathonApi;
    //获取gitlab所有项目
    var url_git = config.platform.gitlabUrl+'/api/v3/projects?private_token='+config.platform.private_token;
    //读取gitlab部署信息
    //var url = config.platform.gitlabUrl + '/cmcc/' + projectCode + '/raw/dev/architecture?private_token=' + config.platform.private_token;
    //获取marathon上面的项目id
    var p = new Promise(function(resolve, reject) {
        nodeGrass.get(url, function (data) {
            data = eval('(' + data + ')');
            for (let i in data.apps) {
                projectId.push(data.apps[i].id);
            }
            //获取gitlab上项目名，并判断与marathon上是否对应
            nodeGrass.get(url_git, function (data) {
                data = eval('(' + data + ')');
                for (let i in data) {
                    for (let j in projectId) {
                        if (projectId[j].indexOf(data[i].name) >= 0) {
                            projectName.push(data[i].description);
                            project_id.push(parseInt(j));//marathon上有几个该项目部署，就要更新几次或者插入几次
                        }
                    }

                }
                console.log(projectName);
                console.log(project_id);
                for (let i in project_id) {
                    (function (i) {//用自执行函数传参，这样自执行函数内部形成了局部作用域，不受外部变量变化的影响，解决了js中for循环是同步任务的问题
                        var ifsql="select * from pass_develop_project_deploy_copy2 where projectId = '" + projectId[project_id[i]]+"'";
                        mysqlPool.query(ifsql, [], function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                if(result.length!=0){
                                    var sql = "update pass_develop_project_deploy_copy2 set projectId = '" + projectId[project_id[i]] + "',projectName='" + projectName[i] + "' where projectId = '" + projectId[project_id[i]]+"'"
                                    console.log(sql);
                                    mysqlPool.query(sql, [], function (err, result) {
                                        if (err) {
                                            console.log("更新部署项目id失败");
                                        } else {
                                            console.log("更新部署项目id成功");
                                        }
                                    });
                                }else{
                                    var sql="insert into pass_develop_project_deploy_copy2(projectId,projectName) values('"+projectId[project_id[i]]+"','"+ projectName[i]+"')";
                                    console.log(sql);
                                    mysqlPool.query(sql, [], function (err, result) {
                                        if (err) {
                                            console.log("更新部署项目id失败");
                                        } else {
                                            console.log("更新部署项目id成功");
                                        }
                                    });
                                }
                            }
                        });
                        //根据对应id获取marathon上的具体项目信息
                        var uri = config.platform.marathonApi + "/" + projectId[project_id[i]];
                        console.log(projectId[project_id[i]]);
                        nodeGrass.get(uri, function (data) {
                            data = eval('(' + data + ')');
                            var sql = "update pass_develop_project_deploy_copy2 set healthStatus='" + data.app.tasksHealthy + "',cpu='" + data.app.cpus + "',instance='" + data.app.instances + "',mem='" + data.app.mem + "',version='" + data.app.container.docker.image + "' where projectId='" + projectId[project_id[i]] + "'";
                            console.log(sql);
                            mysqlPool.query(sql, [], function (err, result) {
                                if (err) {
                                    console.log("更新部署项目id失败");
                                } else {
                                    console.log("更新部署项目id成功");
                                }
                            });
                        })
                    })(i);

                }
            })

        })
    })
}

/**
 * 项目管理页面，取得所有gitlab上的项目并且和marathon上做对比，判断是否部署在了marathon上面
 */
exports.refreshResource=function(){
    //获取gitlab上所有项目
    var url_git = config.platform.gitlabUrl+'/api/v3/projects?private_token='+config.platform.private_token;
    /*//marathon获取项目
    var url = config.platform.marathonApi;*/
    var names=new Array();//记录gitlab上面的项目名
    var projectCode=new Array();//项目编号
    var projectId=new Array();//项目id
    nodeGrass.get(url_git, function (data) {
        data = eval('(' + data + ')');
        for (let i in data) {
            (function (i) {
                names.push(data[i].description);
                projectCode.push(data[i].name);
                projectId.push(data[i].id);
                //判断resourse表是否有该项目
                var ifsql_resourse = "select * from pass_develop_project_resources_copy2 where projectName = '" + names[i] + "'";
                console.log(ifsql_resourse)
                mysqlPool.query(ifsql_resourse, [], function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.length != 0) {
                            var sql = "update pass_develop_project_resources_copy2 set projectCode = '" + projectCode[i] + "',projectName='" + names[i] + "',gitlabProjectId='" + projectId[i] + "' where projectName = '" + names[i] + "'"
                            console.log(sql + i);
                            mysqlPool.query(sql, [], function (err, result) {
                                if (err) {
                                    console.log("更新gitlab项目失败");
                                } else {
                                    console.log("更新gitlab项目成功");
                                }
                            });
                        } else {
                            var sql = "insert into pass_develop_project_resources_copy2(projectCode,projectName,gitlabProjectId) values('" + projectCode[i] + "','" + names[i] + "','" + projectId[i] + "')";
                            console.log(sql);
                            mysqlPool.query(sql, [], function (err, result) {
                                if (err) {
                                    console.log("插入gitlab项目失败");
                                } else {
                                    console.log("插入gitlab项目成功");
                                }
                            });
                        }

                    }
                }) //判断resourse表是否有该项目 end

                //读取gitlab部署版本信息,插入版本表或者更新版本表
                var url_git_version = config.platform.gitlabUrl + '/api/v3/projects/' + projectId[i] + '/repository/tags?private_token=' + config.platform.private_token;
                nodeGrass.get(url_git_version, function (data) {
                    console.log(url_git_version);
                    data = eval('(' + data + ')');
                    let version=new Array();//项目版本
                    for (let j in data) {
                        (function (j) {
                            version.push(data[j].name);
                            //判断版本表是否有该版本
                            var ifsql_version = "select * from pass_develop_project_versions_copy2 where versionNo = '" + version[j] + "' and projectId='" + projectId[i] + "'";
                            console.log(ifsql_version+i+j)
                            mysqlPool.query(ifsql_version, [], function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (result.length != 0) {
                                        var sql = "update pass_develop_project_versions_copy2 set versionNo = '" + version[j] + "',projectId='" + projectId[i] + "' where projectId = '" + projectId[i] + "' and versionNo = '" + version[j] + "'";
                                        console.log(sql);
                                        mysqlPool.query(sql, [], function (err, result) {
                                            if (err) {
                                                console.log("更新gitlab项目版本失败");
                                            } else {
                                                console.log("更新gitlab项目版本成功");
                                            }
                                        });
                                    } else {
                                        var sql = "insert into pass_develop_project_versions_copy2(versionNo,projectId) values('" + version[j] + "','" + projectId[i] + "')";
                                        console.log(sql);
                                        mysqlPool.query(sql, [], function (err, result) {
                                            if (err) {
                                                console.log("插入gitlab项目版本失败");
                                            } else {
                                                console.log("插入gitlab项目版本成功");
                                            }
                                        });
                                    }

                                }
                            })//判断版本表是否有该项目 end
                        })(j)
                    }
                })
            })(i)
        }
    })
}