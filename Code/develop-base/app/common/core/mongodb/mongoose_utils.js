/**
 * Created by ShiHukui on 2016/2/22.
 */

var mongoose = require('mongoose');
var config   = require('../../../../config');
//var logger = require('../common/logger');
var $mongoose = null;
exports.init = function() {
    if($mongoose == null) {
        mongoose.Promise = global.Promise;
        mongoose.connect(config.mongdb.url,
            {
                server: {poolSize: config.mongdb.poolsize}/*,
                user: config.mongdb.user,
                pass: config.mongdb.pass*/
            },
            function (err) {
                if (err) {
                    //logger.error('connect to %s error: ', config.mongodb_url, err.message);
                    console.log('connect to %s error: ', config.mongdb.url, err.message);
                    process.exit(1);
                }
            });


        var db = mongoose.connection;
        db.on('error', function () {
            // console.error.bind(console, 'connection error:');
            console.log('db error ', config.mongdb.url, ' is connected')
        });


        db.once('open', function () {
            // we're connected!
            console.log('db ', config.mongdb.url, ' is connected')
        });
        $mongoose = mongoose;
    }

    return mongoose;
}