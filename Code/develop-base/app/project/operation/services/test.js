// var ng = require("nodegrass");
// var Promise=require("bluebird");
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var Promise=require("bluebird");
var ng= require("nodegrass");
var mesos_add="192.168.9.65";
var mesos_port="5050";
var content_type="Content-Type: application/json";
test()
function test(){
    getfromMarathon();
    // getInfo().then(function(rs){
    //     console.log(rs)
    // })
}
function getfromMarathon(){
    // ng.get("http://192.168.9.61:8080/v2/groups",function(rs,status,headers){
    //     var data=JSON.parse(rs);
    //     console.log(data);
    //     var params=[];
    //     for(var i in data.apps){
    //         var param=[];
    //         var app= data.apps[i];
    //         // console.log(app);
    //         param.push(app.id);
    //         param.push(app.container.docker.image);
    //         var container_id="";
    //         param.push(0);
    //         param.push(0);
    //         param.push("");
    //         param.push(app.instances);
    //         var parent_service_id="";
    //         param.push("");
    //         var url="";
    //         var args=app.args;
    //         for(var j in args){
    //             if(!(url)&&args[j].indexOf("http")!=-1){
    //                 url=args[j];
    //             }
    //         }
    //         param.push(url);
    //         var port="";
    //         param.push(0);
    //         var service_type="";
    //         param.push(app.user);
    //         var stop_user="";
    //         params.push(param);
    //     }
    //
    //     var groups=data.groups;
    //     var master_group_params=[];
    //     var slave_group_params=[];
    //     //加载parent
    //     for(var h in groups){
    //         var group=groups[h]
    //         // console.log(group);
    //         var master_group_param=[];
    //         master_group_param.push(group.id);
    //         master_group_param.push(group.apps[0].container.docker.image);
    //         var container_id="";
    //         master_group_param.push(1);
    //         master_group_param.push(0);
    //         master_group_param.push("");
    //         var instances=0;
    //         for(var m in group.apps){
    //             var app= group.apps[m];
    //             instances+=app.instances;
    //         }
    //         master_group_param.push(instances);
    //         var parent_service_id="";
    //         master_group_param.push("");
    //         var url="";
    //         var args=group.apps[0].args;
    //         for(var j in args){
    //             if(!(url)&&args[j].indexOf("http")!=-1){
    //                 url=args[j];
    //             }
    //         }
    //         master_group_param.push(url);
    //         var port="";
    //         master_group_param.push(0);
    //         // var service_type="";
    //         master_group_param.push(group.apps[0].user);
    //         var stop_user="";
    //         master_group_params.push(master_group_param);
    //
    //         //填充slave
    //
    //         var apps=group.apps;
    //         for(var n in apps){
    //             var slave_group_param=[];
    //             var app=apps[n];
    //             // console.log(app);
    //             // var app= data.apps[i];
    //             // console.log(app);
    //             slave_group_param.push(app.id);
    //             slave_group_param.push(app.container.docker.image);
    //             var container_id="";
    //             slave_group_param.push(0);
    //             slave_group_param.push(0);
    //             slave_group_param.push("");
    //             slave_group_param.push(app.instances);
    //             var parent_service_id="";
    //             slave_group_param.push(group.id);
    //             var url="";
    //             var args=app.args;
    //             for(var j in args){
    //                 if(!(url)&&args[j].indexOf("http")!=-1){
    //                     url=args[j];
    //                 }
    //             }
    //             slave_group_param.push(url);
    //             var port="";
    //             slave_group_param.push(0);
    //             var service_type="";
    //             slave_group_param.push(app.user);
    //             var stop_user="";
    //             slave_group_params.push(slave_group_param);
    //         }
    //
    //     }
    //     // var k = 0;
    //
    //     // console.log("params ",params)
    //     // console.log("master_group_params",master_group_params);
    //     // console.log("slave_group_params",slave_group_params);
    //     // Promise.all( [insertToMysql(0,params,"一级"),insertToMysql(0,master_group_params,"二级"),insertToMysql(0,slave_group_params,"三级")]).then(function(res){
    //     //     console.log(res)
    //     // })
    // },null,'utf8').on('error', function(e) {
    //     console.log("Got error: " + e.message);
    // });

    ng.get("http://192.168.9.61:8080/v2/tasks",function(rs,status,headers){

        var data=JSON.parse(rs);
        for(var i in data.tasks){
            var task=data.tasks[i];
            console.log(task)

        }
    },null,'utf8').on('error', function(e) {
        console.log("Got error: " + e.message);
    });


}

