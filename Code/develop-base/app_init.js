var deployedInfoSyncJob = require('./app/common/job/services/deployedInfoSyncJob');
var projectService = require('./app/project/dpm/services/projectService');
var colonyManageService = require('./app/project/operation/services/colonyManageService');
var updateHostInfo=require("./app/project/operation/services/updateHostInfo");
/**
 * 系统启动时加载的内容
 * @param app
 */
exports.$ = function() {
    //启动健康检查定时任务
    setInterval(function(){
        // deployedInfoSyncJob.doJob();
        // projectService.refreshMarathonLbInfo();
    },10000);
    //启动健康检查定时任务
    setInterval(function(){
        // deployedInfoSyncJob.doJob();
        // projectService.refreshMarathonLbInfo();
        // colonyManageService.syncColonyInfo();
        // updateHostInfo.getSalve();
    },1000*60*10);
};