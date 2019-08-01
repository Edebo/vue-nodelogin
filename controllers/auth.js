const User=require('../models/user')
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')




exports.signup = (req,res) => {
    const newUser={
        name:req.body.name,
        email:req.body.email,      
    }
    console.log(newUser)
    
    User.findAll({
        where:{
        email:req.body.email
    }
    }).then(user=>{
        console.log('i got here')
        if(user===undefined){
            
           return res.json({
                message:`User with ${req.body.email} already exist`
            })
            
        }

        else{

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
    }).catch(err=>{
        res.status(400).json({
            error:'An error occured during signup'
        })
    })
}

exports.signin=(req,res)=>{

    //find the user based on email
 email =req.body.email
    console.log(email)
    User.findAll({
                where:{
                    email:req.body.email
                }
            })
             .then(user=>{
            if(user[0].dataValues===undefined){
               return res.status(400).json({
                    error:'user with the email doesnt exit.Please signup'
                })
            }
            
                const {id,email,password,name,picture}=user[0].dataValues
                console.log(id,email,password,name)
            //if user exist then compare email and password
            //create authetication
            console.log(req.body.password)
            if(bcrypt.compareSync(req.body.password,password)){
                console.log('password was correct')
                 //generate token with jsonwebtoken using user id and secret key
            const token=jwt.sign({email},process.env.SECRET,
                {
                     expiresIn:60400// 1 week
                    })
                    console.log(token)
            
            console.log()
          return  res.json({
                   id,name,email,picture,token
            })

            }

            else{
                res.json({
                    error:'incorrect password'
                })
            }

            // const {id,email,name}=user[0]
           res.json({
               id,email,name
           })
    })
    .catch(err=>{
        res.status(400).json({
            error:err
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
    console.log('inside requiresign in')
    try{
        const header = req.headers['authorization'];
console.log(header)
        if(typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1];
    
               //verify the JWT token generated for the user
        const decode =jwt.verify(token,process.env.SECRET)
        req.auth=decode
         console.log('inside require signin')   
         console.log(req.auth)
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
