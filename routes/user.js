
const router =require('express').Router()
// const {userById,read,update,all}=require('../controllers/user')
const {requireSignin,isAuth} =require('../controllers/auth')
const {recent}=require('../controllers/user')


// router.get('/users',all)
// router.get('/user/:id',requireSignin,isAuth,read)
// router.put('/user/:id',requireSignin,isAuth,update)
//anytime there is userId in the route the method will run
router.post('/user/:id',requireSignin,isAuth,recent)
// router.param('id',userById)

module.exports= router