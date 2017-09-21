/**
 * Created by 兰 on 2017-09-19.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../../common/core/utils/app_utils');
var scheduleService = require('../services/schedule_service');



router.route('/getSchedulesByIndex/')
// 查询代办事务列表
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;
        var conditionMap = {};
        scheduleService.getScheduleList(page, size, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/:id')
    .get(function(req,res){
        var id = req.params.id;
        if (!id) {
            utils.respMsg(res, false, '2004', 'id不能为空。', null, null);
        }
        var fields = {_id:0, schedule_creator: 1, schedule_name: 1, schedule_create_time: 1}; // 待返回的字段
        scheduleService.getScheduleInfo(id,fields,function(result){
            utils.respJsonData(res, result);
        });
    });


module.exports = router;