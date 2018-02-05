/**
 * Created by szx on 2018/2/1.
 */
var express = require('express');
var router = express.Router();
var healthService = require('../services/healthServices');
var utils = require('../../../common/core/utils/app_utils');

router.route('/')
    .get(function(req,res){

        var page = req.query.page;
        var length = req.query.rows;
        var id=req.query.id;
        var conditionMap = {};
        conditionMap.id=id;
        console.log("testssGGGG",conditionMap)

        healthService.pageList(page, length, conditionMap,function(result){
            console.log("GGGGsss",result)
            for(var i=0;i<result.rows.length;i++){
                var json=JSON.parse(result.rows[i].check_content);
                result.rows[i].app=json.app;
                result.rows[i].sql=json.sql;
                result.rows[i].middle=json.middle;

            }
            console.log("GGsssGGsss",result)
            utils.respJsonData(res, result);
        });
    })
    //.get(function(req,res){
    //
    //    console.log("axs");
    //    //var page=req.query.page;
    //    //var size=req.query.rows;
    //    var page=3;
    //    var size=1;
    //    var conditionMap = {}
    //    //testService.getHealth(page,size,conditionMap,function(result){
    //    //    console.log('========resss============',result);
    //    //    //utils.respJsonData(res,result);
    //    //    res.send(result);
    //    //});
    //    //var sql="select * from pass_project_app_info where 1=1"
    //    healthService.getHealth(conditionMap).then(function(res_h){
    //        console.log("ress",res_h);
    //        //console.log("resss",res_h.data[0].id);
    //        if(res_h.success){
    //            var all={}
    //            var k=0;
    //            console.log("ddd",res_h.data.length)
    //            for(var i=0;i<res_h.data.length;i++){
    //                k=i;
    //                var app_id=res_h.data[i].id;
    //                var arr=res_h.data[i];
    //                healthService.getHealth_micro(app_id,arr).then(function (result) {
    //                    //console.log(res.data[0].id)
    //                    //console.log(result)
    //                    //console.log(app_id);
    //                    healthService.getHealth_check(app_id,result.data).then(function(res_c){
    //                        console.log("reccc",res_c);
    //                        all=res_c.data;
    //                        //console.log("recc",res_h.data[k]);
    //                        //res_h.data[k]=all;
    //                        //console.log("res_h",res_h);
    //                        //res.send(res_h);
    //                        res.send(res_c);
    //                    });
    //                });
    //
    //                //console.log("res_hs",all);
    //                //res_h.data[i]=all;
    //                //console.log("res_h",res_h);
    //                //res.send(res_h);
    //            }
    //
    //        }else{
    //            utils.respMsg(res, false, '1000', '查询数据异常', null, null);
    //        }
    //    });
    //})
    .post(function(req,res){

    });
router.route('/:id')
    .get(function(req,res){
    var id = req.params.id;
    var conditionMap={}
    conditionMap.id=id

    console.log("testid",req.params.id)
    healthService.getHealthbase(conditionMap,function(result){
        console.log("testresult",result);
        utils.respJsonData(res, result);
    });

});


module.exports = router;
