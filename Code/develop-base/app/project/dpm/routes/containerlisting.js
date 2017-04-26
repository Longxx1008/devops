
/**
 * 容器列表
 */
var express = require('express');
var router = express.Router();

var containerListingService = require('../services/containerListingService');
var utils = require('../../../common/core/utils/app_utils');

router.route('/develop/pm/cl/pageList').get(function(req,res){
    // // 分页条件
    // var projectCode = req.query.projectCode;
    // var projectName = req.query.projectName;
    // // 分页参数
    // var page = req.query.page;
    // var length = req.query.rows;
    // var conditionMap = {};
    // if(projectCode){
    //     conditionMap.projectCode = projectCode;
    // }
    // if(projectName) {
    //     conditionMap.projectName = projectName;
    // }
    var result = {'rows':{},'total': 0};
    utils.respJsonData(res, result);
    // 调用分页
    // projectService.pageList(page, length, conditionMap,function(result){
    //     utils.respJsonData(res, result);
    // });
});


module.exports = router;