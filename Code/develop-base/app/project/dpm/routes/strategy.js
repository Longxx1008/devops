
/**
 * 容器列表
 */
var express = require('express');
var router = express.Router();

var strategyService = require('../services/strategyService');
var utils = require('../../../common/core/utils/app_utils');

router.route('/list').get(function(req,res){
    // 分页条件
    var projectName = req.query.projectName;
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    if(projectName){
        conditionMap.projectName = projectName;
    }
    // 调用分页
    strategyService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
}).put(function (req,res) {
    var data = [];
    data.push(req.body.strategy_name);
    console.log("name:"+req.body.strategy_name);
    console.log("name:"+req.body.strategy_parameter);
    console.log("name:"+req.body.trigger_shell);
    console.log("name:"+req.body.strategy_status);
    data.push(req.body.strategy_parameter);
    data.push(req.body.trigger_shell);
    data.push(req.body.remark);
    data.push(req.body.strategy_status);
    strategyService.add(data, function(result) {
        utils.respJsonData(res, result);
    });
}).post(function (req,res) {
    var data = [];
    data.push(req.body.strategy_name);
    data.push(req.body.strategy_parameter);
    data.push(req.body.trigger_shell);
    data.push(req.body.remark);
    data.push(req.body.strategy_status);
    data.push(req.body.id);
    strategyService.update(data, function(result) {
        utils.respJsonData(res, result);
    });
});

//根据Id获取策略
router.route('/:id')
    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            strategyService.getStrategy(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', 'ID不能为空。', null, null);
        }
    })
    //删除策略信息
    .delete(function(req,res){
        var id = req.params.id;
        if(id) {
            strategyService.delete(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', 'ID不能为空。', null, null);
        }
    });
module.exports = router;