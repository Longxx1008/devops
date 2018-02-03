/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();

var appdetailService = require('../services/appdetailService');
var utils = require('../../../common/core/utils/app_utils');

//获取应用详情
router.route('/query').get(function(req,res){
    var appid=req.query.appid;
    if(!appid){
        utils.respMsg(res, false, '1000', '应用ID不能为空', null, null);
        return;
    }
    appdetailService.getAppdetails(appid,function(result){
        utils.respJsonData(res, result);
    });
});
//获取应用详情微服务
router.route('/microservice').get(function(req,res){
    var appid=req.query.appid;
    if(!appid){
        utils.respMsg(res, false, '1000', '应用ID不能为空', null, null);
        return;
    }
    appdetailService.getMicroServices(appid,function(result){
        utils.respJsonData(res, result);
    });
});
//删除容器
router.route('/delContainer').get(function(req,res){
    var service_id=req.query.service_id;

    if(!service_id){
        utils.respMsg(res, false, '1000', '服务ID不能为空', null, null);
        return;
    }
    appdetailService.delContainer(service_id,function(result){
        utils.respJsonData(res, result);
    });
});
//增加容器
router.route('/addContainer').get(function(req,res){
    var service_id=req.query.service_id;
    var app_id=req.query.app_id;
    if(!service_id){
        utils.respMsg(res, false, '1000', '服务ID不能为空', null, null);
        return;
    }
    if(!app_id){
        utils.respMsg(res, false, '1000', '应用ID不能为空', null, null);
        return;
    }
    appdetailService.addContainer(service_id,app_id,function(result){
        utils.respJsonData(res, result);
    });
});

//增加容器
router.route('/queryContainer').get(function(req,res){
    var container_id=req.query.container_id;

    if(!container_id){
        utils.respMsg(res, false, '1000', '容器ID不能为空', null, null);
        return;
    }

    appdetailService.queryContainer(container_id,function(result){
        utils.respJsonData(res, result);
    });
});

module.exports = router;