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

exports.update=(req,res)=>{

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

         User.findAll({
             where:{id:req.params.id}
         }).then(user=>{
             console.log('wow i found the user',user)
            const {email}=user[0].dataValues
            console.log(email,req.auth.email)     

            if(req.auth.email!==email){
             return res.json({
                 error:'you are not the authenticated user'
             })

            }

            user.update(obj).then(()=>{
                 
                res.json({
                    message:'update is successful',
                   user
                })
            })
          
         }).catch(err=>{
             res.status(400).json({
                 error:'Couldnt update your profile'
             })
         })
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