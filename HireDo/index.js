const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const filesupload=require('express-fileupload')
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "djloge7oo",
    api_key: "297486764145975",
    api_secret: "SS000_vfZA7HBaxSbDdr1t1qnlQ"
  });
  
const myString = 'Hello, world!';
const myHash = crypto.createHash('sha256').update(myString).digest('hex');
const myHash2 = crypto.createHash('sha256').update(myString).digest('hex');
const dbURL = process.env.DB_URL; 

mongoose.connect(dbURL).then(() => {
    console.log('HireDo Database Connected');
}).catch((err) => {
    console.log(err);
    console.log('There is some problem while connecting to the Database');
})


const app = express();
const path = require('path');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(filesupload({
    useTempFiles:true
}))
const port = 3000;
app.listen(port, () => {
    console.log('Server is running at port 3000')
});
app.get('/', (req, res) => {
    res.redirect('/hiredo/home')
})
let mess = "";
app.get('/', (req, res) => {
    res.redirect('/hiredo/home')
})
app.get('/Hiredo/Home', (req, res) => {
    mes = "";
    res.render('home');  
})
app.get('/Hiredo/Login', (req, res) => {
    workers.deleteMany({ isverified: false }).then(() => {
        console.log('Not verified Item Deleted');
    })
    users.deleteMany({ isverified: false }).then(() => {
        console.log('Not verified Item Deleted');
    })
    mess = "";
    res.render('login',{mess});
})
app.get('/Hiredo/Signup', (req, res) => {
    workers.deleteMany({ isverified: false }).then(() => {
        console.log('Not verified Item Deleted');
    })
    users.deleteMany({ isverified: false }).then(() => {
        console.log('Not verified Item Deleted');
    })
    mess = "";
    res.render('signup',{mess});
})
// app.get('/*', (req, res) => {
//     res.send("Page not found")
//     // res.status(404).render('Session.ejs');
//   });
const workerschema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    isverified: {
        type: Boolean,
        default: false
    },
    charges: {
        type: Number,
        required: true,
        default: "0"
    },
    phone:{
        type:Number,
        default:0
    },
    age:{
        type:Number,
        default:0
    },
    gender:{
        type:String,
        default:"NA"
    },
    city:{
        type:String,
        default:"NA"
    },
    state:{
        type:String,
        default:"NA"
    },
    designation:{
        type:String,
        default:"NA"
    },
    about:{
        type:String,
        default:"NA"
    },
    photo:{
        type:String,
        default:"NA"
    },
   
    policefile:{
        type:String,
        default:"NA"
    },
    covidfile:{
        type:String,
        default:"NA"
    },
})

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    isverified: {
        type: Boolean,
        default: false
    },
    phone:{
        type:Number,
        default:0
    },

    city:{
        type:String,
        default:"NA"
    },
    state:{
        type:String,
        default:"NA"
    },
    address:{
        type:String,
        default:"NA"
    },
    postalcode: {
        type: String,
        default:"NA"
        
    }
   
 
  
})

//contact schema
const contactschema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required:true
    },
    subject: {
        type: String,
        required:true
    },
    message: {
        type: String,
        required:true
    }
})
const contacts = new mongoose.model("Contact", contactschema);
const workers = new mongoose.model("Worker", workerschema);
const users = new mongoose.model("User", userschema);

workers.deleteMany({ isverified: false }).then(() => {
    console.log('Not verified Item Deleted');
})
users.deleteMany({ isverified: false }).then(() => {
    console.log('Not verified Item Deleted');
})

      //=============================================Email verification============================
let otp;

app.post('/hiredo/check', (req, res) => {
    // console.log("-----------------"+req);
    const { email } = req.body;
    console.log(email); 
    if (otp == req.body.otp) {
        //open done page
        mess="Email Verification Done"
        res.render('login', { mess });
        workers.updateOne({ email: `${delemail}` },{isverified:true}).then((m) => {
            console.log('Worker mark true');
        })
        users.updateOne({ email: `${delemail}` },{isverified:true}).then((m) => {
            console.log('User mark true');
        })
    } else
    {
        workers.deleteOne({ email: `${email}` }).then(() => {
            console.log('Worker deleted');
        })
        users.deleteOne({ email: `${email}` }).then(() => {
            console.log('user deleted');
        })

        mess = "Incorrect OTP"
        res.render('Email_Verify', { email, mess });
        }

})
let delemail = "";
const sender_email = process.env.EMAIL;
const app_passcode = process.env.APP_PASSCODE;
function sendemail(email) {
    //---------------------------------------------------------Email Sending----------------------------------
    delemail = email;
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender_email,
            pass: app_passcode
        }
    });
    otp = Math.floor(Math.random() * 1000000);
    let mailDetails = {
        from: sender_email,
        to: `${email}`,
        subject: 'Hiredo Email Verification',
        html:`<section style="background-color: black;color:white;padding: 20px;"><H1 style="color: white;">HIREDO Email Verification</H1><p style="color: white;">Thank you for registering at Hiredo. Here's your verification code. Please copy it and verify your Email.</p><h1 style="background-color: rgb(162, 0, 255);text-align: center; padding: 20px;color: white;">OTP: ${otp}</h1> <p style="color: white; font-size: smaller; text-align: center">If this email is not intended for you please ignore it.</p></section>`
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}




