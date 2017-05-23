/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var serviceMonitorService = require('../services/serviceMonitorService');
var utils = require('../../../common/core/utils/app_utils');

//查询应用服务数据
router.route('/').get(function(req,res){
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var projectId = req.query.projectId;
    var conditionMap = {};
    if(projectId){
        conditionMap.projectId = projectId;
    }
    // 调用分页
    serviceMonitorService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});


module.exports = router;