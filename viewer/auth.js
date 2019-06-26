/******************************************************************************/
/*
 auth.js  -- user login auth functions
 */
'use strict';

var session = require('express-session'),
    redis = require('redis'),
    RedisStore = require('connect-redis')(session),
    Config      = require('./config.js');

let port = Config.get('redisPort',6379)
let addr = Config.get('redisAddr','127.0.0.1')
let passport = Config.get('redisPass','redrock')

var redisClient = redis.createClient(6379, addr, {auth_pass: passport});

exports.session_instance = session({
    secret : 's2rged',
    name : 'sessionId',
    store:new RedisStore({client: redisClient}),
    resave: false,
    saveUninitialized: false
});


