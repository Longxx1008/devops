
/**
 * Created by acer on 2017/5/11.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var https = require('https');
var nodegrass=require("nodegrass");
var Promise=require("bluebird");

exports.getHostName=function(){
    var content_type="application/x-www-form-urlencoded";
    var p= new Promise(function(resolve,reject){
        nodegrass.get('http://192.168.9.69:8086/query?q=SHOW+TAG+VALUES+FROM+%22cpu%22+WITH+KEY+%3D+%22host%22&db=telegraf',
            function (res, status, headers) {
                if (res) {
                    var result=JSON.parse(res);
                    var results=result.results[0].series[0].values;
                    // console.log(results);
                    if(results){
                        var arr=[];
                        for(var i in results){
                            arr.push(results[i][1])
                        }

                        resolve({"data":arr,"success":true,"error":null,"message":null});
                    }else{

                        resolve({"data":null,"success":false,"error":null,"message":null});
                    }

                }else {
                    resolve({"data":null,"success":false,"error":null,"message":null});
                }
            },
            content_type,
            null,
            'utf8').
        on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({"data":null,"success":false,"error":e,"message":null});
        });
    });
    return p;
}

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




exports.getSyncHostInfo = function(id,cb){
    var sql = "select * from pass_operation_host_info where 1=1 and id='"+id+"'";
    console.log('获取单个主机信息:'+sql);
    mysqlPool.query(sql,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取单个主机信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取单个主机信息成功', result, null));
        }
    });
}