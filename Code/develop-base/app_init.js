var deployedInfoSyncJob = require('./app/common/job/services/deployedInfoSyncJob');
var projectService = require('./app/project/dpm/services/projectService');
var colonyManageService = require('./app/project/operation/services/colonyManageService');
var updateHostInfo=require("./app/project/operation/services/updateHostInfo");
var hostManageService = require('./app/project/operation/services/hostManageService');
var utils = require('./app/common/core/utils/app_utils');
var greyenvironmtneService=require('./app/project/operation/services/grayenvironmentmanageservice');
/**
 * 系统启动时加载的内容
 * @param app
 */
exports.$ = function() {
    //启动健康检查定时任务
    /*projectService.refreshMesosInfo();*/
    setInterval(function(){
        // deployedInfoSyncJob.doJob();
        // projectService.refreshMarathonLbInfo();
    },10000);
    //启动健康检查定时任务
    setInterval(function(){
        // deployedInfoSyncJob.doJob();
        // projectService.refreshMarathonLbInfo();
         /*colonyManageService.syncColonyInfo();//同步集群
         hostManageService.syncHostInfo();//同步主机列表*/
        // updateHostInfo.getSalve();
        /*projectService.refreshDeployed(function (result) {});//同步部署marathon信息
        projectService.refreshResource();//同步gitlab上面项目信息*/
        greyenvironmtneService.refreshGrayDeploy();//marathon项目灰度部署情况
        greyenvironmtneService.refreshFormalDeploy("develop-base",function(){});//marathon项目正式部署情况*/
    },7000);
};