app.post('/HireDo/signup', (req, res) => {
   
// -----------------------------------------------------Signup to database-------------------------------
const myHash = crypto.createHash('sha256').update(req.body.p1).digest('hex');

    if (req.body.worker != 'on' && req.body.user != 'on') {
        // console.log('No Profile Selected');
        mess = "No Profile Selected";   
        res.render('signup', { mess });
        
   }else
        if (req.body.worker == 'on') {

        if (req.body.p1 !== req.body.p2) {
            mess = "Password Not Matched";
            res.render('signup', { mess });   

        } else {
            workers.create({ name: `${req.body.name}`, email: `${req.body.email}`, password: `${myHash}` }).then(() => {
                console.log('Worker Added');
                console.log(req.body);
                // res.redirect('/Hiredo/Login');//posponded
                const { email } = req.body;
                sendemail(email);
                mess = "";
                res.render('Email_Verify',{email,mess})

            }).catch((err) => {
                console.log(err);
                mess = "Email Already Exist";
                res.render('signup', { mess });
            })
        }
    }else
    if (req.body.user == 'on')
    {
        
        if (req.body.p1 !== req.body.p2) {
            mess = "Password Not Matched";
            res.render('signup', { mess });
        } else {
            users.create({ name: `${req.body.name}`, email: `${req.body.email}`, password: `${myHash}`}).then(() => {
                console.log('user Added');
                console.log(req.body);
                const { email } = req.body;
                sendemail(email);
                mess = "";
                res.render('Email_Verify', { email ,mess})
            }).catch((err) => {
                console.log(err);
                mess = "Email Already Exist";
                res.render('signup', { mess }); 

            })
            
        }

    }
})
// -----------------------------------------------Login from database----------------------------------

app.post('/hiredo/login', (req,res)=> {
    const email = req.body.email;
    // const password = req.body.password;
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');

    console.log(req.body);
    if (req.body.worker != 'on' && req.body.user != 'on') {
        console.log('No user Selected');
        mess = "No User Selected";
        res.render('login', { mess });//-------------------Message
    }
    if (req.body.worker == 'on') {
        workers.findOne({ email: `${email}` }).then((m) => {
            if (m.isverified==false) {
                mess = "User not found";
                res.render('login', { mess });//-----------------Message
            }
            if (m.password != password ) {
                mess = "Incorrect Password";
                res.render('login', { mess });//-----------------Message
            }
            else {
                console.log('Correct Password');
                   //---------------------------Loader
                mess = "";
                if (m.city == "NA") {
                    // res.redirect('/hiredo/worker');//path ko active karega
                    // res.render('profile');  
                    let name = m.name;
                    mess = "";
                    res.render('Worker_Profile', {mess, data:m});
                    // app.get('/Hiredo/Worker', (req, res) => {
                    //     mess = "";

                    //     res.render('Worker_Profile', {mess, data:m});
                    // })
                }
                else {
                    // res.redirect('/hiredo/worker/details');//path ko active karega
                    // res.render('profile');  
                    let name = m.name;
                    mess = "";

                    res.render('Worker_details.ejs', { mess, data:m });
                    // app.get('/Hiredo/Worker/details', (req, res) => {
                    //     mess = "";

                    //     res.render('Worker_details.ejs', { mess, data:m });
                    // })
                }
               
            }
        }).catch(() => {
            // console.log('Email Does Not Exist');//------------------------------Printing Error
            mess = "Email Does Not Exist";
        res.render('login', { mess });
        })
    }
    else if (req.body.user == 'on') {
        users.findOne({ email: `${email}` }).then((m) => {
            if (m.isverified==false) {
                mess = "User not found";
                res.render('login', { mess });//-----------------Message
            }
            if (m.password != password ) {
                mess = "Incorrect Password";
                res.render('login', { mess });//-----------------Message
            }
            else {
                console.log('Correct Password');   //--------------------------------------Loader
                mess = "";
                if (m.city == "NA") {
                    res.redirect('/hiredo/user');//path ko active karega
                    // res.render('profile');  
                    let name = m.name;
                    app.get('/Hiredo/user', (req, res) => {
                        mess = "";

                        res.render('User_Profile', { mess,data:m });
                    })
                }
                else {
                             mess = "";

                            res.render('User_details.ejs', { mess, data: m });
                      
                }
                
            }
        }).catch(() => {
            // console.log('Email Does Not Exist');//---------------------------Printing Error
            mess = "Email Does Not Exist";
            res.render('login', { mess });
        })
        
        
    }
})

