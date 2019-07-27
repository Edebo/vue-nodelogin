const User=require('../models/user')
const formidable=require('formidable')

exports.userByEmail=(req,res,next,email)=>{
    User.findOne({where:
        {email}
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
         
         User.findOne({
             where:{email}
         }).then(user=>{
             user.update(obj).then(()=>{
                 res.json({
                     message:'update is successful'
                 })
             })
         }).catch(err=>{
             res.status(400).json({
                 error:'Couldnt update your profile'
             })
         })
        })
   
   
}