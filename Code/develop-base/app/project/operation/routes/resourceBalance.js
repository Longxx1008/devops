/* 
create by wuhaitao 17.10.20
*/
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var resourceBalanceService = require('../services/resourceBalanceService');
var utils = require('../../../common/core/utils/app_utils');
router.route('/').get(function(req,res){
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    // 调用分页
    resourceBalanceService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
})

module.exports = router;