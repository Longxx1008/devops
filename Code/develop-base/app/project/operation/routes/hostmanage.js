/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var hostManageService = require('../services/hostManageService');
var utils = require('../../../common/core/utils/app_utils');

//查询集群主机数据
router.route('/').get(function(req,res){
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var colonyId = req.query.colonyId;
    var conditionMap = {};
    if(colonyId){
        conditionMap.colonyId = colonyId;
    }
    // 调用分页
        hostManageService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
})
//新增集群主机数据
.post(function(req,res){
    var data = [];
    data.push(req.body.name);
    data.push(req.body.configure);
    data.push(req.body.os);
    data.push(req.body.ip);
    data.push(req.body.colonyId);
    data.push(req.body.remark);
    var currentUser = utils.getCurrentUser(req);
    data.push(currentUser.login_account);
    hostManageService.add(data, function(result) {
        utils.respJsonData(res, result);
    });
})
//修改集群主机信息
    .put(function(req,res){

        // 获取提交信息
        data.push(req.body.name);
        data.push(req.body.configure);
        data.push(req.body.os);
        data.push(req.body.ip);
        data.push(req.body.cpu);
        data.push(req.body.memory);
        data.push(req.body.disk);
        data.push(req.body.status);
        data.push(req.body.remark);
        data.push(req.body.id);
        hostManageService.update(data, function(result) {
            utils.respJsonData(res, result);
        });
    });
//根据Id删除集群主机数据
router.route('/:id')
    //删除集群主机信息
    .delete(function(req,res){
        var id = req.params.id;
        if(id) {
            hostManageService.delete(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', '集群主机ID不能为空。', null, null);
        }
    });

module.exports = router;