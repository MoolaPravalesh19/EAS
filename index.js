require("dotenv").config();
let express=require("express");
const cors = require('cors');

let app=express();
let port=3000;
let path=require("path");
let ejsMate = require('ejs-mate');
let alert=require("alert-node");
const mongoose=require("mongoose");
const Admin=require("./models/admin");
const Employee=require("./models/employee");
const Attendance=require("./models/attendance");
const passport = require("passport");
require("./config/passport")(passport);
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.json());
app.use(cors());

const dburl=process.env.ATLASDB_URL;
mongoose.connect(dburl);

let sessionOptions = {
    secret: process.env.SECRET, // Use a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
}
  
  app.use(session(sessionOptions)); // Creating session
  app.use(flash()); // Alert message
  app.use(passport.initialize());
  app.use(passport.session());
  

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "employee",
//     password: "Pro@2003",
//   });


app.listen(port,()=>{
    console.log(`current port is ${port}`);
    // console.log(geolocation.longitude);
})

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.get("/",(req,res)=>{
    res.redirect("/login")
})

app.get("/login",(req,res)=>{
    res.render("main/index.ejs");
})

app.post("/verify",passport.authenticate("admin", {
    failureRedirect: "/login",failureFlash: true,}),async (req, res) => {
        const admin = await Admin.find({ username: req.body.username });
        console.log(req.body);
        res.render("main/dashboard.ejs");
})
app.get("/Admin/Dashboard/Employee",async(req,res)=>{
    let employee = await Employee.find({});
    console.log(employee);
  res.render("main/employee-list.ejs",{employee});
})
app.get("/Admin/Dashboard/add-employee",(req,res)=>{
    res.render("main/add-employee.ejs");
});
app.post("/Admin/new-employee",async(req,res)=>{
    let {username:username,Phonenumber:Phonenumber,Email:Email}=req.body;
    console.log(username+Phonenumber+Email);
    let check=await Employee.findByUsername(username);
    console.log(check);
    if(check==null){
    let EmployeeDetails = Employee({
        username: username,
        Phonenumber: Phonenumber,
        Email: Email
      });
      EmployeeDetails.save();
      req.flash("success","Registration is successfully done");
      res.redirect("/Admin/Dashboard/add-employee");
    }
    else{
        req.flash("error","Employee had already been Placed");
        res.redirect("/Admin/Dashboard/add-employee");
    }
})

// app.post("/check",(req,res)=>{
//     navigator.geolocation.getCurrentPosition(info => console.log(info));
// })
// app.post("/checkin",async(req,res)=>{
//     let{latitude:latitude,longitude: longitude,name: name,intime: intime,date: date,city: city}=req.body;
//     console.log(latitude);
//     console.log(req.body);
//     let check=await Employee.findByUsername(name);
//     let checkattend= await Attendance.findByUsername(name);
//     console.log(checkattend);
//     console.log("check"+check);
//     if(check==null){
//         alert("No such employee Present in any of the department")
//         res.redirect("/login");

//     }
//     else{
//         if(checkattend==null){
//             let attendance= Attendance({
//                 username:name,
//                 latitudeIn:latitude,
//                 longitudeIn:longitude,
//                 DateIn:date,
//                 cityIn:city,
//                 intime:intime
//             });
//             await attendance.save();
//             alert("You are succesfully Checked In!")
//             res.redirect("/login");
//         }
//         else{    
//         alert("You are already Checked In!")
//         res.redirect("/login");

//     }
// }
// });
// app.post("/checkout",async(req,res)=>{
//    let {latitude: latitude,longitude: longitude,name: name,outtime:outtime,date: date,city: city,}=req.body;
//    let check=await Employee.findByUsername(name);
//    console.log(outtime);
//    console.log(check);
//     let checkattend= await Attendance.findByUsername(name);
    

//     // console.log("check"+check);
//     if(check==null){
//         alert("No such employee Present in any of the department")
//         res.redirect("/login");

//     }
//     else{
//         let intimecheck=checkattend.intime;
//         if(intimecheck!=undefined){
//             checkattend.latitudeOut=latitude;
//             checkattend.longitudeOut=longitude;
//             checkattend.outime=outtime;
//             checkattend.DateOut=date;
//             checkattend.cityOut=city;
//             await checkattend.save();
//             // const result = await Attendance.updateOne(
//             //     { username: name }, // Condition to find the record
//             //     { $set: { : outtime } } // Update operation
//             // );
//             // if (result.nModified > 0) {
//             //     console.log("Outtime updated successfully.");
//             // } else {
//             //     console.log("No record found or outtime was already set.");
//             // }
//             alert("You are succesfully Checked Out!")
//             res.redirect("/login"); 
//         }
//         else{    
//         alert("You are already Checked In!")
//         res.redirect("/login");

