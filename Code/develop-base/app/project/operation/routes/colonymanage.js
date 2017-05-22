/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var colonyManageService = require('../services/colonyManageService');
var utils = require('../../../common/core/utils/app_utils');

//查询集群数据
router.route('/').get(function(req,res){
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    var conditionMap = {};
    // 调用分页
    colonyManageService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
})
//新增集群数据
.post(function(req,res){
    var data = [];
    data.push(req.body.name);
    data.push(req.body.remark);
    data.push(req.body.mesosUrl);
    data.push(req.body.marathonUrl);
    var currentUser = utils.getCurrentUser(req);
    data.push(currentUser.login_account);
    colonyManageService.add(data, function(result) {
        utils.respJsonData(res, result);
    });
}).put(function(req,res){

        // 获取提交信息
        var id = req.body.id;
        var name = req.body.name;
        var remark = req.body.remark;
        // 验证通过组装数据
        var data = [];
        data.push(name);
        data.push(remark);
        data.push(req.body.mesosUrl);
        data.push(req.body.marathonUrl);
        data.push(id);
        colonyManageService.update(data, function(result) {
            utils.respJsonData(res, result);
        });
    });

router.route('/combobox').get(function(req, res){
    var conditionMap = {};
    colonyManageService.comboboxList(conditionMap,function(result){
        utils.respJsonData(res, result.data);
    });
});

//根据Id获取集群数据
router.route('/:id')
    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            colonyManageService.getColony(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', '集群ID不能为空。', null, null);
        }
    })
    //删除集群信息
    .delete(function(req,res){
        var id = req.params.id;
        if(id) {
            colonyManageService.delete(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '1000', '集群ID不能为空。', null, null);
        }
    });

module.exports = router;