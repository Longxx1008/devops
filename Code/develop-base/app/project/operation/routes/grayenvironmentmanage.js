/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var projectOperationService = require('../services/projectOperationService');
var utils = require('../../../common/core/utils/app_utils');

//查询集群数据
router.route('/').get(function(req,res){
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    // 调用分页
        projectOperationService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
})

//根据Id获取集群数据
router.route('/version')
    .get(function(req,res){
        var projectId = req.query.projectId;
        var conditionMap = {};
        if(projectId){
            conditionMap.projectId = projectId;
        }
        // 调用查询
        projectOperationService.versionList(conditionMap,function(result){
            utils.respJsonData(res, result);
        });
    });

module.exports = router;