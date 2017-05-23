
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var mysql = require('mysql');
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var childNodeMap=new HashKey();
// 使用连接池，提升性能


//查询树集合
exports.list = function(conditionMap, cb){
    //查找二级节点的函数（把所有查询结构在二级节点查询结果中，通过回调函数全部 组装成tree对应的数据）
    //查询一级节点的sql  也是测试是否存在该projectId相关数据的sql
    var sql = "select * from pass_project_service_detail where 1=1 and parentId is null and projectId=?";
    mysqlPool.query(sql,[conditionMap.projectId],function(err,results) {
        if(err){
            cb( {msg:'查询树一级节点信息异常'});
        }else{
            if(results.length>0){
                //根据projectId信息查询的一级节点存在
                // 继续查询查询二级节点
                findNodeByProjectId(conditionMap.projectId,cb);
            }else{
                //根据projectId信息查询的一级节点不存在
                //插入默认的一级节点
                //数据返回和组装放在insertParentNode中作为回调函数处理
                insertParentNode(conditionMap.projectId,cb);
            }
        }
    });
};


function insertParentNode(projectId,cb){
    var sql="insert into pass_project_service_detail ( projectId,menuName) values(?,?)";
    var array=["文档署名", "术语", "接口规则", "流程场景", "API列表", "错误码", "SDK下载"];
    for (var i=0;i<array.length;i++){
        mysqlPool.query(sql,[projectId,array[i]],function(err,result){
            if(err){
                cb ({msg:'插入树一级节点信息异常'});
            }else{
                findNodeByProjectId(projectId,cb);
            }
        });
    }
}

//
function findNodeByProjectId(projectId,cb){
    var sql="select t.id,t.menuName,case WHEN t.status=0 then 'open' when t.status=1 then 'closed' end as state from pass_project_service_detail t where 1=1 and t.parentId is null and t.projectId=?";
    var map=new HashKey();
    mysqlPool.query(sql,[projectId],function(err,result){
        if(err){
         cb({msg:'查询树一级节点信息异常'});
        }else{
            for (var i=0;i<result.length;i++){
                var data = JSON.parse(JSON.stringify(result[i]));
                map.set(data.id,null);
            }
            assembleTreeDate(result,map,cb);
        }
    });

}


//按照easyui的格式要求组装数据
function assembleTreeDate(parentNodeData,map,cb){
    var firstArray=new Array();
    for(var i=0;i<parentNodeData.length;i++){
       var parentData = JSON.parse(JSON.stringify(parentNodeData[i]));
       var first=new HashKey();
       first.set("id",parentData.id);
       first.set("text",parentData.menuName);
       first.set("state",parentData.state);
       var childResult=map.get(parentData.id);
       console.log("childResult    assemble tree data     test ");
       console.info(childResult);
       firstArray.push(first.out());
       console.log(firstArray);
    }
    console.log("执行顺序    5      ；")
    cb( firstArray);
}

function HashKey(){
    var data = {};
    this.set = function(key,value){   //set方法
        data[key] = value;
    };
    this.unset = function(key){     //unset方法
        delete data[key];
    };
    this.get = function(key){     //get方法
        return data[key] || "";
    };
    this.out=function(){
        return data;

    }
}


//增加节点
exports.addchild = function(dataMap, cb) {
    console.log("zzzzzzz:"+dataMap);
    var temp=[];
    var data=[];
    var sql_select="select * from pass_project_service_detail where id="+dataMap.parentId;
    var projectId='';
    var sql = "insert into pass_project_service_detail (parentId,projectId) values(?,?)";
    console.log("zzzz22222"+sql)
    mysqlPool.query(sql_select,temp,function(err,results) {
        if(err) {
            console.log("zzzz22222"+err)
            cb(utils.returnMsg(false, '1000', '创建项目信息异常', null, err));
        } else {
            if(results){
                console.log("=============================================");
                console.log(results);
                console.log("=============================================");
                projectId=results[0].projectId;
                data.push(dataMap.parentId);
                data.push(projectId);
                mysqlPool.query(sql,data,function(err,result){
                   if(err){
                       console.log(err);
                       cb(utils.returnMsg(false, '1000', '创建项目信息异常', null, err));
                   } else{
                       cb(utils.returnMsg(true, '0000', '创建项目信息成功', result, null));
                   }
                });
            }
        }
    });
};
exports.updatechild = function(data, cb) {
    var sql = "update pass_project_service_detail set menuName=?, createUser=? , createTime=now() where id=? ";
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            console.log(err);
            cb(utils.returnMsg(false, '1000', '更新项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新项目信息成功', results, null));
        }
    });
};
exports.selectContent = function(data, cb) {
    var sql = "select t.content from pass_project_service_detail t where id=? ";
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            console.log(err);
            cb(utils.returnMsg(false, '1000', '查询项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '查询项目信息成功', results, null));
        }
    });
};

