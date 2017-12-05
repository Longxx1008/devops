/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var slaveDetailService = require('../services/slaveDetailService');
var utils = require('../../../common/core/utils/app_utils');

router.route('/').get(function(req,res){
    // 调用查询

    console.log("query :",req.query,"  params :",req.params,"   body : ",req.body)
    var id=req.query.id;
    var name=req.query.name;
    var condition ={};
    if(name){
        slaveDetailService.getResourceBySlave(name).then(function(rs){
            utils.respJsonData(res,rs);
        })

    }else{
        utils.respJsonData(res,{"error":new Error(),"message":"name不能为空","code":10000,"success":false});

    }


});
router.route('/getHostName').get(function(req,res){
    // 调用查询
    console.log("getHostName---------------");
    slaveDetailService.getHostName().then(function(rs){
        utils.respJsonData(res,rs)
    });

});

router.route('/getHostInfo').get(function(req,res){
    // 调用查询
    var id=req.query.id;
    var name=req.query.name;
    if(id&&name){
        slaveDetailService.getSyncHostInfo(id,function(result){
            utils.respJsonData(res,result)

        });
    }else{
        utils.respJsonData(res,{"error":new Error(),"message":"id或name不能为空","code":10000,"success":false});

    }

});

module.exports = router;