'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('dps_pg','ruifosang','redrock',
    {
        host:'localhost',
        dialect:'postgres',
        pool:{
            max:5,
            min:0,
            acquire:30000,
            idle:1000
        }
    });
const User = sequelize.define('use',{

})
