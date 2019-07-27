const User=require('../model/user')
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')




exports.signup = (req,res) => {
    const newUser={
        name:req.body.name,
        email:req.body.email,
       
    }
    
    User.findOne({
        where:{
        email:req.body.email
    }
    }).then(user=>{
        if(!user){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                newUser.password=hash
                User.create(newUser)
                .then(user=>{
                    user.password=undefined
                    res.json({
                        user
                    })
                })
                .catch(err=>{
                    res.status(400).json({
                        error:'User not registered,try again'
                    })
                })
            })
        }

        else{
            res.json({
                message:`User with ${req.body.email} already exist`
            })
        }
    }).catch(err=>{
        res.status(400).json({
            error:'An error occured during signup'
        })
    })
}

exports.signin=(req,res)=>{

    //find the user based on email
    const {email} =req.body
    User.findOne({
                where:{
                    email
                }
            })
             .then(user=>{
            if(!user){
                res.status(400).json({
                    error:'user with the email doesnt exit.Please signup'
                })
            }

            //if user exist then compare email and password
            //create authetication
            if(bcrypt.compareSync(req.body.password,user.password)){
                 //generate token with jsonwebtoken using user id and secret key
            const token=jwt.sign(user,process.env.JWT_SECRET,
                {
                     expiresIn:60400// 1 week
                    })
            const {name,email,picture}=user
            res.json({
                user:{
                    name,email,picture,token
                }
            })

            }

            else{
                res.json({
                    error:'incorrect password'
                })
            }
    }).catch(err=>{
        res.status(400).json({
            error:'An error occured'
        })
    })
    
}

exports.signout=(req,res)=>{
    res.clearCookie('t')
    res.json({
        message:'Signout Success'
    })
}

//expressJwt needs cookies middleware to work
//this is for protected route,authorization
exports.requireSignin =(req,res,next)=>{
    try{
        const header = req.headers['authorization'];

        if(typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1];
    
               //verify the JWT token generated for the user
        const decode =jwt.verify(token,process.env.JWT_SECRET)
        req.auth=decode
            
            next();
        } else {
            //If header is undefined return Forbidden (403)
            res.sendStatus(403)
        }
    }
    catch(e){
        res.status(401).json({
            message:'auth failed'
        })
    }
}


//this middleware make sure it is the current login user
exports.isAuth=(req,res,next)=>{
    let user=req.profile && req.auth && req.profile._id==req.auth._id
    if(!user){
        res.status(403).json({
            error:'access denied'
        })
    }

    next()
}


//dis for admin verification
exports.isAdmin=(req,res,next)=>{
   if( req.profile.role===0){
       res.status(403).json({
           error:'acess denied'
       })
    }
    next()
   }
