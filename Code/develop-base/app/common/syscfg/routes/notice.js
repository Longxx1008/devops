/**
 * Created by zhaojing on 2016/6/28.
 */
var express = require('express');
var router = express.Router();

var utils = require('../../../common/core/utils/app_utils');
var noticeService = require('../services/notice_service');

router.route('/')

// -------------------------------query查询列表-------------------------------
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;

        var notice_title = req.query.notice_title;//公告标题
        var notice_type = req.query.notice_type;//公告类型
        var notice_status = req.query.notice_status;//公告状态

        var conditionMap = {};
        // or 查询
        if(notice_title){
            conditionMap.notice_title = new RegExp(notice_title);
        }
        if(notice_type) {
            conditionMap.notice_type = notice_type;
        }

        if(notice_status){
            conditionMap.notice_status = notice_status;
        }

        noticeService.getNotices(page, size, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------create添加-------------------------------
    .post(function(req,res){
        // 获取提交信息
        var notice_title = req.body.notice_title;//公告标题
        var notice_type = req.body.notice_type;//公告类型
        var notice_content = req.body.notice_content;//公告内容

        // 验证公告标题是否为空
        if(!notice_title) {
            utils.respMsg(res, false, '2001', '公告标题不能为空。', null, null);
        }
        // 验证公告类型是否为空
        if(!notice_type) {
            utils.respMsg(res, false, '2002', '公告类型不能为空。', null, null);
        }
        // 验证公告内容是否为空
        if(!notice_content) {
            utils.respMsg(res, false, '2003', '公告内容不能为空。', null, null);
        }

        //构造保存参数
        var systemNoticeEntity = {};
        systemNoticeEntity.notice_title = notice_title;
        systemNoticeEntity.notice_type = notice_type;
        systemNoticeEntity.notice_content = notice_content;
        systemNoticeEntity.notice_issuer = utils.getCurrentUser(req)._id;
        systemNoticeEntity.notice_status = 1;
        systemNoticeEntity.notice_date = new Date();
        noticeService.saveNotices(systemNoticeEntity, function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------review审核-------------------------------
    .put(function(req,res) {
        var id = req.body.id;
        var systemNoticeEntity = {};
        systemNoticeEntity.notice_auditor = utils.getCurrentUser(req)._id;
        systemNoticeEntity.notice_status = 2;
        noticeService.reviewNotices(id,systemNoticeEntity,function(result){
            utils.respJsonData(res, result);
        });
    })



router.route('/getNoticesByIndex/')
// -------------------------------获取系统公告信息-------------------------------
    .get(function(req, res){
        noticeService.getNoticesByIndex(function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/getNoticesByIndexMore/')
// -------------------------------获取系统公告信息-------------------------------
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;

        var notice_title = req.query.notice_title;//公告标题
        var notice_type = req.query.notice_type;//公告类型

        var conditionMap = {};
        // or 查询
        if(notice_title){
            conditionMap.notice_title = new RegExp(notice_title);
        }
        if(notice_type) {
            conditionMap.notice_type = notice_type;
        }
        noticeService.getNotices(page, size, conditionMap, function(result){
            utils.respJsonData(res, result);
        });
    });

// -------------------------------获取置顶时间最近的一条记录-------------------------------
router.route('/getNoticeMaxDate/').get(function(req, res){
    noticeService.getNoticeMaxDate(function(result){
        utils.respJsonData(res, result);
    });
});

// -------------------------------设置置顶时间-------------------------------
router.route('/doUpNotice/').put(function(req,res) {
    var id = req.body.id;
    noticeService.doUpNotice(id,function(result){
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
        var fields = {_id:0, notice_title: 1, notice_content: 1, notice_type: 1}; // 待返回的字段
        noticeService.getNoticeInfo(id,fields,function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------update修改-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//id
        var notice_title = req.body.notice_title;//公告标题
        var notice_type = req.body.notice_type;//公告类型
        var notice_content = req.body.notice_content;//公告内容

        // 验证公告标题是否为空
        if(!notice_title) {
            utils.respMsg(res, false, '2005', '公告标题不能为空。', null, null);
        }
        // 验证公告类型是否为空
        if(!notice_type) {
            utils.respMsg(res, false, '2006', '公告类型不能为空。', null, null);
        }
        // 验证公告内容是否为空
        if(!notice_content) {
            utils.respMsg(res, false, '2007', '公告内容不能为空。', null, null);
        }

        //构造保存参数
        var systemNoticeEntity = {};
        systemNoticeEntity.notice_title = notice_title;
        systemNoticeEntity.notice_type = notice_type;
        systemNoticeEntity.notice_content = notice_content;
        systemNoticeEntity.notice_issuer = utils.getCurrentUser(req)._id;
        systemNoticeEntity.notice_status = 1;
        systemNoticeEntity.notice_date = new Date();

        var conditions = {_id: id};
        var update = {$set: systemNoticeEntity};
        noticeService.updateNotice(conditions,update,function(result){
            utils.respJsonData(res, result);
        });
    })




module.exports = router;
