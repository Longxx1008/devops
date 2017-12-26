/* 
create by wangwenjing 17.12.26
*/
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');

var https = require('https');
/**********************资源列表查询
 * @param page 第几页
 * @param size 每页多少条
 * @param conditionMap 查询条件
 *********************************/
exports.pageList = async function (page,size,conditionMap,cb) {
    var sql = "select * from pass_develop_project_resourcelist where 1=1";
    var conditions = [];
    if(conditionMap){
        if(conditionMap.resource_number){
            sql += " and (resource_number like '%" + conditionMap.resource_number + "%')";
        }
    }
    var orderBy = " order by id asc";
    utils.pagingQuery4Eui_mysql(sql,orderBy,page, size, conditions, cb);
}

/**
 * 新增资源列表信息
 * @param data
 * @param cb
 */
exports.add=async function (data,cb){
    var dataList= [];
    dataList.push(data.resource_number);
    dataList.push(data.resource_name);
    dataList.push(data.resource_state);
    dataList.push(data.resource_apply);
    dataList.push(data.resource_count);
    dataList.push(data.resource_remark);
    var sql = "insert into pass_develop_project_resourcelist(resource_number,resource_name,resource_state,resource_apply,resource_count,resource_remark) values('"+data.resource_number+"','"+data.resource_name+"','"+data.resource_state+"','"+data.resource_apply+"','"+data.resource_count+"','"+data.resource_remark+"')";
    mysqlPool.query(sql,dataList,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '新增失败', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '新增成功', result, null));
        }
    });
}


/**
 * 修改资源列表信息
 * @param data
 * @param cb
 */
exports.update = async function(data,cb){
    var resource_number = data[0];
    var resource_name = data[1];
    var resource_state = data[2];
    var resource_apply = data[3];
    var resource_count = data[4];
    var resource_remark = data[5];
    var id = data[6];
    console.log(data[0],data[1],data[2],data[3],data[4],'++++++++++++++++++++++++++++++++',data[5]+'+++++++++++++++++++++++++++++++++++++++++++++++99999999999999999999999999999999999999999999')
    var sql = "update pass_develop_project_resourcelist set resource_number='"+resource_number+"',resource_name='"+resource_name+"',resource_state='"+resource_state+"',resource_apply='"+resource_apply+"',resource_count='"+resource_count+"',resource_remark='"+resource_remark+"' where id='"+id+"'";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新策略异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新策略成功', result, null));
        }
    });
};

/**
 * 删除资源列表信息
 * @param id
 * @param cb
 */
exports.delete = async function(id, cb) {
    var sql = "delete from pass_develop_project_resourcelist where id = ?";
    mysqlPool.query(sql,[id],function (err,result) {
        if(err){
            cb(utils.returnMsg(false,'1000','删除资源列表信息异常',null,err));
        }else{
            cb(utils.returnMsg(true,'0000','删除资源列表信息成功',result,null));
        }
    })

}