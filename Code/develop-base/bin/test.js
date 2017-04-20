/**
 * Created by ShiHukui on 2016/5/9.
 */
var mongoose = require('mongoose');
var config   = require('../config');
var Memcached = require('memcached');

function testMongoDB() {
    mongoose.connect(config.mongdb.url,
        {
            server: {poolSize: config.mongdb.poolsize}/*,
            user: config.mongdb.user,
            pass: config.mongdb.pass*/
        },
        function (err) {
            console.log('-------------------------------------------');
            if (err) {
                //logger.error('connect to %s error: ', config.mongodb_url, err.message);
                console.error('mongoose connect to %s error: ', config.mongdb.url, err.message);
                process.exit(1);
            }
            else {
                console.log('mongoose connect to %s success.', config.mongdb.url);
                mongoose.disconnect();
            }
        });


}

function testMemcached() {
    var memcached = new Memcached(config.memcached.server_locations, config.memcached.options);
    memcached.version(function(err){
        console.log('-------------------------------------------');
        if(err) {
            console.error('memcached connect to %s error: ',config.memcached.server_locations, err.message);
        }
        else {
            console.log('memcached connect to %s success: ',config.memcached.server_locations);
        }
        memcached.end();
    });
}

testMongoDB();
testMemcached();



