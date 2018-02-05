/**
 * Created by 兰 on 2017-09-26.
 */
var utils = require('../../../common/core/utils/app_utils');





exports.getDetailMsgByNumber = function (service_id, serial_number,cb) {


    var sql = "SELECT M.*,C.container_ip,C.host_ip,C.port from pass_project_method_info M left join pass_project_container_info C on M.container_id=C.id where  M.req_serial_num=" + serial_number+" and M.micro_service_id=" + service_id;
    var orderBy = '';
    utils.pagingQuery4Eui_mysql(sql, orderBy, 0, 10, null, cb);

};


exports.getDetailMsgByNumberPromise =async function (service_id, serial_number) {


    var sql = "SELECT M.*,C.container_ip,C.host_ip,C.port from pass_project_method_info M left join pass_project_container_info C on M.container_id=C.id where  M.req_serial_num=" + serial_number+" and M.micro_service_id=" + service_id;
    var orderBy = '';
    return await utils.pagingQuery4Eui_mysqlPromise(sql, orderBy, 0, 10, null);

};


exports.getServiceType = function (page, size, conditionMap, cb) {

    var sql= "select micro_service_id  from pass_project_method_info  where  req_serial_num=" + conditionMap.serial_number + " group by micro_service_id  order by min(id) asc";
    var conditions = [];
    var orderBy = '';
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);


};


