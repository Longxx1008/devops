/**
 * Created by 兰 on 2017-09-26.
 */

var express = require('express');
var router = express.Router();
// var formidable=require("formidable");
// var fs=require("fs");
var requestDetailService = require('../services/requestDetailService');
var utils = require('../../../common/core/utils/app_utils');





//先通过group方式查出请求了几个微服务，然后再将每一个微服务的详细记录的数组作为一个元素放在list里，相当于list为一个二维数组。

router.route('/getDetailByNumber').get(function(req,res){
    var conditionMap = {};
    conditionMap.serial_number=req.query.serial_number;

    requestDetailService.getServiceType(1, 100, conditionMap,function(result){
        var list={};
        var j=1;   //list中第0个元素存长度，第1个元素开始存各个微服务的详细记录。
        for (var i=0;i<result.total;i++){
            requestDetailService.getDetailMsgByNumber(result.rows[i].micro_service_id,conditionMap.serial_number,function(result1){
                if(list[j]=result1){
                    console.log("!!!"+result1.rows[0].host_ip)
                    var totalTime=0;
                    var totalStatus="正常";
                    for(var k=0;k<result1.total;k++){
                        totalTime+=result1.rows[k].total_time_consuming;
                        list[j].rows[0].totalTime=totalTime;
                        if(result1.rows[k].return_status!='200'){
                            totalStatus="异常";
                        }
                        list[j].rows[0].totalStatus=totalStatus;
                    }
                    // console.log("@@##"+list[j].rows[0].totalTime);
                    //console.log("@@##"+list[j].rows[0].totalStatus);

                    if(j=j+1){
                        if(j===result.total+1){
                            list[0]=result.total;      //把微服务的数量复制给list[0];
                            //console.log("@@@@"+list[0]);
                            utils.respJsonData(res, list);
                        }
                    }
                }
            });

        }


    });

});







//
//
// router.route('/getDetailByNumber').get(function(req,res){
//     var conditionMap = {};
//     conditionMap.serial_number=req.query.serial_number;
//
//     requestDetailService.getServiceType(1, 100, conditionMap,function(result){
//         var list={};
//         var j=1;   //list中第0个元素存长度，第1个元素开始存各个微服务的详细记录。
//         for (var i=0;i<result.total;i++){
//             requestDetailService.getDetailMsgByNumber(result.rows[i].micro_service_id,conditionMap.serial_number,function(result1){
//
//                 if(list[j]=result1){
//                     console.log("result333-----"+list[j].rows[0].module);
//                     if(j=j+1){
//                         if(j===result.total+1){
//                             list[0]=result.total;      //把微服务的数量复制给list[0];
//                             console.log("@@@@"+list[0]);
//                             utils.respJsonData(res, list);
//                         }
//                     }
//                 }
//             });
//
//         }
//
//
//     });
//
// });
//




module.exports = router;