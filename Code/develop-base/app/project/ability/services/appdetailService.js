var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

/**
 * 获取应用详情
 * @param cb
 */
exports.getAppdetails = function(appid,cb) {
    var sql = "select a.ename,a.serviceport,a.id app_id,a.app_name,a.vist_url,a.update_time,a.`status`,s.max_inst_num,s.min_inst_num,s.images_alias,s.images_name,s.images_version,s.cur_inst_num,s.health_status,s.quality_condition,c.container_name,c.host_ip,c.`status` as constatus,c.id as container_id,s.id as service_id from pass_project_micro_service s,pass_project_container_info c,pass_project_app_info a "+
        " where s.id = c.micro_service_id and s.app_id = a.id and a.id = "+appid+" ORDER BY s.sort_num";
    console.log("获取应用详情1 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取应用详情异常', null, err));
        } else {
            console.log(results);
            cb(utils.returnMsg(true, '0000', '获取应用详情成功', results, null));
        }
    });
};
/**
 * 获取应用详情
 * @param cb
 */
exports.getMicroServices = function(appid,cb) {
    var sql = "select a.id as app_id,a.app_name,a.vist_url,a.`status`,s.id,s.images_alias,s.images_name,s.images_version,s.cur_inst_num,s.health_status,s.update_time,s.quality_condition from pass_project_micro_service s,pass_project_app_info a "+
        " where  s.app_id = a.id and a.id = "+appid+"  ORDER BY s.sort_num ";
    console.log("获取应用详情 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取应用详情异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取应用详情成功', results, null));
        }
    });
};

/**
 * 删除容器
 * @param container_id
 * @param service_id
 * @param cb
 */
exports.delContainer = function(service_id,cb) {
    //注：为做演示，这里做随机删除一条，后续改为调用马拉松删除一个容器
    var sql = "delete from pass_project_container_info where micro_service_id='"+service_id+"' order by rand() limit 1";
    console.log("删除容器 ====",sql);
    //容器删除
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除容器异常', null, err));
        } else {
            //数量减1
            var update_sql="UPDATE pass_project_micro_service" +
                " SET cur_inst_num = cur_inst_num - 1" +
                " WHERE" +
                " id = '"+service_id+"'";
            console.log("修改服务 ====",update_sql);
            mysqlPool.query(update_sql, function(err,results) {
                if(err) {
                    cb(utils.returnMsg(false, '1000', '获取应用详情异常', null, err));
                } else {
                    //获取马拉松数据，并插入数据库
                    //function(){
                    // var delete_sql='delete * from pass_project_container_info';
                    // 重新插入
                    // inert(){} ...............
                    //
                    // }
                    //获取数据库对应微服务信息
                    var find_sql="SELECT" +
                        " a.id app_id," +
                        " a.app_name," +
                        " a.vist_url," +
                        " a.update_time," +
                        " a.`status`," +
                        " s.max_inst_num," +
                        " s.min_inst_num," +
                        " s.images_alias," +
                        " s.images_name," +
                        " s.images_version," +
                        " s.cur_inst_num," +
                        " s.health_status," +
                        " s.quality_condition," +
                        " c.container_name," +
                        " c.host_ip," +
                        " c.`status` AS constatus," +
                        " c.id AS container_id," +
                        " s.id AS service_id" +
                        " FROM" +
                        " pass_project_micro_service s," +
                        " pass_project_container_info c," +
                        " pass_project_app_info a" +
                        " WHERE" +
                        " s.id = c.micro_service_id" +
                        " AND s.app_id = a.id" +
                        " AND c.micro_service_id='"+service_id+"'" +
                        " ORDER BY" +
                        " s.id";
                    mysqlPool.query(find_sql, function(err,results) {
                        if(err) {
                            cb(utils.returnMsg(false, '1000', '获取应用详情异常', null, err));
                        } else {
                            cb(utils.returnMsg(true, '0000', '删除成功', results, null));
                        }
                    });

                }
            });
        }
    });
};


exports.addContainer = function(service_id,app_id,cb) {

    var containerData= {
        'app_id':app_id,
        'micro_service_id':service_id,
        'hostname':'mesos-master1',
        'container_name':'kong',
        'container_ip':'127.0.0.1',
        'host_ip':'192.168.9.61',
        'port':'31134',
        'status':'1'
    };

    var sql = "insert  pass_project_container_info" +
        "(app_id,micro_service_id,hostname,container_name,container_ip,host_ip,port,status,update_time)" +
        " values('"+containerData.app_id+"','"+containerData.micro_service_id+"','"+containerData.hostname+"','"+containerData.container_name+"'" +
        ",'"+containerData.container_ip+"','"+containerData.host_ip+"'," +
        "'"+containerData.port+"','"+containerData.status+"',now()) " ;
    console.log("新增容器 ====",sql);
    mysqlPool.query(sql, function(err,addResults) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '新增容器异常', null, err));
        } else {
            var update_sql="UPDATE pass_project_micro_service" +
                " SET cur_inst_num = cur_inst_num + 1" +
                " WHERE" +
                " id = '"+service_id+"'";
            console.log("修改服务 ====",update_sql);
            mysqlPool.query(update_sql, function(err,results) {
                if(err) {
                    cb(utils.returnMsg(false, '1000', '新增容器异常', null, err));
                } else {
                    //获取马拉松数据，并插入数据库
                    //function(){
                    // var delete_sql='delete * from pass_project_container_info';
                    // 重新插入
                    // inert(){} ...............
                    //
                    // }
                    var find_sql="SELECT" +
                        " a.id app_id," +
                        " a.app_name," +
                        " a.vist_url," +
                        " a.update_time," +
                        " a.`status`," +
                        " s.max_inst_num," +
                        " s.min_inst_num," +
                        " s.images_alias," +
                        " s.images_name," +
                        " s.images_version," +
                        " s.cur_inst_num," +
                        " s.health_status," +
                        " s.quality_condition," +
                        " c.container_name," +
                        " c.host_ip," +
                        " c.`status` AS constatus," +
                        " c.id AS container_id," +
                        " s.id AS service_id" +
                        " FROM" +
                        " pass_project_micro_service s," +
                        " pass_project_container_info c," +
                        " pass_project_app_info a" +
                        " WHERE" +
                        " s.id = c.micro_service_id" +
                        " AND s.app_id = a.id" +
                        " AND c.micro_service_id='"+service_id+"'" +
                        " ORDER BY" +
                        " s.id";
                    console.log("查询容器 ====",find_sql);
                    mysqlPool.query(find_sql, function(err,results) {
                        if(err) {
                            cb(utils.returnMsg(false, '1000', '新增容器异常', null, err));
                        } else {
                            cb(utils.returnMsg(true, '0000', '新增容器成功', results, null));
                        }
                    });
                }
            });

        }
    });
};



/*
获取对应容器详细信息
 */
exports.queryContainer = function(container_id,cb) {

    var sql = "SELECT a.`port`,a.container_name,a.hostname,a.host_ip,a.container_ip,b.ename,b.serviceport,a.`port` container_port" +
        " FROM" +
        " pass_project_container_info a," +
        " pass_project_app_info b" +
        " WHERE" +
        " a.app_id=b.id and " +
        " a.id = '"+container_id+"' "
    console.log("获取容器 ====",sql);
    mysqlPool.query(sql, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取容器异常', null, err));
        } else {
            if(results.length > 0 ){

                cb(utils.returnMsg(true, '0000', '获取容器成功', results, null));
            }else{
                cb(utils.returnMsg(false, '1000', '不存在的容器', null, null));
            }
        }
    });
};
