
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
    var sql = "select * from pass_operation_colony_info ";
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
    var sql = "insert into pass_operation_colony_info(name,remark,createTime,createUser,mesosUrl,marathonUrl) values(?,?,now(),?,?,?)";
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
    var sql = "update pass_operation_colony_info set name = ?,remark = ?,mesosUrl = ?,marathonUrl = ?, where id = ? ";
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

exports.comboboxList = function(data, cb){
    var sql = "select * from pass_operation_colony_info where status = '1' and name is not null order by createTime desc";
    mysqlPool.query(sql,[],function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取集群列表失败', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取集群列表成功', result, null));
        }
    });
}
/**
 * 同步集群资源
 */
exports.syncColonyInfo = function(){
    var url = config.platform.mesosHost + "/metrics/snapshot";
    var http = require("http");
    http.get(url, function(resp){
        if(resp.statusCode == 200){
            var rhtml = '';
            resp.setEncoding('utf8');
            resp.on('data', function (chunk) {
                rhtml += chunk;
            });
            resp.on('end', function () {
                //将拼接好的响应数据转换为json对象
                rhtml = rhtml.replace(new RegExp("\\\\/","gm"),"_");
                var json = JSON.parse(rhtml);
                if(json){
                    var diskTotal = json.allocator_mesos_resources_disk_total;
                    var diskUsed = json.allocator_mesos_resources_disk_offered_or_allocated;
                    diskUsed = diskUsed < 100 * 1024 ? 120 * 1124 : diskUsed;
                    var memTotal = json.allocator_mesos_resources_mem_total;
                    var memUsed = json.allocator_mesos_resources_mem_offered_or_allocated;
                    var cpuTotal = json.allocator_mesos_resources_cpus_total;
                    var cpuUsed = json.allocator_mesos_resources_cpus_offered_or_allocated;
                    //CPU：10核（42%） </br>内存：28GB（58%）</br>磁盘：50GB（41.6%）
                    var usage = "CPU:" + cpuUsed + "核(" +  (cpuUsed * 100/cpuTotal).toFixed(3) + "%)</br>" + "内存:" + (memUsed/1024).toFixed(3) + "GB(" + (memUsed * 100 / memTotal).toFixed(3) + "%)</br>磁盘:" + (diskUsed / 1024).toFixed(3) + "GB(" + (diskUsed / diskTotal).toFixed(3) + "%)";
                    //CPU： 24核</br> 内存： 48 GB</br>磁盘： 120GB
                    var resource = "CPU:" + cpuTotal + "核</br>" + "内存:" + (memTotal/1024).toFixed(3) + "GB</br>磁盘:" + (diskTotal/1024).toFixed(3) + "GB";
                    console.log(usage);
                    console.log(resource);
                    var sql = "update pass_operation_colony_info set `usage`='" + usage + "',totalResource='" + resource + "' where 1=1";
                    console.log(sql);
                    mysqlPool.query(sql,[],function(err,result) {
                        if(err) {
                            console.log("更新集群资源信息失败");
                        } else {
                            console.log("更新集群资源信息成功");
                        }
                    });
                }
            });
        } else{
            console.log("更新集群资源信息失败2");
        }
    }).on('error',function(e){
        console.log("Got error: " + e.message);
    });
}