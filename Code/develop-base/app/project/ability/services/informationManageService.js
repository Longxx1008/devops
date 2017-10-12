/**
 * Created by Administrator on 2017/9/26 0026.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');


exports.add=function(data,cb){
    var sql="insert into pass_develop_information_info(information_title,information_issuer_id,information_issuer,information_create_time,information_view_count,information_type,information_content,information_picture_name,information_link,information_status,information_introduce,information_picture_type,information_picture) values(?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    mysqlPool.query(sql,data,function(err){
        if(err) {
            cb(utils.returnMsg(false, '1000', '上传文章失败', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '上传文章成功',null, null));
        }
    })
};
exports.update=function(sql,data,cb){
    mysqlPool.query(sql,data,function (err) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新文章失败', null, err));
        } else {
            console.log('----------------');
            cb(utils.returnMsg(true, '0000', '更新文章成功',null, null));
        }
    });
};


exports.deleteInfo = function(id, cb) {
    var sql="delete from pass_develop_information_info where id= "+id;

    mysqlPool.query(sql,null,function (err) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除文章失败', null, err));
        } else {

            cb(utils.returnMsg(true, '0000', '删除文章成功',null, null));
        }
    });

};

// exports.add_test=function(data,cb){
//     var sql="insert into pass_develop_information_info(information_title,information_type,information_picture_name,information_picture_type,information_picture) values(?,?,?,?,?) ";
//     mysqlPool.query(sql,data,function(err){
//         if(err) {
//             cb(utils.returnMsg(false, '1000', '创建集群信息异常', null, err));
//         } else {
//             cb(utils.returnMsg(true, '0000', '创建集群信息成功',null, null));
//         }
//     })
// };

exports.getInformationManage=function(sql,page, size, data, cb) {
    console.log("-==================-------------"+data);
    // var sql='select * from pass_develop_information_info t where information_issuer_id="'+data+'"';
   //information_title,information_issuer,information_view_count,information_status,information_create_time
    var orderBy = " order by t.information_create_time ";
    var conditions=data;
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
    // mysqlPool.query(sql,data,function(err,results){
    //     if(err) {
    //         cb(utils.returnMsg(false, '1000', '获取数据失败', null, err));
    //     } else {
    //         cb(utils.returnMsg(true, '0000', '获取数据成功',results, null));
    //     }
    // })
};

exports.getInformationManageUpdate=function(page, size, data, cb) {
    console.log("-==================-------------"+data);
    var sql='select * from pass_develop_information_info t where id="'+data+'"';
    // var orderBy = " order by t.information_create_time ";
    var conditions=data;
            // var count_sql = " select count(1) as sum from ("+select_sql+") aa";
            mysqlPool.query(sql,conditions,function(err,results) {
                if(err) {
                    cb({'rows':{},'success':"查询失败"});
                } else {
                    cb({'rows':results,'success':"成功查询"});
                }
            });
};