/**
 * Created by szx on 2018/2/1.
 */
var express = require('express');
var router = express.Router();
var healthService = require('../services/healthServices');

router.route('/')
    .get(function(req,res){

        console.log("axs");
        //var page=req.query.page;
        //var size=req.query.rows;
        var page=3;
        var size=1;
        var conditionMap = {}
        //testService.getHealth(page,size,conditionMap,function(result){
        //    console.log('========resss============',result);
        //    //utils.respJsonData(res,result);
        //    res.send(result);
        //});
        //var sql="select * from pass_project_app_info where 1=1"
        healthService.getHealth(conditionMap).then(function(res_h){
            //console.log("ress",res_h);
            //console.log("resss",res_h.data[0].id);
            if(res_h.success){
                //console.log("ddd",res_h.data.length)
                for(var i=0;i<res_h.data.length;i++){
                    var app_id=res_h.data[i].id;
                    var arr=res_h.data[i];
                    healthService.getHealth_micro(app_id,arr).then(function (result) {
                        //console.log(res.data[0].id)
                        //console.log(result)
                        //console.log(app_id);
                        healthService.getHealth_check(app_id,result.data).then(function(res_c){
                            console.log("reccc",res_c);
                            res.send(res_c);
                        });
                    });
                }

            }else{
                utils.respMsg(res, false, '1000', '查询数据异常', null, null);
            }
        });
    })
    .post(function(req,res){

    });

module.exports = router;
