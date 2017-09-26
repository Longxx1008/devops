/**
 * Created by 兰 on 2017-09-19.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../../common/core/utils/app_utils');
var scheduleService = require('../services/schedule_service');


// router.route('/')

// router.route('/getSchedulesByIndex/')
// // 查询代办事务列表
//     .get(function(req,res){
//         var page = req.query.page;
//         var size = req.query.rows;
//         var conditionMap = {};
//         scheduleService.getScheduleList(page, size, conditionMap, function(result){
//             utils.respJsonData(res, result);
//         });
//     });
//
// router.route('/:id')
//     .get(function(req,res){
//         var id = req.params.id;
//         if (!id) {
//             utils.respMsg(res, false, '2004', 'id不能为空。', null, null);
//         }
//         var fields = {_id:0, schedule_creator: 1, schedule_name: 1, schedule_create_time: 1}; // 待返回的字段
//         scheduleService.getScheduleInfo(id,fields,function(result){
//             utils.respJsonData(res, result);
//         });
//     });



router.route('/')

// -------------------------------query查询列表-------------------------------
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;

        var schedule_name = req.query.schedule_name;//事务名称
        var schedule_grade = req.query.schedule_grade;//事务紧急程度


        var conditionMap = {};
        // or 查询
        if(schedule_name){
            conditionMap.schedule_name = new RegExp(schedule_name);
        }
        if(schedule_grade) {
            conditionMap.schedule_grade = schedule_grade;
        }

        scheduleService.getSchedules(page,size,conditionMap,function (result) {
            utils.respJsonData(res,result);
        })

    })

    // -------------------------------create添加-------------------------------
    .post(function(req,res){
        // 获取提交信息
        var schedule_name = req.body.schedule_name;//事项名称
        var schedule_grade = req.body.schedule_grade;//紧急程度
        var schedule_content = req.body.schedule_content;//事务内容
        var schedule_executor = req.body.schedule_executor;//执行者
        var schedule_complete_time = req.body.schedule_complete_time;//截止日期

        // 验证事项名称是否为空
        if(!schedule_name) {
            utils.respMsg(res, false, '2001', '事项名称不能为空。', null, null);
        }
        // 验证紧急程度是否为空
        if(!schedule_grade) {
            utils.respMsg(res, false, '2002', '紧急程度不能为空。', null, null);
        }
        // 验证事务内容是否为空
        if(!schedule_content) {
            utils.respMsg(res, false, '2003', '事务内容不能为空。', null, null);
        }

        // 验证执行者是否为空
        if(!schedule_executor) {
            utils.respMsg(res, false, '2003', '执行者不能为空。', null, null);
        }

        // 验证截止时间是否为空
        if(!schedule_complete_time) {
            utils.respMsg(res, false, '2003', '截止时间不能为空。', null, null);
        }

        //构造保存参数
        var systemScheduleEntity = {};
        systemScheduleEntity.schedule_name = schedule_name;
        systemScheduleEntity.schedule_grade = schedule_grade;
        systemScheduleEntity.schedule_content = schedule_content;
        systemScheduleEntity.schedule_creator = utils.getCurrentUser(req)._id;
        systemScheduleEntity.schedule_executor = schedule_executor;
        systemScheduleEntity.schedule_complete_time = schedule_complete_time;
        systemScheduleEntity.schedule_create_time = new Date();
        scheduleService.saveSchedules(systemScheduleEntity, function(result){
            utils.respJsonData(res, result);
        });
    })


router.route('/getSchedulesByIndex/')
// -------------------------------获取待办事项信息-------------------------------
    .get(function(req, res){
        scheduleService.getScheduleByIndex(function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/getSchedulesByIndexMore/')
// -------------------------------获取更多系统待办事项-------------------------------
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;
        var conditionMap = {};

        scheduleService.getSchedules(page, size, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    });





router.route('/:id')

// -------------------------------get获取详情-------------------------------
    .get(function(req,res){
        var id = req.params.id;
        if (!id) {
            utils.respMsg(res, false, '2004', 'id不能为空。', null, null);
        }
        var fields = {_id:0, schedule_name: 1, schedule_content: 1, schedule_grade: 1,schedule_complete_time:1}; // 待返回的字段
        scheduleService.getScheduleInfo(id,fields,function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------update修改-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//id
        var schedule_name = req.body.schedule_name;//事项名称
        var schedule_grade = req.body.schedule_grade;//紧急程度
        var schedule_content = req.body.schedule_content;//事务内容
        var schedule_executor = req.body.schedule_executor;//执行者
        var schedule_complete_time = req.body.schedule_complete_time;//截止日期


        // 验证事务名称是否为空
        if(!schedule_name) {
            utils.respMsg(res, false, '2005', '事务名称不能为空。', null, null);
        }
        // 验证紧急程度是否为空
        if(!schedule_grade) {
            utils.respMsg(res, false, '2006', '紧急程度不能为空。', null, null);
        }

        // 验证执行者是否为空
        if(!schedule_executor) {
            utils.respMsg(res, false, '2006', '执行者不能为空。', null, null);
        }
        // 验证截止时间是否为空
        if(!schedule_complete_time) {
            utils.respMsg(res, false, '2005', '截止时间不能为空。', null, null);
        }
        // 验证事务内容是否为空
        if(!schedule_content) {
            utils.respMsg(res, false, '2007', '事务内容不能为空。', null, null);
        }

        //构造保存参数
        //构造保存参数
        var systemScheduleEntity = {};
        systemScheduleEntity.schedule_name = schedule_name;
        systemScheduleEntity.schedule_grade = schedule_grade;
        systemScheduleEntity.schedule_content = schedule_content;
        systemScheduleEntity.schedule_creator = utils.getCurrentUser(req)._id;
        systemScheduleEntity.schedule_executor = schedule_executor;
        systemScheduleEntity.schedule_complete_time = schedule_complete_time;
        systemScheduleEntity.schedule_create_time = new Date();

        var conditions = {_id: id};
        var update = {$set: systemScheduleEntity};
        scheduleService.updateSchedule(conditions,update,function(result){
            utils.respJsonData(res, result);
        });
    })

    .delete(function(req,res){
        var id = req.params.id;
        if (!id) {
            utils.respMsg(res, false, '2004', 'id不能为空。', null, null);
        }

        scheduleService.deleteSchedule(id,function(result){
            utils.respJsonData(res, result);
        });
    })


module.exports = router;