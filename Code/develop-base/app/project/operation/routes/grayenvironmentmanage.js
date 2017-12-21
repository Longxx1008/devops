/**
 * Created by acer on 2017/5/11.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var greyenvironmtneService = require('../services/grayenvironmentmanageservice');
var utils = require('../../../common/core/utils/app_utils');


//获取平台信息 /grayenvironmentmanage/platform/info
router.route("/platform/info").get(function(req,res){
    greyenvironmtneService.getPlatfrom().then(function(rs){
        utils.respJsonData(res,rs)
    })
});

//获取灰度部署信息
router.route("/deploy/info").get(function(req,res){
    var gitlabProjectId=req.query.gitlabProjectId;
    //console.log("gitlabProjectIdgitlabProjectIdgitlabProjectId"+gitlabProjectId);
    greyenvironmtneService.getDeploy(gitlabProjectId,function(rs){
        utils.respJsonData(res,rs)
    })
});

//启动灰度部署
router.route("/start").get(function(req,res){
    var instance=req.query.instance;
    var imageName=req.query.imageName;
    var projectCode=req.query.projectCode;
    console.log("ssss"+instance+imageName+projectCode);
    greyenvironmtneService.start(instance,imageName,projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});
//启动正式部署
router.route("/startFormal").get(function(req,res){
    var instance=req.query.instance;
    var imageName=req.query.imageName;
    var projectCode=req.query.projectCode;
    console.log("ssss"+instance+imageName+projectCode);
    greyenvironmtneService.startFormal(instance,imageName,projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});
//启动蓝绿部署
router.route("/startBlueFormal").get(function(req,res){
    var instance=req.query.instance;
    var imageName=req.query.imageName;
    var projectCode=req.query.projectCode;
    console.log("ssss"+instance+imageName+projectCode);
    greyenvironmtneService.startBlueFormal(instance,imageName,projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});

//更新灰度部署
router.route("/update").get(function(req,res){
    var instance=req.query.instance;
    var imageName=req.query.imageName;
    var projectCode=req.query.projectCode;
    console.log("ssss"+instance+imageName+projectCode);
    greyenvironmtneService.update(instance,imageName,projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});

//更新正式部署
router.route("/updateFormal").get(function(req,res){
    var instance=req.query.instance;
    var imageName=req.query.imageName;
    var projectCode=req.query.projectCode;
    console.log("ssss"+instance+imageName+projectCode);
    greyenvironmtneService.updateFormal(instance,imageName,projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});

//更新蓝绿部署
router.route("/updateBlueFormal").get(function(req,res){
    var instance=req.query.instance;
    var imageName=req.query.imageName;
    var projectCode=req.query.projectCode;
    greyenvironmtneService.updateBlueFormal(instance,imageName,projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});
//更新灰度部署表
router.route("/refreshGrayDeploy").get(function(req,res){
    greyenvironmtneService.refreshGrayDeploy();
});

//更新正式部署表
router.route("/refreshFormalDeploy").get(function(req,res){
    greyenvironmtneService.refreshFormalDeploy(projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});

//读取灰度表和实例表
router.route("/getGrayDeploy").get(function(req,res){
    var page = req.query.page;
    var length = req.query.rows;
    var gitlabProjectId = req.query.gitlabProjectId;
    var conditionMap = {};
    if(gitlabProjectId){
        conditionMap.gitlabProjectId = gitlabProjectId;
    }
    // 调用分页
    greyenvironmtneService.pageList(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});

//读取正式表和实例表
router.route("/formaldeploy/info").get(function(req,res){
    var page = req.query.page;
    var length = req.query.rows;
    var gitlabProjectId = req.query.gitlabProjectId;
    var conditionMap = {};
    if(gitlabProjectId){
        conditionMap.gitlabProjectId = gitlabProjectId;
    }
    // 调用分页
    greyenvironmtneService.pageListFormal(page, length, conditionMap,function(result){
        utils.respJsonData(res, result);
    });
});
/***************运维中心-环境发布-获取项目健康情况*****************/
router.route("/environment/project").get(function(req,res){
   greyenvironmtneService.getProjectSituation().then(function(rs){
       utils.respJsonData(res,rs);
       console.log(res+'==============='+rs);
   })
})
//获取正式部署情况
router.route("/getFormalDeploy").get(function(req,res){
    var gitlabProjectId=req.query.gitlabProjectId;
    greyenvironmtneService.getFormalDeploy(gitlabProjectId,function(rs){
        utils.respJsonData(res,rs)
    })
})
router.route("/getFormalVersion").get(function(req,res){
    var projectCode=req.query.projectCode;
    greyenvironmtneService.getFormalVersion(projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});
router.route("/updateAllFormalFlag").get(function(req,res){
    var projectCode=req.query.projectCode;
    greyenvironmtneService.updateAllFormalFlag(projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});
router.route("/deleteBlue").get(function(req,res){
    var projectCode=req.query.projectCode;
    greyenvironmtneService.deleteBlue(projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});
router.route("/deleteBlueRecordFromTable").get(function(req,res){
    var projectCode=req.query.projectCode;
    greyenvironmtneService.deleteBlueRecordFromTable(projectCode,function(rs){
        utils.respJsonData(res,rs)
    })
});
module.exports = router;