
/**
 * Created by acer on 2017/5/11.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var Promise=require("bluebird");
var ng= require("nodegrass");
var mesos_add="192.168.9.65";
var mesos_port="5050";
var content_type="Content-Type: application/json";
var protocol="http";



/**
 * 分页查询
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getPlatfrom = function(){
    var p = new Promise(function(resolve,reject){
        var sql = "select a.* from pass_develop_project_resources a ";
        mysqlPool.query(sql,function(e,r){
            if(e){
                console.log(e);
                resolve({"data":null,"error":e,"message":"查询数据失败！","success":false,"code":1001})
            }else{

                resolve({"data":r,"error":null,"message":"查询数据成功！","success":true,"code":0000})
            }

        })

    });
    return p;

};

exports.getDeploy=function(){
    var data=[];
    var p=new Promise(function(resolve,reject){
        ng.get(protocol+"://"+mesos_add+":"+mesos_port+"/master/state.json",
        function (res, status, headers) {
            if (res) {
                var results = JSON.parse(res);
                var slaves=results.slaves;
                var unreachable_tasks=results.frameworks[0].unreachable_tasks;
                // console.log(unreachable_tasks);
                var completed_tasks=results.frameworks[0].completed_tasks;
                var tasks=results.frameworks[0].tasks;
                // console.log("============================================>  ",results.frameworks[0].tasks);
                var k =0;
                for(var i in tasks){
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
    return p ;

}



