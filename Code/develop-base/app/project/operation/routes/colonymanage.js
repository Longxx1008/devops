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

router.route('/status').get(function(req,res){
    var url = config.platform.mesosHost + "/metrics/snapshot";
    var http = require("http");
    http.get(url, function(resp){
        if(resp.statusCode == 200){
            var rhtml = '';
            resp.setEncoding('utf8');
            resp.on('data', function (chunk) {
                rhtml += chunk;
            });
            resp.on('end', function () {
                //将拼接好的响应数据转换为json对象
                console.log(rhtml);
                rhtml = rhtml.replace(new RegExp("\\\\/","gm"),"_");
                console.log(rhtml);
                var json = JSON.parse(rhtml);
                if(json){
                    console.log(json.allocator_mesos_resources_disk_offered_or_allocated);
                    var diskTotal = json.allocator_mesos_resources_disk_total;
                    var diskUsed = json.allocator_mesos_resources_disk_offered_or_allocated;
                    diskUsed = diskUsed < 100 * 1024 ? 120 * 1124 : diskUsed;
                    var memTotal = json.allocator_mesos_resources_mem_total;
                    var memUsed = json.allocator_mesos_resources_mem_offered_or_allocated;
                    var cpuTotal = json.allocator_mesos_resources_cpus_total;
                    var cpuUsed = json.allocator_mesos_resources_cpus_offered_or_allocated;
                    var result = {"diskTotal": diskTotal,"diskUsed":diskUsed,"memTotal":memTotal,"memUsed":memUsed,"cpuTotal":cpuTotal,"cpuUsed":cpuUsed};
                    utils.respMsg(res, true, '0000', '查询集群资源快照成功：' + resp.statusCode, result, null);
                }
            });
        } else{
            utils.respMsg(res, false, '0000', '查询集群资源快照失败：' + resp.statusCode, null, null);
        }
    }).on('error',function(e){
        console.log("Got error: " + e.message);
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