//------------------------------------------------------Forgot password---------------------------------
app.get('/hiredo/forgot', (req, res) => {
    mess = "";
    res.render('forgot', { mess });
});

function sendforgotemail(email,otp) {
    //---------------------------------------------------------forgot email Sending----------------------------------

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender_email,
            pass: app_passcode
        }
    });
    // otp = Math.floor(Math.random() * 1000000);
    let mailDetails = {
        from: sender_email,
        to: `${email}`,
        subject: 'Hiredo Email Verification',
        html: `<section style="background-color: black; padding: 20px;color:white;"><h1 style="font-family: Arial, Helvetica, sans-serif;text-align: center;">HIREDO </h1><h1>Password Reset</h1><p style="text-align: center;">If you have lost your Hiredo account password or wish to reset it, use the link below to get started.</p>        <a href="http://localhost:3000/HireDo/forgot/verify/${otp}"><div style="background-color: blueviolet;padding: 10px;width:200px; color:white;margin:auto;"><h2 style="margin:auto;text-align: center;text-decoration: none;">Reset Password</h2></div></a><p style="text-align: center;"> If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset you Hiredo account password.</p> </section> `,
        // text: `This is verification link: http://localhost:3000/HireDo/forgot/verify/${otp}`
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
        }
    });
}
let forotp;
let foremail;
app.post('/hiredo/forgot/verify', (req, res) => {
    const { email } = req.body;
    foremail = email;
    if (email == '') {
        mess = "Empty Email";
        res.render('forgot', { mess });
    } else {
        forotp = Math.floor(Math.random() * 10000000);
        mess = "Verification email sent";
        res.render('login', { mess });
        sendforgotemail(email,forotp);
    }
})
app.get('/HireDo/forgot/verify/:otp', (req, res) => {
    console.log(forotp);
    console.log(req.params.otp);
    if (forotp == req.params.otp) {
        console.log('Verification done');
        
        res.render('resetpassword');
        
    } else {
        console.log('Not done');
    }
})
app.post('/hiredo/resetpassword', (req, res) => {
    // const newpass = req.body.newpass;
    const newpass = crypto.createHash('sha256').update(req.body.newpass).digest('hex');
    workers.updateOne({ email: foremail }, { password : newpass }).then(() => {
        console.log('Password Reset!');
        mess = "Password Reset";
        res.render('login', { mess });
    })
        users.updateOne({ email: foremail }, { password: newpass }).then(() => {    
            console.log('Password Reset!');
            mess = "Password Reset";
            res.render('login', { mess });
        }).catch(() => {
            mess = "Not verified";
            res.render('forgot', { mess });
        })
})

// --------------------------multer working---------------------------------------------------------------
     
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'Public/Documents')
    },
    filename: (req, file, cb) => {;
        // console.log(file)

        cb(null,Date.now() + path.extname(file.originalname));
       

    }
})

const upload = multer({ storage: storage });

//---------------------------Worker profile--------------------------------------------------------------
app.post('/Hiredo/Worker/Profile',  async(req, res) => {
    //--------------------------------------updating worker info in mongo--------------------------------------------------------
    const { email, charge, phno, age, gender, city, state, designation, about } = req.body;
    // 
  
    let link = [];
    for (let i of req.files.Photo)
    {
        
        await cloudinary.uploader.upload(i.tempFilePath, (err, result) => {
            if (err)
            {
                console.log(err);
            }
            else {
                link.push(result.url);
            }

          
        })
    }
   
    console.log(link);
     
    workers.updateOne({ email: `${email}` }, { phone: `${phno}`,charges:charge, age: age, gender: gender, city: city, state: state, designation: designation, about: about,photo:link[0],policefile:link[1],covidfile:link[2]}).then((m) => {
        console.log("data stored of worker");
        
        workers.findOne({ email: email }).then((data) => {  
            res.render('Worker_details', { data });
        })
    })
}) 



