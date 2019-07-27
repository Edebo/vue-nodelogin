const express =require('express')
const morgan =require('morgan')
const bodyParser =require('body-parser')
const cors=require('cors')
const app=express()

const authRoute=require('./routes/auth')
const userRoute=require('./routes/user')

require('dotenv').config()

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//making the uploads folder publicly available
app.use('/uploads', express.static('uploads'));

//ROUTE
app.use('/api',authRoute)
app.use('/api',userRoute)




//ROUTE
app.use('/api',authRoute)
app.use('/api',userRoute)




const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`Server has started on port ${port}`)
})