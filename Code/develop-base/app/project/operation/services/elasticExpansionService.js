/*
 create by wangwenjing 17.12.26
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');

var https = require('https');
/**********************策略列表查询
 * @param page 第几页
 * @param size 每页多少条
 * @param conditionMap 查询条件
 *********************************/
exports.findList = async function (conditionMap,cb) {
  /*
   CREATE TABLE `pass_project_tactics_info` (
   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
   `app_id` int(11) NOT NULL COMMENT '应用编号',
   `micro_service_id` int(11) NOT NULL COMMENT '微服务编号',
   `tactics_name` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '策略名称',
   `gather_value` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '采集值',
   `duration` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '持续时间',
   `target_value` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '目标值',
   `tactics_count` int(11) DEFAULT NULL COMMENT '次数',
   `tactics` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '策略',
   `remark` varchar(500) COLLATE utf8_bin DEFAULT NULL COMMENT '备注',
   `status` varchar(2) COLLATE utf8_bin DEFAULT NULL COMMENT '状态',
   PRIMARY KEY (`id`,`app_id`,`micro_service_id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='策略信息表';

   CREATE TABLE `pass_project_micro_service` (
   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
   `app_id` int(11) NOT NULL COMMENT '应用编号',
   `images_alias` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '镜像别名',
   `images_name` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '镜像名称',
   `images_version` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '镜像版本',
   `cur_inst_num` int(11) DEFAULT NULL COMMENT '当前实例数',
   `min_inst_num` int(11) DEFAULT NULL COMMENT '最小实例数',
   `max_inst_num` int(11) DEFAULT NULL COMMENT '最大实例数',
   `health_status` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '健康状态',
   `quality_condition` varchar(500) COLLATE utf8_bin DEFAULT NULL COMMENT '质量情况',
   `update_time` datetime DEFAULT NULL COMMENT '最后更新时间',
   `first_deploy_time` datetime DEFAULT NULL COMMENT '首次部署时间',
   PRIMARY KEY (`id`,`app_id`)
   ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='微服务表';
   CREATE TABLE `pass_project_app_info` (
   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
   `app_name` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '应用名称',
   `vist_url` varchar(200) COLLATE utf8_bin DEFAULT NULL COMMENT '访问地址',
   `update_time` datetime DEFAULT NULL COMMENT '最后更新时间',
   `status` varchar(2) COLLATE utf8_bin DEFAULT NULL COMMENT '状态',
   `project_manager` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT '负责人',
   `type` int(11) DEFAULT NULL COMMENT '1灰度、2正式',
   PRIMARY KEY (`id`)
   ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='应用表';
*/  var sql = "select * from pass_project_tactics_info t left join pass_project_micro_service m on t.micro_service_id = m.id "+
                                                                               " left join pass_project_app_info a on t.app_id = a.id "+
                                                                               "where 1=1";
    var condition =[];
    if(conditionMap){
        if(conditionMap.status){
            sql += " and (t.status = ?)";
            condition.push(conditionMap.status);
        }
        if(conditionMap.app_id){
            sql += " and (t.app_id = ?)";
            condition.push(conditionMap.app_id);
        }
        if(conditionMap.micro_service_id){
            sql += " and (t.micro_service_id = ?)";
            condition.push(conditionMap.micro_service_id);
        }
    }
    var orderBy = " order by a.id desc";
    sql = sql + orderBy;
    console.log(sql);
    mysqlPool.query(sql,condition,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取策略列表信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取策略列表信息成功', result, null));
        }
    });
}

exports.findOne = async function (page,size,conditionMap,cb) {
   var sql = "select * from pass_project_tactics_info and id = ?";
        var condition =[];
        condition.push(conditionMap.id);
        mysqlPool.query(sql,condition,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取单个策略信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取单个策略列表信息成功', result, null));
        }
    });
}

/**
 * 新增策略列表信息
 * @param data
 * @param cb
 */
exports.add=async function (data,cb){
    var dataList= [];
    dataList.push(data.app_id);
    dataList.push(data.micro_service_id);
    dataList.push(data.tactics_name);
    dataList.push(data.gather_value);
    dataList.push(data.duration);
    dataList.push(data.target_value);
    dataList.push(data.tactics_count);
    dataList.push(data.tactics);
    dataList.push(data.operation);
    dataList.push(data.remark);
    dataList.push(data.status);
     var sql = "insert into pass_project_tactics_info(app_id," +
                                                            "micro_service_id," +
                                                            "tactics_name," +
                                                            "gather_value," +
                                                            "duration," +
                                                            "target_value," +
                                                            "tactics_count," +
                                                            "tactics," +
                                                            "operation," +
                                                            "remark," +
                                                            "status)" +
                                                            "values (?,?,?,?,?,?,?,?,?,?,?)";

    console.log(sql);
        mysqlPool.query(sql,dataList,function(err,result) {
            if(err) {
                cb(utils.returnMsg(false, '1000', '新增策略信息失败', null, err));
            } else {
                cb(utils.returnMsg(true, '0000', '新增策略信息成功', result, null));
            }
        });
}


/**
 * 修改策略列表信息
 * @param data
 * @param cb
 */
exports.update = async function(data,cb){
   console.log("status ="+data[0],'++++++++++++++++++++++++++++++++',data[1]+'+++++++++++++++++++++++++++++++++++++++++++++++99999999999999999999999999999999999999999999')
    var sql = "update pass_project_tactics_info set status= ?  where id = ?";
    console.log(sql);
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新策略信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新策略信息成功', result, null));
        }
    });
};

/**
 * 删除资源列表信息
 * @param id
 * @param cb
 */
exports.delete = async function(id, cb) {
    var sql = "delete from pass_project_tactics_info where id = ?";
    mysqlPool.query(sql,[id],function (err,result) {
        if(err){
            cb(utils.returnMsg(false,'1000','删除策略信息异常',null,err));
        }else{
            cb(utils.returnMsg(true,'0000','删除策略信息成功',result,null));
        }
    })
}



exports.findMicroServiceList = async function (conditionMap,cb) {
    var sql = "select m.images_alias as images_alias," +
        "m.images_name as images_name," +
        "m.images_version as images_version," +
        "m.cur_inst_num as cur_inst_num," +
        "m.min_inst_num as min_inst_num," +
        "m.max_inst_num as max_inst_num," +
        "m.health_status as health_status," +
        "m.quality_condition as quality_condition," +
        "m.id as micro_service_id," +
        "a.id as id," +
        "a.app_name as app_name" +
        " from pass_project_micro_service m "+
        " left join pass_project_app_info a on m.app_id = a.id "+
        "where 1=1";
    var condition =[];
    //if(conditionMap.app_id){
    //    sql += " and (m.app_id = ?)";
    //    condition.push(conditionMap.app_id);
    //}
    console.log("conditionMap"+conditionMap.id);
    if(conditionMap.id){
        sql += " and (m.id = ?)";
        condition.push(conditionMap.id);
    }
    var orderBy = " order by a.id desc";
    sql = sql + orderBy;
    console.log(sql);
    mysqlPool.query(sql,condition,function(err,result) {
        if(err) {
            console.log(result);
            cb(utils.returnMsg(false, '1000', '获取微服务列表信息异常', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '获取微服务列表信息成功', result, null));
        }
    });
}