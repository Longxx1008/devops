/**
 * Created by 兰 on 2017-09-26.
 */

var express = require('express');
var router = express.Router();
// var formidable=require("formidable");
// var fs=require("fs");
var requestDetailService = require('../services/requestDetailService');
var utils = require('../../../common/core/utils/app_utils');





//文章详情Controller
router.route('/getDetailByNumber').get(function(req,res){
    var conditionMap = {};
    conditionMap.serial_number=req.query.serial_number;

    requestDetailService.getServiceType(0, 10, conditionMap,function(result){
        var list={};
        // item.log("result------",result);
        var j=0;
        for (var i=0;i<result.total;i++){
            var item="'"+result.rows[i].micro_service_id+"'";


            requestDetailService.getDetailMsgByNumber(result.rows[i].micro_service_id,function(result1){

                if(list[j]=result1){
                    console.log("result333-----",list[j].rows[0].module);
                    j=j+1;
                }
            });
        }

        utils.respJsonData(res, list);
    });

});



//
//
// //文章详情Controller
// router.route('/getDetailByNumber').get(function(req,res){
//     var conditionMap = {};
//     conditionMap.serial_number=req.query.serial_number;
//
//     requestDetailService.getServiceType(0, 10, conditionMap).then(function(result){
//         var list={};
//         // item.log("result------",result);
//         for (var i=0;i<result.total;i++){
//             var item="'"+result.rows[i].micro_service_id+"'";
//             console.log("result11-----",item);
//
//             requestDetailService.getDetailMsgByNumber(result.rows[i].micro_service_id).then(function(result1){
//                 // console.log("result11-----",result1);
//                 console.log("result2-----",item);
//                 list[item]=result1.rows;
//                 // list[i]=result1;
//
//             });
//         }
//
//         utils.respJsonData(res, list);
//     });
//
// });
//






module.exports = router;