
/**
 * Created by acer on 2017/5/11.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var nodeGrass=require("nodegrass");
var https = require('https');

/**
 * 分页查询
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page,size,conditions,cb){
    var sql = "select * from pass_operation_host_info where 1=1 ";

    var conditions = [];
    var orderSql=" order by name ";
    console.log("查询集群主机信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,conditions,cb);
   /* if(ids){
        sql += " and id in  ("+ids.toString()+")  "
        var orderSql = " order by slave_ip asc ";
        console.log("查询集群主机信息sql ====",sql);
        utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,conditions,cb);
    }else{
        sql += " and 1=0 "
        var orderSql = " order by slave_ip asc ";
        console.log("查询集群主机信息sql ====",sql);
        utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,conditions,cb);
    }*/

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

/**
 * 同步集群主机资源
 */
exports.syncHostInfo = function(){
    var url = config.platform.mesosHost + "/slaves";
    nodeGrass.get(url, function(data){
        data=eval('('+data+')');
        console.log(data.slaves[0].id);
        var hostId=new Array();
        var hostName=new Array();
        var cpu=new Array();
        var memory=new Array();
        var disk=new Array();
        var cpu_used=new Array();
        var memory_used=new Array();
        var disk_used=new Array();
        var status=new Array();
        for(var i in data.slaves){
            hostId.push(data.slaves[i].id);
            hostName.push(data.slaves[i].hostname);
            cpu.push(data.slaves[i].resources.cpus);
            memory.push(data.slaves[i].resources.mem);
            disk.push(data.slaves[i].resources.disk);
            cpu_used.push(data.slaves[i].used_resources.cpus);
            memory_used.push(data.slaves[i].used_resources.mem);
            disk_used.push(data.slaves[i].used_resources.disk);
            status.push(data.slaves[i].active);
        }
        //容器时间要晚8小时，所以时间加了8小时
        for(var i in hostId) {
            var sql = "update pass_operation_host_info set id=\""+hostId[i]+"\",name=\""+hostName[i]+"\",cpu=\""+cpu[i]+"\",memory=\""+memory[i]+"\",disk=\""+disk[i]+"\",memory_used=\""+memory_used[i]+"\",disk_used=\""+disk_used[i]+"\",cpu_used=\""+cpu_used[i]+"\",updateTime=DATE_FORMAT(date_add(CURTIME(), interval 8 hour),\"%Y-%m-%d %H:%i:%s\"),status=\""+status[i]+"\" where name=\""+hostName[i]+"\"";
            console.log(sql);
            mysqlPool.query(sql, [], function (err, result) {
                if (err) {
                    console.log("更新集群主机资源信息失败");
                } else {
                    console.log("更新集群主机资源信息成功");
                }
            });
        }
    })
}