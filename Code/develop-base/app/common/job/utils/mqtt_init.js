/**
 * Created by zhaojing on 2016/9/20.
 */
var config = require('../../../../config');

exports.init = function() {
    if(config.mqtt.server.is_load){
        var mqtt_server = require('../server/mqtt_server');
        mqtt_server.init();
    }
    if(config.mqtt.pub_client.is_load){
        var mqtt_pub_client = require('../server/mqtt_pub_client');
        mqtt_pub_client.init();
    }
    if(config.mqtt.sub_client.is_load){
        var mqtt_sub_client = require('../client/mqtt_sub_client');
        mqtt_sub_client.init();
    }
}

exports.initServer = function() {
    if(config.mqtt.server.is_load) {
        var mqtt_server = require('../server/mqtt_server');
        mqtt_server.init();
    }
}

exports.initPubClient = function() {
    if(config.mqtt.pub_client.is_load) {
        var mqtt_pub_client = require('../server/mqtt_pub_client');
        mqtt_pub_client.init();
    }
}

exports.initSubClient = function() {
    if(config.mqtt.sub_client.is_load) {
        var mqtt_sub_client = require('../client/mqtt_sub_client');
        mqtt_sub_client.init();
    }
}