//-------------------------------------user profile-----------------------------------------------------
app.post('/Hiredo/User/Profile', (req, res) => {
    console.log(req.body);
//  --------------------------------------updating User info in mongoose--------------------------------------------------------
 const {email,address,city,state,postalcode,phno } = req.body;
    users.updateOne({ email: `${email}` }, { phone: phno, address: address, city: city, state: state, postalcode: postalcode }).then((m) => {
        console.log("data stored of user");
        users.findOne({ email: email }).then((data) => {    
            res.render('User_details', { data });

            // app.get('/Hiredo/User/Details', (req, res) => {
            //     res.render('User_details', { data });
            // })
            // res.redirect('/Hiredo/User/Details');
           
        }) 
    })
}) 
//-------------------------------------------------Home page--------------------------------------------


 
//----------------------------------------------WorkerList-----------------------

// app.get('/Hiredo/workerlist',async (req,res)=>{
//     const content= await workers.find({});
//     //console.log(content);
//     res.render("worker_list",{ 
//         collection:content 
//     })
// }) 
app.get('/Hiredo/workerlist/:des/:uid',async (req,res)=>{
    const {des}=req.params;
    console.log(des);
    const content= await workers.find({designation:des});
    //console.log(content);
    const {uid}= req.params;
    // console.log("UID"+uid)
    const udata=await users.findOne({_id:uid});    
    res.render("worker_list",{
        collection:content,
        userdata:udata
    })
}) 
app.post('/Hiredo/workerlist/:id',async(req,res)=>{
    const {id}=req.params;
    const userdata= await users.findOne({_id:id});

    
    res.redirect('/Hiredo/workerlist');  
    app.get('/Hiredo/workerlist',async (req,res)=>{
        const content= await workers.find({});

        console.log("UserData" + userdata);
        mess = "";
        res.render("worker_list",{ 
            userdata:userdata,
            collection: content,
            
        })
    }) 
}) 



app.get("/Hiredo/worker/Details/:id/:uid",async(req,res)=>{
    const {id}= req.params;
    const {uid}= req.params;
    // console.log("UID"+uid)
    const userdata=await users.findOne({_id:uid});
    const data=await workers.findOne({_id:id})
    res.render("View_WorkerDet",{
        data:data,
        userdata:userdata
    })

   
})


app.post("/Hiredo/worker/Details/:id/:uid",async(req,res)=>{
    const {id}=req.params;
    const {uid}=req.params;
    let userdata = await users.findOne({_id:uid});
    let workerdata = await workers.findOne({_id:id});


    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hiredo.project.gla@gmail.com',
            pass: 'lrfefihtbnozeaad'
        }
    });
    let mailDetails = {
        from: 'hiredo.project.gla@gmail.com',
        to: `${workerdata.email}`,
        subject: 'Hiredo Hiring',
        html:`<section style="background-color: black;color:white;padding: 20px;"><H1 style="color: white;">Hiring request from HireDo</H1><p style="color: white;"><h4 style="background-color: rgb(162, 0, 255);text-align: center; padding: 20px;color: white;">You are hired by ${userdata.name}.</h4> <p>For more info,you can contact at: ${userdata.phone} or ${userdata.email}</p> <p style="color: white; font-size: smaller; text-align: center">If this email is not intended for you please ignore it.</p></section>`
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent successfully');
            res.render('last_mess');
        }
    });
})

app.post("/hiredo/user/:id",async(req,res)=>{
    const {id}=req.params;
    const d= await users.findOne({_id:id});
    console.log(d);
    res.render("User_Profile",{
        data:d
    })   
})
app.post("/hiredo/worker/:id",async(req,res)=>{
    const {id}=req.params;

    const d= await workers.findOne({_id:id});
    console.log(d);
    res.render("Worker_Profile",{
        data:d
    })    
})   
// -----------------------------Contact us page--------------------------------
app.post('/Hiredo/contactus', (req, res) => {
    contacts.create({ name: req.body.name, email: req.body.email, subject: req.body.subject, message: req.body.message}).then(() => {
        console.log("contact saved");
        res.render('last_mess');
    })
})
