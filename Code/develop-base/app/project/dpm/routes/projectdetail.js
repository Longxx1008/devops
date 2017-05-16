/**
 * Created by yaluo on 2017/4/21.
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var projectService = require('../services/projectDetailService');
var utils = require('../../../common/core/utils/app_utils');
// 连接服务
var gitlab = require('gitlab')({
    url   : config.platform.gitlabUrl,
    token : config.platform.private_token
});

//分页查询项目数据列表
//api/project/npm/serviceEdit/develop/se/pageList?13
router.route('/develop/pd/detail/:id').get(function(req,res){
    var userName = req.session.current_user.user_no;
    var projectId = req.params.id;
    console.log("----------------------------------------------------------")
    console.log(projectId);
    var conditionMap = {};
        conditionMap.userName=userName;
        conditionMap.projectId = projectId;
    projectService.list(conditionMap, function (results) {
        var result=JSON.parse(JSON.stringify(results))
        utils.respJsonData(res,result);
    });
});


router.route('/develop/pd/addchildnode/:id').post(function(req,res){
    var userName = req.session.current_user.user_no;
    var projectId = req.params.id;
    console.log(projectId);
    var conditionMap = {};
    var retrunResult = [];
    conditionMap.userName=userName;
    conditionMap.parentId = projectId;
    projectService.addchild(conditionMap,function (result) {

        utils.respJsonData(res, result);
    });
});

router.route('/develop/pd/updatechildnode').post(function(req,res){
    var userName = req.session.current_user.user_no;
    var id = req.body.id;
    var menuName=req.body.menuName;
    var condition = [];
    condition.push(menuName);
    condition.push(userName);
    condition.push(id);
    projectService.updatechild(condition,function (result) {
        utils.respJsonData(res, result);
    });
});


router.route('/develop/pd/selectChileNode').post(function(req,res){
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    var id = req.body.id;
    var condition = [];
    condition.push(id);
    projectService.selectChild(condition,function (result) {
        utils.respJsonData(res, result);
    });
});

router.route('/develop/pd/selectContent').post(function(req,res){
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    var userName = req.session.current_user.user_no;
    var id = req.body.id;
    var condition = [];

    condition.push(id);
    projectService.selectContent(condition,function (result) {
        utils.respJsonData(res, result);
    });
});

router.route('/develop/pd/updatecontent').post(function(req,res) {
    var id = req.body.id;
    var content = req.body.content;
    content=decodeURIComponent(content);
    console.info(content);
    var path = config.project.appurl;
    var src=null;
    var reg_img = /<img[^>]+>/g;
    var arr_img = content.match(reg_img);
    var l = arr_img.length;
    src='  src="'+path+"/";
    var reg = /\ssrc="/ig;
    console.info(content);
    content=content.replace(reg,src)
    var condition = [];
    condition.push(content);
    condition.push(id);
    projectService.updateContent(condition,function (result) {
        utils.respJsonData(res, result);
    });
});

router.route('/develop/pd/deletenode/:id').delete(function(req,res){

    var id = req.params.id;

    projectService.deleteNode(id,function (result) {
        utils.respJsonData(res, result);
    });
});

router.route('/develop/se/add').post(function(req,res) {
    var data=[];
    var results = [];
    var gitaddress = req.body.gitAddress;
    //暂时截取git地址最后的名字作为编号,如：git@code.dev.gz.cmcc:develop-base/develop-base.git，develop-base就是编号
    var pcode = gitaddress.substring(gitaddress.lastIndexOf('/')+1,gitaddress.lastIndexOf('.'));
    var conditionMap = {};
    conditionMap.projectCode = pcode;
    // 调用查询
    projectService.getProject(conditionMap,function(result){//根据projectcode查询项目是否存在
        if(result.success){
            // 获取提交信息
            data.push(pcode);
            data.push(req.body.projectName);
            data.push(gitaddress);
            data.push(req.body.healthCondition);
            data.push(req.body.resourceUse);
            data.push(req.body.remark);
            var currentUser = utils.getCurrentUser(req);
            data.push(currentUser.login_account);
            data.push(req.body.projectType);
            //判断是否从gitlab获取项目集合成功
            if(result.data && result.data.length>0){
                var flag = true;
                for(var i=0;i<result.data.length;i++){
                    if(pcode == result.data[i].projectName){
                        data.push(result.data[i].projectId);
                        flag = true
                        break;
                    }else{
                        flag = false;
                    }
                }
                if(!flag){//如果没有匹配的项目编号(名称)，设空值
                    data.push(null);
                }
            }else{
                data.push(null);
            }
            projectService.add(data, function(results) {
                utils.respJsonData(res, results);
            });
        }else{
            utils.respJsonData(res, result);
        }
    });
});


/**
 * 修改项目
 */
router.route('/develop/pm/update').put(function(req,res) {
    // 获取提交信息
    var data=[];
    var gitaddress = req.body.gitAddress;
    //暂时截取git地址最后的名字作为编号,如：git@code.dev.gz.cmcc:develop-base/develop-base.git，develop-base就是编号
    var pcode = gitaddress.substring(gitaddress.lastIndexOf('/')+1,gitaddress.lastIndexOf('.'));
    data.push(pcode);
    data.push(req.body.projectName);
    data.push(gitaddress);
    data.push(req.body.healthCondition);
    data.push(req.body.resourceUse);
    data.push(req.body.remark);
    data.push(req.body.projectType);
    projectService.update(data, function(result) {
        utils.respJsonData(res, result);
    });
});



router.route('/develop/pm/:id').delete(function(req,res) {
    // 获取提交信息
    var id = req.params.id;
    projectService.delete(id, function(result) {
        utils.respJsonData(res, result);
    });
});

router.route('/doc/{id}/{type}').get(function(req,res){

});

router.route("/develop/pd/tree").get(function(req,res){
    // 条件
    var projectId = req.query.projectId;
    if(!projectId){
        return false;
    }
    // 调用查询
    projectService.queryDetailTree(projectId,function(results){
        utils.respJsonData(res, results);
    });
});


module.exports = router;