/**
 * Created by zhaojing on 2016/3/09.
 */

var express = require('express');
var router = express.Router();

var utils = require('../../../common/core/utils/app_utils');
var roleService = require('../services/role_service');

router.route('/')

    // -------------------------------query查询列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var roleCode = req.query.role_code;
        var roleStatus = req.query.role_status;
        var roleSysId = req.query.sys_id;
        var roleName = req.query.role_name;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(roleCode){
            conditionMap['$or'] = [{'role_code':new RegExp(roleCode)},{'role_name':new RegExp(roleCode)}];
        }
        if(roleStatus && roleStatus != -1){
            conditionMap.role_status = parseInt(roleStatus);
        }
        if(roleSysId){
            conditionMap.sys_id = roleSysId;
        }
        if(roleName){
            conditionMap.role_name = roleName;
        }
        // 调用分页
        roleService.getRoleList(page, length, conditionMap,  function(result){
            utils.respJsonData(res, result);
        });
    })

    // -------------------------------create添加-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var role_code = req.body.role_code;//角色编号
        var role_name = req.body.role_name;//角色名
        var role_status = req.body.role_status;//角色状态
        var sys_id = req.body.sys_id;//系统id
        var role_order = req.body.role_order;//角色排序号
        var role_remark = req.body.role_remark;//角色备注

        // 验证角色编号是否为空
        if(!role_code) {
            utils.respMsg(res, false, '2001', '角色编码不能为空。', null, null);
        }
        // 验证角色名是否为空
        if(!role_name) {
            utils.respMsg(res, false, '2002', '角色名称不能为空。', null, null);
        }
        // 验证角色状态是否为空
        if(!role_status) {
            utils.respMsg(res, false, '2003', '角色状态不能为空。', null, null);
        }
        // 验证系统id是否为空
        if(!sys_id) {
            utils.respMsg(res, false, '2004', '系统不能为空。', null, null);
        }
        // 验证角色排序号是否为空
        if(!role_order) {
            utils.respMsg(res, false, '2005', '排序号不能为空。', null, null);
        }

        //构造角色保存参数
        var roleEntity = {};
        roleEntity.role_code = role_code;
        roleEntity.role_name = role_name;
        roleEntity.role_status = role_status;
        roleEntity.sys_id = sys_id;
        roleEntity.role_order = role_order;
        if(role_remark){
            roleEntity.role_remark = role_remark;
        }

        // 调用业务层保存方法
        roleService.saveRole(roleEntity, function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/roleMenuOptTree/:roleid/:sysid')

    // -------------------------------获取菜单及操作权限树-------------------------------
    .get(function(req,res){
        var systemId = req.params.sysid;
        var roleId = req.params.roleid;
        console.log(roleId);

        if(roleId && roleId != 0){
            // 获取当前角色分配的菜单及操作
            roleService.getRoleHasMenusAndOpts(roleId, function(result){
                utils.respJsonData(res, result);
            });
        }else {
            // 获取系统菜单及操作
            roleService.getMenuAndOptTreeBySys(systemId, function(result){
                utils.respJsonData(res, result);
            });
        }
    });

router.route('/setPermission/:roleid')

    // -------------------------------获取菜单及操作权限树-------------------------------
    .post(function(req,res){
        var roleId = req.params.roleid;
        var menusJsonStr = req.body.menus;
        console.log(roleId);
        console.log(menusJsonStr);

        var menusJson = JSON.parse(menusJsonStr);
        roleService.saveRoleMenuOpt(roleId, menusJson, function(result){
            utils.respJsonData(res, result);
        });
    });

router.route('/:id')
    // -------------------------------update修改-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//系统id
        var role_code = req.body.role_code;//角色编号
        var role_name = req.body.role_name;//角色名
        var role_status = req.body.role_status;//角色状态
        var sys_id = req.body.sys_id;//系统id
        var role_order = req.body.role_order;//角色排序号
        var role_remark = req.body.role_remark;//角色备注

        // 验证角色编号是否为空
        if(!role_code) {
            utils.respMsg(res, false, '2001', '角色编码不能为空。', null, null);
        }
        // 验证角色名是否为空
        if(!role_name) {
            utils.respMsg(res, false, '2002', '角色名称不能为空。', null, null);
        }
        // 验证角色状态是否为空
        if(!role_status) {
            utils.respMsg(res, false, '2003', '角色状态不能为空。', null, null);
        }
        // 验证系统id是否为空
        if(!sys_id) {
            utils.respMsg(res, false, '2004', '系统不能为空。', null, null);
        }
        // 验证角色排序号是否为空
        if(!role_order) {
            utils.respMsg(res, false, '2005', '排序号不能为空。', null, null);
        }

        var roleEntity = {};
        roleEntity.role_code = role_code;
        roleEntity.role_name = role_name;
        roleEntity.role_status = role_status;
        roleEntity.sys_id = sys_id;
        roleEntity.role_order = role_order;
        if(role_remark){
            roleEntity.role_remark = role_remark;
        }

        // 调用修改方法
        roleService.updateRole(id, roleEntity, function(result) {
            utils.respJsonData(res, result);
        });
    });

module.exports = router;