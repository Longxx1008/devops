/**
 * Created by zhaojing on 2016/3/08.
 */

var express = require('express');
var router = express.Router();

var utils = require('../../../common/core/utils/app_utils');
var service = require('../services/system_service.js');

router.route('/')

    // -------------------------------query查询列表-------------------------------
    .get(function(req,res){

        // 分页条件
        var filter_name = req.query.filter_name;

        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(filter_name){
            conditionMap['$or'] = [{'sys_code':new RegExp(filter_name)},{'sys_name':new RegExp(filter_name)}];
        }

        // 调用分页
        service.getSysList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------create添加-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var systemCode = req.body.sys_code;//系统编码
        var systemName = req.body.sys_name;//系统名
        var systemUrl = req.body.sys_url;//系统访问路径
        var sys_theme_layout = req.body.sys_theme_layout;//系统主题
        var systemStatus = req.body.sys_status;//系统状态
        var systemRemark = req.body.sys_remark;//系统备注
        var systemMainUrl = req.body.sys_main_url;//系统主页访问路径


        // 验证系统编码是否为空
        if(!systemCode) {
            utils.respMsg(res, false, '2001', '系统编码不能为空。', null, null);
        }
        // 验证系统名是否为空
        if(!systemName) {
            utils.respMsg(res, false, '2002', '系统名不能为空。', null, null);
        }
        // 验证系统访问路径是否为空
        if(!systemUrl) {
            utils.respMsg(res, false, '2003', '系统访问路径不能为空。', null, null);
        }
        // 验证系统状态是否为空
        if(!systemStatus) {
            utils.respMsg(res, false, '2004', '系统状态不能为空。', null, null);
        }
        // 验证系统主页访问路径是否为空
        if(!systemMainUrl) {
            utils.respMsg(res, false, '2005', '系统主页访问路径不能为空。', null, null);
        }
        if(!sys_theme_layout) {
            utils.respMsg(res, false, '2006', '系统主题样式不能为空。', null, null);
        }
        //构造系统保存参数
        var systemEntity = {};
        systemEntity.sys_code = systemCode;
        systemEntity.sys_name = systemName;
        systemEntity.sys_url = systemUrl;
        systemEntity.sys_status = systemStatus;
        if(systemRemark){
            systemEntity.sys_remark = systemRemark;
        }
        systemEntity.sys_main_url = systemMainUrl;
        systemEntity.sys_theme_layout = sys_theme_layout;

        // 保存数据
        service.saveSys(systemEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

/*router.route('/combobox/')

    // -------------------------------get获取系统下拉框数据-------------------------------
    .get(function(req,res){
        systemModel.$.find({},{sys_name:1},{}, function (error, result) {
             if(error) {
                utils.respMsg(res, false, '1009', '查询出现异常。', null, error);
             }
             else {
                res.set({'Content-Type': 'text/json', 'Encodeing': 'utf8'});
                res.send(result);
             }
         });
    });*/

router.route('/:id')

    // -------------------------------update修改-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//系统id
        var systemCode = req.body.sys_code;//系统编码
        var systemName = req.body.sys_name;//系统名
        var systemUrl = req.body.sys_url;//系统访问路径
        var sys_theme_layout = req.body.sys_theme_layout;//系统状态
        var systemStatus = req.body.sys_status;//系统状态
        var systemRemark = req.body.sys_remark;//系统备注
        var systemMainUrl = req.body.sys_main_url;//系统主页访问路径

        // 验证id是否为空
        if (!id) {
            utils.respMsg(res, false, '2001', 'id不能为空。', null, null);
        }
        // 验证系统编码是否为空
        if(!systemCode) {
            utils.respMsg(res, false, '2002', '系统编码不能为空。', null, null);
        }
        // 验证系统名是否为空
        if(!systemName) {
            utils.respMsg(res, false, '2003', '系统名不能为空。', null, null);
        }
        // 验证系统访问路径是否为空
        if(!systemUrl) {
            utils.respMsg(res, false, '2004', '系统访问路径不能为空。', null, null);
        }
        // 验证系统状态是否为空
        if(!systemStatus) {
            utils.respMsg(res, false, '2005', '系统状态不能为空。', null, null);
        }
        // 验证系统主页访问路径是否为空
        if(!systemMainUrl) {
            utils.respMsg(res, false, '2006', '系统主页访问路径不能为空。', null, null);
        }
        if(!sys_theme_layout) {
            utils.respMsg(res, false, '2007', '系统主题样式不能为空。', null, null);
        }

        //构造系统修改参数
        var systemEntity = {};
        systemEntity.sys_code = systemCode;
        systemEntity.sys_name = systemName;
        systemEntity.sys_url = systemUrl;
        systemEntity.sys_status = systemStatus;
        if(systemRemark){
            systemEntity.sys_remark = systemRemark;
        }
        systemEntity.sys_main_url = systemMainUrl;
        systemEntity.sys_theme_layout = sys_theme_layout;

        service.updateSys(id, systemEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

module.exports = router;