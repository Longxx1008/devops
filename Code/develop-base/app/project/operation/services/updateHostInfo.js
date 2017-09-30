var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
var mysqlPool = require('../../utils/mysql_pool');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
var Promise=require("bluebird");
// var REQ_HEADERS = {
//     'Content-Type': 'application/json'
// };

var nodegrass=require("nodegrass");



exports.getSalve=function(){

     var p =new Promise(function(resolve,reject){
         var REQ_HEADERS = {
             'Content-Type': 'application/x-www-form-urlencoded'
         };
        nodegrass.get("http://192.168.9.65:5050/master/state.json",
            function (res, status, headers) {
                if (status=="200") {
                    var all=JSON.parse(res);
                    var slaves=all.slaves;
                    // console.info(all);
                    var master_id=all.id;
                    var master_ip=all.hostname;
                    var createUser=all.build_user;
                    var k=0;
                    var datas=[];
                    for(var i in slaves){
                        var data=[];
                        slave=slaves[i];
                        data.push(slave.id.toString());
                        data.push(slave.hostname.toString());
                        data.push(slave.port.toString());
                        data.push(slave.pid);
                        data.push("Linux");
                        data.push(slave.resources.cpus.toString());
                        data.push(slave.resources.mem.toString());
                        data.push((slave.resources.gpus)?slave.resources.gpus.toString():"0");
                        data.push(slave.resources.disk.toString());
                        data.push((slave.used_resources.cpus)? slave.used_resources.cpus.toString():"0");
                        data.push((slave.used_resources.mem)?slave.used_resources.mem.toString():"0");
                        data.push((slave.used_resources.disk)?slave.used_resources.disk.toString():"0");
                        data.push((slave.used_resources.gpus)?slave.used_resources.gpus.toString():"0");
                        data.push( slave.active.toString());
                        data.push(slave.registered_time.toString());
                        data.push(master_ip.toString());
                        data.push(createUser.toString());
                        data.push(master_id.toString());
                        datas.push(data);
                    }

                    var sql_insert = "INSERT INTO pass_operation_host_info ( slave_id,slave_ip,slave_port,name,os,cpu,memory,gpus,disk,cpu_used,memory_used,disk_used,gpus_used ,status,createTime,master_ip,createUser,master_id ) values (?)";
                        for(var k=0 ; datas.length-1>k;k++){
                            sql_insert+=",(?)";
                        }

                    var sql_delete="delete from pass_operation_host_info";

                    // console.log(sql_insert);
                    pool.getConnection(function (err, connection){
                        if(err){

                            console.log(err);
                            resolve({"error":err,"message":"获取数据库连接失败","success":false,"code":1001,"data":null})

                        }else{
                            connection.query(sql_delete,function(e){
                                if(e){
                                    consoel.log(e);
                                    resolve({"error":e,"message":"数据删除失败 " ,"success":false,"code":1001,"data":null})
                                }else{
                                    connection.query(sql_insert,datas,function(errs,rs){
                                        if(errs){
                                            console.log(errs);
                                            resolve({"error":errs,"message":"插入数据失败 sql :"+sql_insert ,"success":false,"code":1001,"data":null})

                                        }else {
                                            resolve({
                                                "error": null,
                                                "message": "插入数据成功 :",
                                                "success": true,
                                                "code": 0000,
                                                "data":rs
                                            })
                                        }

                                    })
                                }

                            })
                        }
                    });
                    // mysql.createQuery(sql_insert,datas,function(errs,results){
                    //     if(errs){
                    //         console.log(errs);
                    //     }else{
                    //         console.log(results);
                    //     }
                    //
                    // })

                    //
                    // query(sql_insert,datas,function(err, rows, fields){
                    //     if(err){
                    //         console.log(err);
                    //     }else{
                    //         console.log(rows);
                    //         console.log(fields);
                    //
                    //     }
                    //
                    // })
                }else{
                    console.log("访问mesos失败 。");
                    console.log(res);
                    console.log(status);
                }
            },
            REQ_HEADERS,
            {date: new Date()},
            'utf8').
        on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({"error":e.message,"message":"访问数据失败","success":false})

        });


    }).catch(function(error){

        console.log(error);

     })
    return p;
}
//                   k,slaves,master_id,master_ip,createUser,master_port
function updateMysql(resolve,k,slaves,master_id,master_ip,createUser,datas){
    console.log(" insert data  ing ");
 if(slaves&&slaves.length>k){
     var slave=slaves[k];
     var slave_id=slave.id;
     var slave_ip=slave.hostname;
     var slave_port=slave.port;
     var name=slave.pid;
     var os="Linux";
     var cpu=slave.resources.cpus;
     var memory=slave.resources.mem;
     var gpus=(slave.resources.gpus)?slave.resources.gpus:"0";
     var disk=slave.resources.disk;
     var cpu_used=(slave.used_resources.cpus)? slave.used_resources.cpus:"0";
     var memory_used=(slave.used_resources.mem)?slave.used_resources.mem:"0";
     var disk_used=(slave.used_resources.disk)?slave.used_resources.disk:"0";
     var gpus_used=(slave.used_resources.gpus)?slave.used_resources.gpus:"0";
     var status=slave.active;
     var createTime=slave.registered_time;

     pool.getConnection(function (err, connection) {
         if (err) {
             console.log(err.message);
             resolve({"error":err,"message":"获取连接池失败","success":false})
         } else {
             var sql_insert = "INSERT INTO pass_operation_host_info ( ";
             if(os){
                 sql_insert+="os";
             }
             if(name){
                 sql_insert+=",name";
             }
             if(cpu){
                 sql_insert+=",cpu";
             }
             if(slave_id){
                 sql_insert+=",slave_id";
             }
             if(slave_ip){
                 sql_insert+=",slave_ip";
             }
             if(slave_port){
                 sql_insert+=",slave_port";
             }
             if(memory){
                 sql_insert+=",memory";
             }
             if(gpus){
                 sql_insert+=",gpus";
             }
             if(disk){
                 sql_insert+=",disk";
             }
             if(disk_used){
                 sql_insert+=",disk_used";
             }
             if(memory_used){
                 sql_insert+=",memory_used";
             }
             if(master_ip){
                 sql_insert+=",master_ip";
             }
             if(createUser){
                 sql_insert+=",createUser ";
             }
             if(gpus_used){
                 sql_insert+=",gpus_used ";
             }
             if(status){
                 sql_insert+=",status ";
             }
             if(createTime){
                 sql_insert+=",createTime ";
             }
             if(cpu_used){
                 sql_insert+=",cpu_used";
             }
             if(master_id){
                 sql_insert+=",master_id"
             }
             sql_insert+=") values (";

             if(os){
                 sql_insert+="'"+os+"'";
             }
             if(name){
                 sql_insert+=",'"+name+"'";
             }
             if(cpu){
                 sql_insert+=",'"+cpu+"'";
             }
             if(slave_id){
                 sql_insert+=",'"+slave_id+"'";
             }
             if(slave_ip){
                 sql_insert+=",'"+slave_ip+"'";
             }
             if(slave_port){
                 sql_insert+=",'"+slave_port+"'";
             }
             if(memory){
                 sql_insert+=",'"+memory+"'";
             }
             if(gpus){
                 sql_insert+=",'"+gpus+"'";
             }
             if(disk){
                 sql_insert+=",'"+disk+"'";
             }
             if(disk_used){
                 sql_insert+=",'"+disk_used+"'";
             }
             if(memory_used){
                 sql_insert+=",'"+memory_used+"'";
             }
             if(master_ip){
                 sql_insert+=",'"+master_ip+"'";
             }
             if(createUser){
                 sql_insert+=",'"+createUser+"'";
             }
             if(gpus_used){
                 sql_insert+=",'"+gpus_used +"'";
             }
             if(status){
                 sql_insert+=",'"+status+"' ";
             }
             if(createTime){
                 sql_insert+=",'"+createTime+"' ";
             }
             if(cpu_used){
                 sql_insert+=",'"+cpu_used+"'";
             }
             if(master_id){
                 sql_insert+=",'"+master_id+"'";
             }
             sql_insert+=")";
             // console.log("createTime   ",createTime);
             // console.log("sql_insert  : ",sql_insert);
             connection.query(sql_insert,function(error,result){
                 if(error){
                     console.log(error);
                     resolve({"error":error,"message":"插入数据失败 sql :"+sql_insert ,"success":false})
                 }else{
                     datas.push(result);
                     k++;
                     updateMysql(resolve,k,slaves,master_id,master_ip,createUser,datas);
                 }
             })

                     // }

                 // }

             // });

         }
     });

 }else{

     resolve({"error":null,"message":"获取数据完成！","success":true,"data":datas});
 }

}

