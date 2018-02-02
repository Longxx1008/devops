/**
 * Created by szx on 2018/1/31.
 */

var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

//exports.getHealth= function (page,size,conditions,cb) {
//
//    //测试到达
//    console.log("servicess","查询");
//    var sql="select * from pass_project_app_info where 1=1"
//    //var sql="select a.id,app_name,a.vist_url,count(*) count from pass_project_app_info a " +
//    //    "left join pass_project_container_info b on a.id=b.app_id " +
//    //    "group by a.id,app_name,a.vist_url"
//
//    //var orderSql = " order by id desc";
//    //var data=[];
//    var middle={}
//    var responses={}
//    mysqlPool.query(sql,conditions,function(err,result) {
//        if(err){
//            cb(utils.returnMsg(false, '1000', '查询数据异常', null, err));
//        }else{
//
//
//            console.log("服务",result);
//            console.log("m",result.length)
//            for(var i=0;i<result.length;i++){
//
//                var sql_m='select images_name from pass_project_micro_service where app_id="'+result[i].id+'"';
//                setTimeout(function () {
//                mysqlPool.query(sql_m,conditions,function(err,results){
//                    //console.log("jiaziduan",response[i]);
//                    if(err){
//                        console.log("errors",err);
//                    }else {
//                        //result[i].image_name={}
//                        console.log("results",results);
//                        console.log(result[0].project_manager)
//                        //console.log("jiaziduan",result[i]);
//
//
//                        for(var k=0;k<results.length;k++){
//                            middle[k]=results[k].images_name;
//                        }
//                        console.log(middle)
//                        middle=JSON.toString(middle);
//                        console.log(middle[0])
//                        console.log("ssresult",result);
//                    }
//                });
//                //var sql_h='select * from pass_project_health_check where app_id="'+result[i].id+'"';
//                //mysqlPool.query(sql_h,conditions,function(err,resulth){
//                //    if(err){
//                //        console.log("errors",err);
//                //    }else {
//                //        console.log("resulth",resulth);
//                //        console.log(resulth[0])
//                //        result[i].health=[];
//                //        for(var k=0;k<resulth.length;k++){
//                //            result[i].health[k]=resulth[k];
//                //        }
//                //        //console.log(result[0].image_name)
//                //        console.log("hhresult",result);
//                //    }
//                //});
//
//
//                //var sql_c='select app_id,count(*) count from pass_project_container_info where app_id="'+result[i].id+'" group by app_id';
//                //mysqlPool.query(sql_c,conditions,function(err,resultc){
//                //    if(err){
//                //        console.log("errors",err);
//                //    }else {
//                //        console.log("results",resultc);
//                //        console.log(resultc[0])
//                //        result[i].count=resultc[0].count;
//                //        console.log(result[0].image_name)
//                //        console.log("ssresult",result);
//                //    }
//                //});
//                },50000);
//                console.log(middle)
//            }
//            //cb(utils.returnMsg(true, '0000', '数据查询成功', result[0]));
//        }
//    });
//    //utils.pagingQuery4Eui_mysql(sql,orderSql, page, size, data, cb);
//};


exports.getHealth= function (conditions) {
    console.log("servicess","查询");
    //var sql="select * from pass_project_app_info where 1=1"
    var sql="select a.id,app_name,a.vist_url,count(*) count from pass_project_app_info a " +
        "left join pass_project_container_info b on a.id=b.app_id " +
        "group by a.id,app_name,a.vist_url"
    var p = new Promise(function(resolve,reject) {
        mysqlPool.query(sql, conditions, function (err, data) {
            if (err) {
                resolve(utils.returnMsg(false, '1000', '查询数据异常', null, err));
            } else {
                resolve(utils.returnMsg(true, '0000', '数据查询成功', data,null));
            }
        });
    });
    return p;
};


exports.getHealth_micro= function (app_id,arr) {
var conditions={};
var sql_m='select images_name from pass_project_micro_service where app_id="'+app_id+'"';
    var p = new Promise(function(resolve,reject) {
            mysqlPool.query(sql_m,conditions,function(err,data){
                if(err){
                    resolve(utils.returnMsg(false, '1000', '匹配微服务异常', null, err));
                }else {
                    console.log("resulth",data);
                    console.log("resulth",data[0].images_name);
                    arr.image_name=""
                    console.log("resulth",arr);
                    for(var k=0;k<data.length;k++){
                        console.log(data[k].images_name)
                        arr.image_name+=data[k].images_name+"/";
                        }
                    resolve(utils.returnMsg(true, '0000', '匹配微服务成功', arr,null));
                    }
                });
    });
    return p;
};

exports.getHealth_check= function (app_id,arr) {
    //console.log(app_id,"testchexk",arr)
    var conditions = {};
    var sql_h='select * from pass_project_health_check where app_id="'+app_id+'"';
    var p = new Promise(function(resolve,reject) {
        mysqlPool.query(sql_h,conditions,function(err,data){
            if(err){
                resolve(utils.returnMsg(false, '1000', '匹配微服务异常', null, err));
            }else {
                //console.log("resultss",data);
                //console.log("resulth",data[0].images_name);
                arr.health={}
                arr.health=data;
                //console.log("resulth",arr);
                //for(var k=0;k<data.length;k++){
                //    console.log(data[k].images_name)
                //    arr.image_name+=data[k].images_name+"/";
                //}
                //console.log("resultss",arr);
                resolve(utils.returnMsg(true, '0000', '数据查询成功', arr,null));
            }
        });
    });
    return p;
}