//     }
// }
// });
// Check-In Route
// app.post("/checkin", async (req, res) => {
//     const { latitude, longitude, name, intime, date, city } = req.body;
//     console.log("Check-In Data:", { latitude, longitude, name, intime, date, city });
//     console.log(req.body);

//     let check = await Employee.findByUsername(name);
//     let checkattend = await Attendance.findByUsername(name);

//     if (check == null) {
//         alert("No such employee Present in any of the department");
//         res.redirect("/login");
//     } else {
//         if (checkattend == null) {
//             let attendance = new Attendance({
//                 username: name,
//                 latitudeIn: latitude,
//                 longitudeIn: longitude,
//                 DateIn: date,
//                 cityIn: city,
//                 intime: intime
//             });
//             await attendance.save();
//             alert("You are successfully Checked In!");
//             res.redirect("/login");
//         } else {
//             alert("You are already Checked In!");
//             res.redirect("/login");
//         }
//     }
// });

app.post("/checkin", async (req, res) => {
    const { latitude, longitude, name, intime, date, city } = req.body;
    console.log("Check-In Data:", { latitude, longitude, name, intime, date, city });
    // Check if the request body contains the expected data
    console.log(req.body); // Log the request body
    // Process the data...
    let check = await Employee.findByUsername(name);
    let checkattend = await Attendance.findByUsername(name);
    console.log(check+checkattend);
    if (check == null) {
                alert("No such employee Present in any of the department");
                res.redirect("/login");
    }

});
// Check-Out Route
app.post("/checkout", async (req, res) => {
    const { latitude, longitude, name, outtime, date, city } = req.body;
    console.log("Check-Out Data:", { latitude, longitude, name, outtime, date, city });

    let check = await Employee.findByUsername(name);
    let checkattend = await Attendance.findByUsername(name);

    if (check == null) {
        alert("No such employee Present in any of the department");
        res.redirect("/login");
    } else {
        let intimecheck = checkattend.intime;
        if (intimecheck != undefined) {
            checkattend.latitudeOut = latitude;
            checkattend.longitudeOut = longitude;
            checkattend.outime = outtime;
            checkattend.DateOut = date;
            checkattend.cityOut = city;
            await checkattend.save();
            alert("You are successfully Checked Out!");
            res.redirect("/login");
        } else {
            alert("You are already Checked In!");
            res.redirect("/login");
        }
    }
});
app.get("/Admin/Dashboard/Attendance",async(req,res)=>{
    let attendance = await Attendance.find({});
    console.log(attendance);
  res.render("main/attendance.ejs",{attendance});
});
app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are succesfully logged out!")
        res.redirect("/login");
    })
});
// app.get("/hello",(req,res)=>{
//     res.send("hello1")
// })
// app.post("/login/Admin/Dashboard",(req,res)=>{
//     let{admin:admin,password:password}=req.body;
//     console.log(admin);
// console.log(password); 
// })
// app.post("/checkin",(req,res)=>{
//     let {longitude:longitude,latitude:latitude,name:name,intime:intime,city:city,country:country,date:date,totaltime:totaltime}=req.body;
//     console.log(totaltime);
//     console.log(date);
//     if(name==""){
//         res.redirect("/login");
//         alert("Please provide employee name");
//     }
//     else{
//         let attendance=[name,latitude,longitude,date,city,country,intime];
//         let q=`insert into attendance(name,lattitude,longitude,date,city,country,intime) values(?,?,?,?,?,?,?)`;
//         try{
//             connection.query(q,attendance,(err,result)=>{
//                 if(err) throw err;
//                 console.log(result);
//                 res.redirect("/login");
//                 alert("attendance is marked");
//             })
//         }
//         catch(err){
//             console.log(err);
//         }
//     } 
// })

// app.get("/Admin/Dashboard/Attendance",(req,res)=>{
//     let q=`select *from attendance`;
//     try{
//      connection.query(q,(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.render("main/attendance.ejs",{result})
//      })
//     }
//     catch(err){
//         console.log(err);
//     }
    
// })

// app.post("/checkout", (req, res) => {
//     let { name: name, outtime: outtime } = req.body;
//     console.log(outtime);
//     if(name==""){
//         res.redirect("/login");
//         alert("Please provide employee name");
//     }
//     else{
//     let q = `UPDATE attendance SET outtime = ? WHERE name ='${name}'`;
//     let value = [outtime];
  
//     try {
//       connection.query(q, value, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.redirect("/login");
//         alert("Checkout successful");
//       });
//     } catch (err) {
//       console.log(err);
//     }
// }
// });