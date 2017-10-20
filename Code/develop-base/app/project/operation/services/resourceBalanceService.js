/* 
create by wuhaitao 17.10.20
*/
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var mysql = require('mysql');
var $util = require('../../../common/util/util');
var nodeGrass=require("nodegrass");
var pool = mysql.createPool($util.extend({}, config.mysql));
var csv=require("csv");
var https = require('https');

/**
 * 分页查询
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page,size,conditionMap,cb){
    var sql = "select * from pass_develop_project_balance ";
    var conditions = [];
    var orderSql = " order by id desc";
    console.log("查询集群信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderSql,page,size,conditions,cb);
};


exports.getHaproxy=function(){
    var arr=[]
    var result={}
    var service_ip;
    nodeGrass.get('http://192.168.9.61:9090/haproxy?stats;csv', function (data, status, headers) {
        pool.getConnection(function (err, conn) {
            if (status == "200") {
                csv.parse(data, function(err, data){
                    csv.transform(data, function(data){
                        arr.push(data[1]);
                    }, function(err, data){
                        var service1_ip=arr[13]
                        service1_ip=service1_ip.replace(/_/g,".");
                        service1_ip = service1_ip.replace(/([^.]*).([^.]*)$/g, '$1:$2');
                        console.log(service1_ip);
                        var service2_ip=arr[14]
                        service2_ip=service2_ip.replace(/_/g,".");
                        service2_ip = service2_ip.replace(/([^.]*).([^.]*)$/g, '$1:$2');
                        console.log(service2_ip);
                        var service3_ip=arr[15]
                        service3_ip=service3_ip.replace(/_/g,".");
                        service3_ip = service3_ip.replace(/([^.]*).([^.]*)$/g, '$1:$2');
                        console.log(service3_ip);
                        service_ip=service1_ip+'<br>'+service2_ip+'<br>'+service3_ip
                        console.log(service_ip);
                        var sql='insert into pass_develop_project_balance(service_ip) values ("'+service_ip+'")'
                        console.log(sql);
                        conn.query(sql, function (err, result) {
                            if (err) {
                                console.log(err);
                                console.log("异常");
                            } else {
                                console.log(result);
                                console.log("成功");
                            }
                            conn.release();
                        });

                        csv.stringify(data, function(err, data){
                            process.stdout.write(data);
                        });
                    });
                });
            }
        })

    })
}
