/**
 * Created by Andrew on 2016/3/3.
 */
var os = require('os');
var ip = function() {
    console.log('obtain an IP address');
}

ip.prototype.address = function() {
    var network = os.networkInterfaces();
    for(var i = 0; i < network.en1.length; i++) {
        var json = network.en1[i];
        //if(json.family == 'IPv4')
        {
            console.log(json.address);
        }
    }
}
module.exports = ip;