
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
exports.pageList = function(page,size,ids,cb){
    var sql = "select * from pass_operation_host_info where 1=1 ";

    var conditions = [];
    if(ids){
        sql += " and id in  ("+ids.toString()+")  "
        var orderSql = " order by id desc ";
        console.log("查询集群主机信息sql ====",sql);
        utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,conditions,cb);
    }else{
        sql += " and 1=0 "
        var orderSql = " order by id desc ";
        console.log("查询集群主机信息sql ====",sql);
        utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,conditions,cb);
    }

};

/**
 * 获取单个主机
 * @param data
 * @param cb
 */
exports.getHost = function(id,cb){
    var sql = "select * from pass_operation_host_info where id = ? ";
    mysqlPool.query(sql,[id],function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取单个主机信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取单个主机信息成功', result, null));
        }
    });
}

/**
 * 新增主机
 * @param data
 * @param cb
 */
exports.add = function(data,cb){
    var sql = "insert into pass_operation_host_info(name,configure,os,ip,colonyId,remark,createTime,createUser) values(?,?,?,?,?,?,now(),?)";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '创建主机信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '创建主机信息成功', result, null));
        }
    });
}

/**
 * 更新主机信息
 * @param data
 * @param cb
 */
exports.update = function(data,cb){
    var sql = "update pass_operation_host_info set name=?,configure=?,os=?,ip=?,cpu=?,memory=?,disk=?,status=?,remark=? where id = ? ";
    mysqlPool.query(sql, data, function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新主机信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新主机信息成功', result, null));
        }
    });
}

/**
 * 删除主机信息
 * @param id
 * @param cb
 */
exports.delete = function(id, cb) {
    var sql = "delete from pass_operation_host_info where id = ?";
    mysqlPool.query(sql,[id],function (err,result) {
        if(err){
            cb(utils.returnMsg(false,'1000','删除集群主机信息异常',null,err));
        }else{
            cb(utils.returnMsg(true, '0000', '删除主机信息成功', result, null));
        }
    })

}