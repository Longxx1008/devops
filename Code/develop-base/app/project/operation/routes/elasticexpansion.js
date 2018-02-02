/* 
create by heidngxin 17.10.16
*/
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var elasticExpansionService = require('../services/elasticExpansionService');
var utils = require('../../../common/core/utils/app_utils');
/***********************资源列表查询(get),新增(put),修改(post)*******************************/

router.route("/")
    .get(function(req, res) {
        console.log("microServices!!!!");
        var appId = req.appId;
        console.log("appId = "+appId);
        var conditionMap = {};
        elasticExpansionService.findList(conditionMap,function(result1){
            var conditionMap2 = {};
            elasticExpansionService.findMicroServiceList(conditionMap2,function(result2){
                var newResult = {microServices:result2,
                    strategies :result1};
                utils.respJsonData(res, newResult);
            });
        });
    }).put(function (req,res) {
        var data = {};
        data.app_id = req.body.app_id;
        data.micro_service_id = req.body.micro_service_id;
        data.tactics_name = req.body.tactics_name;
        data.gather_value = req.body.gather_value;
        data.duration = req.body.duration;
        data.target_value = req.body.target_value;
        data.tactics_count = req.body.tactics_count;
        data.tactics =  "";
        data.duration = req.body.duration;
        data.operation = req.body.operation;
        data.remark = gather_value+""+data.operation+data.target_value+"/s"+tactics_count+"次自动扩展";
        data.status = req.body.status;
        elasticExpansionService.add(data, function(result) {
        utils.respJsonData(res, result);
    });
}).post(function (req,res) {
    var data = [];
    data.push(req.body.status);
    console.log(req.body.status+"1-++++++++++++++++++++++++++++++++++++++++++++++++++")
    elasticExpansionService.update(data, function(result) {
        utils.respJsonData(res, result);
    });
});
/************删除资源列表************/
router.route('/:id')
    .delete(function(req,res){
        var id = req.params.id;
        if(id) {
            elasticExpansionService.delete(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', 'ID不能为空。', null, null);
        }
    });

//获取MicroServices
router.route("/microServices").get(function(req, res) {
    console.log("microServices!!!!");
    console.log(req);
    var appId = req.query.appId;
    var microServiceId = req.query.microServiceId;
    console.log("appId = "+appId);
    console.log("microServiceId = "+microServiceId);
    var conditionMap = {};
    if(!appId){
        appId =1;
    }
    if(microServiceId){
        conditionMap.micro_service_id = microServiceId;
    }
    conditionMap.app_id = appId;
    elasticExpansionService.findList(conditionMap,function(result1){
        var conditionMap2 = {};
        if(microServiceId){
            conditionMap2.id = microServiceId;
        }
        elasticExpansionService.findMicroServiceList(conditionMap2,function(result2){
            var newResult = {
                microServices:result2,
                strategies :result1};
            utils.respJsonData(res, newResult);
        });
    });
}).put(function (req,res) {
    var data = {};
    console.log(req);
    data.app_id = req.body.app_id;
    data.micro_service_id = req.body.micro_service_id;
    data.tactics_name = req.body.tactics_name;
    data.gather_value = req.body.gather_value;
    data.duration = req.body.duration;
    data.target_value = req.body.target_value;
    data.tactics_count = req.body.tactics_count;
    data.tactics = req.body.tactics_name;
    data.operation = req.body.operation;
    data.remark = data.gather_value+""+data.operation+data.target_value+"KB每s"+data.tactics_count+"次自动扩展";
    data.status = req.body.status;
    console.log(data);
    elasticExpansionService.add(data, function(result) {
        utils.respJsonData(res, result);
    });
})
module.exports = router;