const express = require("express")
const hbs = require("hbs")
const path = require("path")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

const app = express()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user: process.env.USER,
        pass: process.env.PASSWORD
    }
})

app.use(express.static("./views"))  //used to use css,images etc i.e public files
// app.set("views","./views")       //used to set views folder path
app.set("view engine","hbs")        //used to set template engine
hbs.registerPartials(path.join(__dirname,"./views/partials")) //used to register partials

const encoder = bodyParser.urlencoded()

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/about",(req,res)=>{
    res.render("about")
})
app.get("/service",(req,res)=>{
    res.render("services")
})
app.get("/gallery",(req,res)=>{
    res.render("gallery")
})
app.get("/contact",(req,res)=>{
    res.render("contact",{show:false})
})
app.post("/contact",encoder,(req,res)=>{
    let mailOption = {
        from:process.env.USER,
        to:req.body.email,
        subject:"Your Query Received!!! : Team Luxury Furnitue",
        text : "Thanks to Share Your Query with Us!!!\nOur team Will Contact Your Soon\n"
    }
    transporter.sendMail(mailOption,(error,data)=>{
        if(error)
        console.log(error);
    })
    mailOption = {
        from:process.env.USER,
        to:process.env.USER,
        subject:"One new Query Received!!!",
        text : `
                    One New Query Received
                    Name    : ${req.body.name}
                    Email   : ${req.body.email}
                    Phone   : ${req.body.phone}
                    Subject : ${req.body.subject}
                    Message : ${req.body.message}
                `
    }
    transporter.sendMail(mailOption,(error,data)=>{
        if(error)
        console.log(error);
    })
    res.render("contact",{show:true})
})
var PORT = process.env.PORT|8000
app.listen(PORT,()=>console.log(`Server is Running at Port ${PORT}`))