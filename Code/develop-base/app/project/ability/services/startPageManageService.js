/**
 * Created by Administrator on 2017/10/23 0023.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

exports.getStartPageManage=function (page,size,conditionMap,cb) {
    console.log('===service==');
    var sql="select * from pass_develop_startPage_info";
    var orderBy = "";
    var conditions=conditionMap;
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
}

exports.add=function(data,cb){
    var sql="insert into pass_develop_startPage_info(showType,imageName,imageType,imagePath) values(?,?,?,?) ";
    mysqlPool.query(sql,data,function(err){
        if(err) {
            cb(utils.returnMsg(false, '1000', '图片增加失败', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '增加图片成功',null, null));
        }
    })
};
exports.getStartPageManageUpdate=function (page, size, data, cb) {
    var sql='select * from pass_develop_startPage_info t where id="'+data+'"';
    var conditions=data;
    mysqlPool.query(sql,conditions,function(err,results) {
        if(err) {
            cb({'rows':{},'success':"查询失败"});
        } else {
            cb({'rows':results,'success':"成功查询"});
        }
    });
};

exports.update=function (sql,data,cb) {
    mysqlPool.query(sql,data,function(err){
        if(err) {
            cb(utils.returnMsg(false, '1000', '图片修改失败', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '图片修改成功',null, null));
        }
    })
};
//删除
exports.deleteInfo = function(id, cb) {
    var sql="delete from pass_develop_startPage_info where id= "+id;

    mysqlPool.query(sql,null,function (err) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除失败', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '删除成功',null, null));
        }
    });
};