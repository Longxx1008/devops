var express = require('express');
var router = express.Router();
var fs = require('fs');

var payload = require("request-payload");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('upload respond with a resource');
});


router.post('/', function(req, res, next) {
  console.log('update');
  console.log(req.body.report);
  console.log(req.body);
  console.log(req.body.reportname);

  var fileName = "public/reports/"+req.body.reportname;
  fs.writeFile(fileName,req.body.report,function(err){
    if(err) {
      //throw err
      //res.send('{msg:false}');
      res.send('保存失败');
      console.log('error');
    }
    else {
      //res.send('{msg:true}');
      res.send('保存成功');
      console.log('success'+fileName);
    }

  });




//  var vPayload = JSON.parse(req.body);
  /*
  payload(req,function (body) {
    

    
    console.log(body);

    res.send('ok');

  });*/
  //res.send('respond with a resource');
});

module.exports = router;
