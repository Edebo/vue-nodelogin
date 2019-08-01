const Sequelize=require('sequelize')
const db=require('../database/db')

//user is the table name
module.exports =db.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING,
        unique:true

    },
    password:{
        type:Sequelize.STRING
    },
    picture:{
        type:Sequelize.STRING
    }

},{timestamps:false})