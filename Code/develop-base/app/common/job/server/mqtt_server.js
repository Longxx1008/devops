/**
 * Created by zhaojing on 2016/9/19.
 */
var config = require('../../../../config');

exports.init = function() {
    var mosca = require('mosca');

    var settings = {};
    settings.port = config.mqtt.server.port;
    if(config.mqtt.server.is_persistence){
        settings.backend = {
            type: 'mongo',
            url: config.mqtt.server.mongo_settings.url,
            pubsubCollection: config.mqtt.server.mongo_settings.collection,
            mongo: {}
        }
        settings.persistence = {
            factory: mosca.persistence.Mongo,
            url: config.mqtt.server.mongo_settings.url
        }
    }
    var mqttServer = new mosca.Server(settings);

    mqttServer.on('clientConnected', function(client){
        console.log('client connected', client.id);
    });

    mqttServer.on('clientDisconnected',function(client){
        console.log('client disconnected', client.id);
    });

    mqttServer.on('ready', function(){
        console.log('mqttserver is running...');
    });
}
