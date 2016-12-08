/**
 * Created by hama on 2016/12/8.
 */
'use strict';

var settings = require('../models/db/settings');
var redis = require('redis');
var client = redis.createClient(settings.redis_port, settings.redis_host);
client.auth(settings.redis_psd);
module.exports = client;