function insertToMysql(k,params,cm){
    return new Promise(function(_res,_rej){
        if(params&&params.length>k){
            console.log(cm)
            var sql_query="select * from pass_project_service_info where service_tag=?";
            mysqlPool.query(sql_query,params[k][0],function(error,result){
                if(error){
                    console.log(error);
                }else{
                    if(result.length>0){
                        var sql="update pass_project_service_info set service_tag=?,image_id=?,is_group=?,is_test=?,git_url=?,g" +
                            "ross_instance_numbers=?,parent_service_tag=?,url=?,service_status=?,create_user=? where service_id='"+result[0].service_id+"'";
                        // console.log(excludeSpecial(sql),params[k].length)
                        mysqlPool.query(sql,params[k],function(e,rs){
                            if(e){
                                console.log(e);
                            }else{
                                // console.log(rs);
                                k++;
                                insertToMysql(k,params,cm);
                            }
                        })

                    }else{
                        var sql="insert into pass_project_service_info (service_tag,image_id,is_group,is_test,git_url,g" +
                            "ross_instance_numbers,parent_service_tag,url,service_status,create_user) values(?,?,?,?,?,?,?,?,?,?)"
                        // console.log(sql,params[k].length)
                        mysqlPool.query(sql,params[k],function(e,rs){
                            if(e){
                                console.log(e);
                            }else{
                                // console.log(rs);
                                k++;
                                insertToMysql(k,params,cm);
                            }
                        })

                    }
                }
            })
        }else{
            return _res("结束");
        }
    })
}

// if(params&&params.length>k){
//     console.log(cm)
//     var sql_query="select * from pass_project_service_info where service_tag=?";
//     mysqlPool.query(sql_query,params[k][0],function(error,result){
//         if(error){
//             console.log(error);
//         }else{
//             if(result.length>0){
//                 var sql="update pass_project_service_info set service_tag=?,image_id=?,is_group=?,is_test=?,git_url=?,g" +
//                     "ross_instance_numbers=?,parent_service_tag=?,url=?,service_status=?,create_user=? where service_id='"+result[0].service_id+"'";
//                 console.log(excludeSpecial(sql),params[k].length)
//                 mysqlPool.query(sql,params[k],function(e,rs){
//                     if(e){
//                         console.log(e);
//                     }else{
//                         // console.log(rs);
//                         k++;
//                         insertToMysql(k,params);
//                     }
//                 })
//
//             }else{
//                 var sql="insert into pass_project_service_info (service_tag,image_id,is_group,is_test,git_url,g" +
//                     "ross_instance_numbers,parent_service_tag,url,service_status,create_user) values(?,?,?,?,?,?,?,?,?,?)"
//                 console.log(sql,params[k].length)
//                 mysqlPool.query(sql,params[k],function(e,rs){
//                     if(e){
//                         console.log(e);
//                     }else{
//                         // console.log(rs);
//                         k++;
//                         insertToMysql(k,params);
//                     }
//                 })
//
//             }
//         }
//     })
// }else{
//     return _res("结束");
// }

var excludeSpecial = function(s) {
    // 去掉转义字符
    s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
    // 去掉特殊字符
    s = s.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/);
    return s;
};

function getInfo(){
    var data=[];
    var p =new Promise(function(resolve,reject){
        ng.get("http"+"://"+mesos_add+":"+mesos_port+"/master/state.json",
            function (res, status, headers) {
                if (res) {
                    var results = JSON.parse(res);
                    var slaves=results.slaves;
                    var unreachable_tasks=results.frameworks[0].unreachable_tasks;
                    var completed_tasks=results.frameworks[0].completed_tasks;
                    var tasks=results.frameworks[0].tasks;
                    // console.log("============================================>  ",results.frameworks[0].tasks);
                    var k =0;
                    for(var i in tasks){
                        console.log(tasks[i]);

                        var map={};
                        var slave_id=tasks[i].slave_id;
                        var docker_container_id="mesos-"+tasks[i].slave_id+"."+tasks[i].framework_id;
                        var containers=tasks[i].container;
                        // console.log(containers.docker);
                        map.image=containers.docker.image;
                        map.containerName=tasks[i].name;
                        map.containerId=docker_container_id;
                        map.id=k;
                        k++;
                        for(var slave in slaves){
                            if(slaves[slave].id==slave_id){
                                map.hostname=slaves[slave].hostname
                            }
                        }
                        data.push(map);
                    }
                    resolve({"data":data,"success":true,"message":"获取数据成功","error":null,"code":0000})
                }
            },
            content_type,
            null,
            'utf8').
        on('error', function (e) {
            resolve({"data":null,"success":false,"message":"获取数据失败！","error":e,"code":1001})


        })
    })
    return p;
}