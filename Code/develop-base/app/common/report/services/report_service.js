var model = require('../../core/models/report_model');
var utils = require('../../core/utils/app_utils');
var tree = require('../../core/utils/tree_utils');


/**
 * 分页查询参数信息
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getReportList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$CommonReport, page, size, conditionMap, cb, null, {});
}

/**
 * 新增报表
 * @param data
 * @param cb
 */
exports.saveReport = function(data, cb) {
    model.$CommonReport(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增报表时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增报表成功。', null, null));
        }
    });
}


/**
 * 修改报表
 * @param data
 * @param cb
 */
exports.updateReport = function(id, data, cb) {

    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonReport.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改报表时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改报表成功。', null, null));
        }
    });
}

/**
 * 保存修改报表内容
 * @param data
 * @param cb
 */
exports.updateReportContent = function(report_name, data, cb) {

    var conditions = {report_name: report_name};
    var update = {$set: data};

    var options = {};
    model.$CommonReport.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改报表内容时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改报表内容成功。', null, null));
        }
    });
}


/**
 * 获取报表数据
 * @param menu_id
 * @param cb
 */

exports.getReportDetail = function(id, cb) {
    var options = {};
    model.$CommonReport.find({_id:id}, null, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
    });
}



/**
 * 获取参数类别
 * @param cb
 */
exports.getReportCatalogTree = function(sysid,cb) {
    var criteria = {catalog_sysid: sysid};
    var fields ={_id:1, catalog_name:1, catalog_pid:1};
    var options = {};

    model.$CommonReportCataLog.find(criteria, fields, options, function (error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            var catalogArray = new Array();
            result.forEach(function (catalog) {
                var catalogObj = {};
                catalogObj['id'] = catalog._id;
                catalogObj['text'] = catalog.catalog_name;
                catalogObj['pid'] = catalog.catalog_pid;
                //menuObj['iconCls'] = 'icon-role-menu';
                //menuObj['attributes'] = {'nav': menu.menu_nav};

                catalogArray.push(catalogObj);
            });
            cb(tree.transData(catalogArray, "id", "pid"));
            //cb(tree.buildEasyuiTree(result, "_id", "menu_name", "menu_pid", ["menu_nav"]));
        }
    });
}


/**
 * 新增报表类别
 * @param data
 * @param cb
 */
exports.saveReportCatalog = function(data, cb) {
    model.$CommonReportCataLog(data).save(function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '新增报表类别时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增报表类别成功。', null, null));
        }
    });
}

/**
 * 修改报表类别
 * @param data
 * @param cb
 */
exports.updateReportCatalog = function(id, data, cb) {

    var conditions = {_id: id};
    var update = {$set: data};

    var options = {};
    model.$CommonReportCataLog.update(conditions, update, options, function(error){
        if(error) {
            cb(utils.returnMsg(false, '1000', '修改报表类别时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '修改报表类别成功。', null, null));
        }
    });
}

/**
 * 获取类别数据
 * @param id
 * @param cb
 */

exports.getReportCatalog = function(id, cb) {
    var options = {};
    model.$CommonReportCataLog.find({_id:id}, null, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
});
}

/**
 * 根据报表ID获取role信息
 * @param id
 * @param cb
 */

exports.getReportRole = function(id, cb) {
    var options = {};
    model.$CommonReportRole.find({report_id:id}, null, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
    });
}

/**
 * 保存报表ID及role信息
 * @param id
 * @param cb
 */

exports.saveReportRole = function(report_id,datas, cb) {
    //var options = {};
    //var conditions = {report_id: report_id};
   // model.$CommonReportRole.remove({report_id:report_id}, null, options, function(error, result) {
        // 清空role_id相关数据
    var conditions = {report_id:report_id};
        //model.$CommonRoleMenuOptModel
    model.$CommonReportRole.remove(conditions, function (error) {
        if(error) {
            cb(new Array());
        }
        else {
            var reRoles = new Array();
            datas.forEach(function(data){
                reRoles.push({report_id: report_id,role_id:data});
            });
            model.$CommonReportRole.create(reRoles, function(err, docs) {
                if(error) {
                    cb(utils.returnMsg(false, '1001', '分配角色权限时出现异常。', null, error));
                }
                else {
                    cb(utils.returnMsg(true, '0000', '分配角色权限成功。', null, null));
                }
            });
        }
    });
}