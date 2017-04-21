/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();

var projectService = require('../services/projectService');
var utils = require('../../common/core/utils/app_utils');

router.route('/').get(function(req,res){
    // 分页条件
	
    var name = req.query.name;
    var deptId = req.query.deptId;
    var status = req.query.status;
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    if(name){
        conditionMap.name = name;
    }
    if(deptId) {
        conditionMap.deptId = deptId;
    }
    if(status){
        conditionMap.status = status;
    }
    // 调用分页
    projectService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

router.route('/:id').delete(function(req,res) {
    // 获取提交信息
    var id = req.params.id;
    projectService.delete(id, function(result) {
        utils.respJsonData(res, result);
    });
});

module.exports = router;