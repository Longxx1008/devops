/* 
create by heidngxin 17.10.16
*/
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var resourceListService = require('../services/resourceListService');
var utils = require('../../../common/core/utils/app_utils');
router.route("/")
    .get((req, res) => {
        var page = req.query.page;
        var length = req.query.rows;
        resourceListService.pageList().then(rs=>{
            utils.respJsonData(res,rs);
        })
    })

router.route("/:id").get((req, res) => {
    resourceListService.getResource(req.params.id).then(rs=>{
        utils.respJsonData(res,rs);
    })
})
module.exports = router;