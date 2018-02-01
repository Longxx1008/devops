/* 
create by heidngxin 17.10.16
*/
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var resourceListService = require('../services/resourceListService');
var utils = require('../../../common/core/utils/app_utils');
/***********************资源列表查询(get),新增(put),修改(post)*******************************/

router.route("/")
    .get(function(req, res) {
        var resource_number =req.query.resource_number;
        var page = req.query.page;
        var pageSize = req.query.rows;
        var conditionMap = {};
        if(resource_number){
            conditionMap.resource_number = resource_number;
        }
        // 调用分页
        resourceListService.pageList(page,pageSize,conditionMap,function(result){
            utils.respJsonData(res, result);
        });
    }).put(function (req,res) {
    var data = {};
    data.resource_number = req.body.resource_number;
    data.resource_name = req.body.resource_name;
    data.resource_state = req.body.resource_state;
    data.resource_apply = req.body.resource_apply;
    data.resource_count = req.body.resource_count;
    data.resource_remark = req.body.resource_remark;
    resourceListService.add(data, function(result) {
        utils.respJsonData(res, result);
    });
}).post(function (req,res) {
    var data = [];
    data.push(req.body.resource_number);
    data.push(req.body.resource_name);
    data.push(req.body.resource_state);
    data.push(req.body.resource_apply);
    data.push(req.body.resource_count);
    data.push(req.body.resource_remark);
    data.push(req.body.id);
    console.log(req.body.resource_number+"1-++++++++++++++++++++++++++++++++++++++++++++++++++")
    resourceListService.update(data, function(result) {
        utils.respJsonData(res, result);
    });
});
/************删除资源列表************/
router.route('/:id')
    .delete(function(req,res){
        var id = req.params.id;
        if(id) {
            resourceListService.delete(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', 'ID不能为空。', null, null);
        }
    });
module.exports = router;