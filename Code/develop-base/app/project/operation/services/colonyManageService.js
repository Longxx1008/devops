
/**
 * Created by acer on 2017/5/11.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var https = require('https');

/**
 * 分页查询
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page,size,conditionMap,cb){
    var sql = "select * from pass_operation_colony_info";
    var conditions = [];
    var orderSql = " order by id desc";
    console.log("查询集群信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,conditions,cb);
};

/**
 * 获取单个集群
 * @param data
 * @param cb
 */
exports.getColony = function(id,cb){
    var sql = "select * from pass_operation_colony_info where id = ? ";
    mysqlPool.query(sql,[id],function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取单个集群信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取单个集群信息成功', result, null));
        }
    });
}

/**
 * 新增集群
 * @param data
 * @param cb
 */
exports.add = function(data,cb){
    var sql = "insert into pass_operation_colony_info(name,remark,createTime,createUser) values(?,?,now(),?)";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '创建集群信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '创建集群信息成功', result, null));
        }
    });
}

/**
 * 更新集群信息
 * @param data
 * @param cb
 */
exports.update = function(data,cb){
    var sql = "update pass_operation_colony_info set name = ?,remark = ? where id = ? ";
    mysqlPool.query(sql, data, function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新集群信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新集群信息成功', result, null));
        }
    });
}

/**
 * 删除集群信息
 * @param id
 * @param cb
 */
exports.delete = function(id, cb) {
    var sql = "delete from pass_operation_host_info where colonyId = ?";
    var colonysql = "delete from pass_operation_colony_info where id = ?";
    mysqlPool.query(sql,[id],function (err,result) {
        if(err){
            cb(utils.returnMsg(false,'1000','删除集群主机信息异常',null,err));
        }else{
            mysqlPool.query(colonysql,[id],function(err,colonyresult) {
                if(err) {
                    cb(utils.returnMsg(false, '1000', '删除集群主机成功，删除集群信息异常', null, err));
                } else {
                    cb(utils.returnMsg(true, '0000', '删除集群信息成功', colonyresult, null));
                }
            });
        }
    })

}