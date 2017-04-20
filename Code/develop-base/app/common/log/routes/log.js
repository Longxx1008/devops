/**
 * Created by Andrew on 2016/2/22.
 */
var express = require('express');
var fs = require("fs");
var path = require("path");
var router = express.Router();

var utils = require('../../../common/core/utils/app_utils');

var logHelper = require('../../../common/log/utils/log_util.js');


router.route('/updateleve').get(function(req,res){

    console.log(req.query.level);
    logHelper.getLogger('service_log').setLevel(req.query.level);
    res.send("日志修改成功");

});

router.route('/reloadConfig').get(function(req,res){

    console.log(req.query.level);

    // 加载配置文件
    var objConfig = JSON.parse(fs.readFileSync("log4js2.json", "utf8"));

    logHelper.log4js.configure(objConfig);

    res.send("日志重新加载成功");

});


/**
 * 页面展示
 */
router.route('/')
    // query查询列表
    .get(function(req,res){

        var data = req.query.search.value;
        console.log('查询条件：'+data);



        var start = req.query.start;
        var length = req.query.length;
        //start=0&length=10
        //recordsTotal
        console.log('分页参数：start='+req.query.start+',length='+req.query.length);

        var query=model.$.find({}).sort({'_id':-1});
        query.skip(parseInt(start));
        query.limit(parseInt(length));
        if(data){
            query.where('data',new RegExp(data));
        }
        //计算分页数据
        query.exec(function(err,rs){
            if(err){
                //{'success':false,'code':'1000','msg':'根据姓名查询出现异常。','reason':err}
                utils.respMsg(res, false, '1000', '根据内容查询出现异常。', null, err);

            }else{
                //计算数据总数
                model.$.find({'data':new RegExp(data)},function(err,result){
                    if(err){
                        //{'success':false,'code':'1000','msg':'根据姓名查询出现异常。','reason':err}
                        utils.respMsg(res, false, '1000', '根据内容查询出现异常。', null, err);
                    }else {
                        /*{
                         'success': true,
                         'code': '0000',
                         'msg': '根据姓名查询成功。',
                         'data': rs,
                         'recordsTotal': result.length,
                         'recordsFiltered': result.length
                         };*/
                        utils.respMsg4Paging(res, true, '0000', '根据内容查询成功。', rs, result.length);
                    }
                });

            }
        });


    });


module.exports = router;