exports.selectChild = function(data, cb) {
    var sql = "select t.id,t.menuName,case WHEN t.status=0 then 'open' when t.status=1 then 'closed' end as state from pass_project_service_detail t where parentId=? ";
    var map=new HashKey();
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            console.log(err);
            cb(utils.returnMsg(false, '1000', '查询项目信息异常', null, err));
        } else {
            if(results.length>0){

            }
            cb(utils.returnMsg(true, '0000', '查询项目信息成功', results, null));
        }
    });
};

exports.updateContent = function(data, cb) {
    var sql = "update pass_project_service_detail set content=? where id=?";
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            console.log(err);
            cb(utils.returnMsg(false, '1000', '更新项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新项目信息成功', null, null));
        }
    });
};

exports.deleteNode = function(id, cb) {
    var data=[];
    var sql = "delete from pass_project_service_detail where id="+id;
    var sqlParentId="delete from pass_project_service_detail where parentId="+id;
    console.log(sql);
    console.log(sqlParentId);
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            console.log(err);
            cb(utils.returnMsg(false, '1000', '删除项目信息异常', null, err));
        } else {
            mysqlPool.query(sqlParentId,data,function(err,result){
                if(err){
                    console.log(err);
                    cb(utils.returnMsg(false, '1000', '删除项目信息异常', null, err));
                }else{
                    cb(utils.returnMsg(true, '0000', '删除项目信息成功', results, null));
                }
            });

        }
    });
};


// exports.add = function(data, cb) {
//     var sql = "insert into pass_develop_project_resources(projectCode,projectName,gitAddress,healthCondition,resourceUse,remark,createTime,createUser,projectType,gitlabProjectId) values(?,?,?,?,?,?,now(),?,?,?)";
//     mysqlPool.query(sql,data,function(err,results) {
//         if(err) {
//             cb(utils.returnMsg(false, '1000', '创建项目信息异常', null, err));
//         } else {
//             cb(utils.returnMsg(true, '0000', '创建项目信息成功', null, null));
//         }
//     });
// };
//
// /**
//  * 更新项目信息
//  * @param data
//  * @param cb
//  */
// exports.update = function(data, cb) {
//     var sql = "update pass_develop_project_resources set projectCode = ?,projectName = ?,gitAddress = ?,healthCondition = ?,resourceUse = ?,remark = ?,projectType = ? where id = ?";
//     mysqlPool.query(sql, data, function(err,results) {
//         if(err) {
//             cb(utils.returnMsg(false, '1000', '更新项目信息异常', null, err));
//         } else {
//             cb(utils.returnMsg(true, '0000', '更新项目信息成功', null, null));
//         }
//     });
// };
//
// /**
//  * 删除项目信息
//  * @param id
//  * @param cb
//  */
// exports.delete = function(id, cb) {
//     var sql = "delete from pass_develop_project_resources where id = ?";
//     mysqlPool.query(sql,[id],function(err,results) {
//         if(err) {
//             cb(utils.returnMsg(false, '1000', '删除项目信息异常', null, err));
//         } else {
//             cb(utils.returnMsg(true, '0000', '删除项目信息成功', null, null));
//         }
//     });
// }

exports.queryDetailTree = function(projectId,cb){
    var sql = "select * from pass_project_service_detail where projectId = ? ";
    mysqlPool.query(sql, [projectId], function(err, results){
        if(err) {
            cb(utils.returnMsg(false, '1000', '保存项目部署信息出错', null, err));
        } else {
            if(results && results.length > 0){
                var trees = [];
                for(var i=0;i<results.length;i++){
                    if(!results[i].parentId){
                        var parentMap = {};

                        var childs = [];
                        parentMap.id = results[i].id;
                        parentMap.text = results[i].menuName;
                        for(var j = 0;j<results.length;j++){
                            if(results[j].parentId && results[i].id == results[j].parentId){
                                var childMap = {};
                                childMap.id = results[j].id;
                                childMap.text = results[j].menuName;
                                childMap.parentId=results[j].parentId;
                                childs.push(childMap);
                            }
                        }
                        parentMap.children = childs;
                        trees.push(parentMap);
                    }
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

                                for(var i=0;i<results.length;i++){
                                    var parentMap = {};
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
