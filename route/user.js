
const router =require('express').Router()
const {userByEmail,read,update}=require('../controllers/user')
const {requireSignin,isAuth} =require('../controllers/auth')


router.get('/user/:email',requireSignin,isAuth,read)
router.put('/user/:email',requireSignin,isAuth,update)
//anytime there is userId in the route the method will run
router.param('email',userByEmail)

module.exports= router