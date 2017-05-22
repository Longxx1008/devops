/**
 * Created by aurora on 2017/5/22.
 */

var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var projectalertService = require('../services/projectalertService');
var utils = require('../../../common/core/utils/app_utils');

//分页查询项目数据列表
router.route('/').get(function(req,res){
    // 分页条件
    var appId = req.query.appId;
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
    projectalertService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});
router.route('/').put(function(req,res){
    // 获取提交信息
    var ids = req.body.ids;
    projectalertService.update(ids, function(result) {
        utils.respJsonData(res, result);
    });
});

module.exports = router;