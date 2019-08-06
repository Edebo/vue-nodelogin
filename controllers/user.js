const User=require('../models/user')
const formidable=require('formidable')

exports.userById=(req,res,next,id)=>{
    User.findOne({where:
        {id}
    }).then(user=>{

        if(!user){
            res.status(400).json({
                error:'User does not exist'
            })
        }
        req.profile=user        
        next()

    }).catch(err=>{
        res.status(400).json({
            error:'An error occured'
        })
    })       
}


exports.read=(req,res)=>{
    req.profile.password=undefined

    res.json(req.profile)
}

exports.recent=(req,res)=>{

        console.log('inside update now')
        const form = new formidable.IncomingForm();
        form.uploadDir = "./uploads"
        form.keepExtensions = true;
      const obj={};
        form.parse(req)
        .on('field', (name, field) => {
         
        obj[name]=field;
       })
       .on ('fileBegin', function(name, file){
         //rename the incoming file to the file's name
         file.path = "uploads/" + file.name;
     })  
       .on('file', (picture, file) => {
         
           obj[picture]=file.path;
       })
       .on('aborted', () => {
         console.error('Request aborted by the user')
       })
       .on('error', (err) => {
         console.error('Error', err)
         throw err
       })
       .on('end', () => {
         console.log('after parsing the form',req.params.id)

        //  User.findAll({
        //      where:{id:req.params.id}
        //  }).then(user=>{
        //      console.log('wow i found the user',user)
        //     const {email}=user[0].dataValues
        //     console.log(email,req.auth.email)     

        //     if(req.auth.email!==email){
        //      return res.json({
        //          error:'you are not the authenticated user'
        //      })

        //     }
        //         console.log(obj)
        //     user.update({...obj}).then(()=>{
        //         console.log('update successfu') 
        //         res.json({
        //             message:'update is successful',
                   
        //         })
        //     })
          
        //  }).catch(err=>{
        //      res.status(400).json({
        //          error:'Couldnt update your profile'
        //      })
        //  })
        const {email,name,picture}=obj
        console.log(email,name,picture)
        User.update({email,name,picture},
            {returning: true, where: {id: req.params.id} })
        .then(([ rowsUpdate, [updatedUser] ])=>{
            console.log('i got to this point',updatedUser)
                res.json(updatedUser)
        }).catch(err=>{
            res.status(400).json({
                error:'cannot not update your record,try again'
            })
        })
    //     User.findAll({
    //         where:{id:req.params.id}
    //     }).then(user=>{
    //         console.log('got the user')
    //         console.log( user.dataValues.name)
        
    //         user.name=obj.name
    //         user.email=obj.email
    //         user.picture=obj.picture

    //         console.log('am about to save')
    //         user.save({fields: ['name','email','picture']}).then(() => {
    //            res.json({
    //                message:"update sucessfull"
    //            })
    //            })
    
    //    }).catch(err=>{
    //     res.status(400).json({
    //              error:'cannot not update your record,try again'
    //             })
    //    })
    })
}

exports.all=(req,res)=>{
    // Find all users
User.findAll().then(users => {
   res.json({
       users
   })
  });
}