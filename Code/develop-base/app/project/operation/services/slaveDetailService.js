
/**
 * Created by acer on 2017/5/11.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var https = require('https');
var nodegrass=require("nodegrass");
var Promise=require("bluebird");

exports.getResourceBySlave = function(name) {
    var p = new Promise(function(resolve, reject){
        var sql = "select * from pass_operation_host_info a where 1=1 and a.name='" + name + "'  ORDER BY a.updateTime;"
        mysqlPool.query(sql, function (err, results) {
            if (err) {
                console.log(err);
                resolve({"error": err, "code": 1001, "message": "查询数据失败！", "data": null, "success": false});
            } else {
                console.log(results);
                resolve({"error": null, "code": 0000, "message": "查询数据成功！", "data": results, "success": true});
            }
        });

    })

    return p;

}




exports.getSyncHostInfo = function(id){
    var REQ_HEADERS = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    var p = new Promise(function(resolve,reject){
        var sql = "select * from pass_operation_host_info where 1=1 and id= "+id;
        mysqlPool.query(sql,function(err,results){
            if(err){
                console.log(err);
                resolve({"error": err, "code": 1001, "message": "查询数据失败！", "data": null, "success": false});
            }else{
                if(results.length>0){
                    var master_ip=reuslts[0].master_ip;
                    if(master_ip){
                        nodegrass.get("http://+"+master_ip+":5050/master/state.json",
                            function (res, status, headers) {
                                if (status=="200") {
                                    var all=JSON.parse(res);
                                    var slaves=all.slaves;
                                    console.log(slaves)
                                    resolve({"error": null, "code": 0000, "message": "获取meosos数据成功！", "data": slaves, "success": true})

                                }else{
                                    console.log("访问mesos失败 。");
                                    resolve({"error": err, "code": 1001, "message": "网络访问mesos失败 status :"+status+"！", "data": null, "success": false})

                                }
                            },
                            REQ_HEADERS,
                            {date: new Date()},
                            'utf8').
                        on('error', function (e) {
                            console.log("Got error: " + e.message);
                            resolve({"error": e.message, "code": 1001, "message": "网络访问mesos失败！", "data": null, "success": false})
                        });


                    }else{
                        resolve({"error": null, "code": 1001, "message": "查询主机IP失败！", "data": null, "success": false})

                    }

                }else{

                    resolve({"error": null, "code": 1001, "message": "查询数据失败！", "data": null, "success": false})
                }
            }
        })
    })
    return p ;
}