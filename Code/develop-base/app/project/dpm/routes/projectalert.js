/**
 * Created by aurora on 2017/5/22.
 */

var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var projectService = require('../services/projectalertService');
var utils = require('../../../common/core/utils/app_utils');

//分页查询项目数据列表
router.route('/').get(function(req,res){
    // 分页条件
    var appId = req.query.appId;
    console.log("1111111111111111111111111111111111111111111111111111");
    var status = req.query.status;

    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
   if(appId){
      conditionMap.appId = appId;
     }
    if(status) {
        conditionMap.status = status;
    }
    // 调用分页
    projectService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

module.exports = router;