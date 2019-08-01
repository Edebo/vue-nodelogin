const Sequelize=require('sequelize')

const sequelize= new Sequelize('vue-login','root','',{
    host:'localhost',
    port:3306,
    dialect:'mysql',
    
    pool:{
        max:10,
        min:0,
        acquire:30000,
        idle:10000
    }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// db.sequelize=sequelize
// db.Sequelize=Sequelize

const db=sequelize

module.exports= db