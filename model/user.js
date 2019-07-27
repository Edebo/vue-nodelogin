const db =require('../database/db')
module.exports = db.sequelize.define('user',{
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
    },
    default:{
        type:Sequelize.STRING
    }

},{timestamps:true})