var xss = require("xss");
module.exports = function (b, e, d) {

    /*if(!b.session.current_user){*/
        for(var k in b.query){
            b.query[k]=xss(b.query[k])
        }
        for(var k in b.body){
            b.body[k]=xss(b.body[k])
        }
        for(var k in b.params){
            b.params[k]=xss(b.params[k])
        }
        //b.url=b.url.replace(/[(%22)(%27)]/g,"");
    /*}*/

    d();
};
