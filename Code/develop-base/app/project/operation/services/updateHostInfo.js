var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
var Promise=require("bluebird");
// var REQ_HEADERS = {
//     'Content-Type': 'application/json'
// };

var nodegrass=require("nodegrass");



exports.getSalve=function(){

     return new Promise(function(resolve,reject){
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
                    updateMysql(resolve,k,slaves,master_id,master_ip,createUser);
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
            resolve({"error":e.message,"message":"访问数据失败"})

        });


    });

}
//                   k,slaves,master_id,master_ip,createUser,master_port
function updateMysql(resolve,k,slaves,master_id,master_ip,createUser){
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
             resolve({"error":err,"message":"获取连接池失败"})
         } else {
             // var sql_select="select * from pass_operation_host_info where slave_id='"+slave_id+"' and master_id='"+master_id+"'";
             // console.log(sql_select);
             // connection.query(sql_select,function(err,results){
             //     if(err){
             //         console.log(err);
             //     }else{
                     // if(results.length>0){
                         //存在然后更新；

                         // var sql_update="UPDATE pass_operation_host_info SET ";
                         // if(os){
                         //     sql_update+=" os='"+os+"'";
                         // }
                         // if(name){
                         //    sql_update+=",name='"+name+"'";
                         // }
                         //
                         // if(cpu){
                         //     sql_update+=",cpu='"+cpu+"'";
                         // }
                         // if(slave_id){
                         //     sql_update+=",slave_id='"+slave_id+"'";
                         // }
                         // if(slave_ip){
                         //     sql_update+=",slave_ip='"+slave_ip+"'";
                         // }
                         // if(slave_port){
                         //     sql_update+=",slave_port='"+slave_port+"'";
                         // }
                         // if(memory){
                         //     sql_update+=",memory='"+memory+"'";
                         // }
                         // if(gpus){
                         //     sql_update+=",gpus='"+gpus+"'";
                         // }
                         // if(disk){
                         //     sql_update+=",disk='"+disk+"'";
                         // }
                         // if(disk_used){
                         //     sql_update+=",disk_used='"+disk_used+"'";
                         // }
                         // if(memory_used){
                         //     sql_update+=",memory_used='"+memory_used+"'";
                         // }
                         // if(master_ip){
                         //     sql_update+=",master_ip='"+master_ip+"'";
                         // }
                         //
                         // if(createUser){
                         //     console.log("createUser",createUser);
                         //     sql_update+=",CreateUser='"+createUser+"' ";
                         // }
                         // if(gpus_used){
                         //     sql_update+=",gpus_used='"+gpus_used+"' ";
                         // }
                         // if(status){
                         //     sql_update+=",status='"+status+"' ";
                         // }
                         // if(createTime){
                         //     sql_update+=",createTime='"+createTime+"' ";
                         // }
                         // if(cpu_used){
                         //     sql_update+=",cpu_used='"+cpu_used+"' ";
                         // }
                         // sql_update+="where slave_id='"+slave_id+"' and master_id='"+master_id+"' ;";
                         // console.log("sql_update    ;",sql_update);
                         // connection.query(sql_update,function(error,result){
                         //     if(error){
                         //         console.log(error);
                         //     }else{
                         //         k++;
                         //         updateMysql(k,slaves,master_id,master_ip,createUser);
                         //     }
                         // })
                     // }else{
                         // 不存在然后插入
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
                     resolve({"error":error,"message":"插入数据失败 sql :"+sql_insert })
                 }else{
                     k++;
                     updateMysql(resolve,k,slaves,master_id,master_ip,createUser);
                 }
             })

                     // }

                 // }

             // });

         }
     });

 }else{

     resolve({"error":null,"message":"获取数据完成！"});
 }

}

