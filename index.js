require("dotenv").config();
let express = require("express");
const cors = require("cors");

let app = express();
let port = 3000;
let path = require("path");
let ejsMate = require("ejs-mate");
let alert = require("alert-node");
const mongoose = require("mongoose");
const Admin = require("./models/admin");
const Employee = require("./models/employee");
const Attendance = require("./models/attendance");
const passport = require("passport");
require("./config/passport")(passport);
const session = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.json());
app.use(cors());

const dburl = process.env.ATLASDB_URL;
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
};

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

app.listen(port, () => {
    console.log(`current port is ${port}`);
    // console.log(geolocation.longitude);
});

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("main/index.ejs");
});

app.post(
    "/verify",
    passport.authenticate("admin", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        const admin = await Admin.find({ username: req.body.username });
        console.log(req.body);
        const employeecount = await Employee.countDocuments({});
        res.render("main/dashboard.ejs",{employeecount});
    }
);
app.get("/Admin/Dashboard/Employee", async (req, res) => {
    let employee = await Employee.find({});
    console.log(employee);
    res.render("main/employee-list.ejs", { employee });
});
app.get("/Admin/Dashboard/add-employee", (req, res) => {
    res.render("main/add-employee.ejs");
});
app.post("/Admin/new-employee", async (req, res) => {
    let { username: username, Phonenumber: Phonenumber, Email: Email } = req.body;
    console.log(username + Phonenumber + Email);
    let check = await Employee.findByUsername(username);
    console.log(check);
    if (check == null) {
        let EmployeeDetails = Employee({
            username: username,
            Phonenumber: Phonenumber,
            Email: Email,
        });
        EmployeeDetails.save();
        req.flash("success", "Registration is successfully done");
        res.redirect("/Admin/Dashboard/add-employee");
    } else {
        req.flash("error", "Employee had already been Placed");
        res.redirect("/Admin/Dashboard/add-employee");
    }
});

// Check-In Route
app.post("/checkin", async (req, res) => {
    const { latitude, longitude, name, intime, date, city } = req.body;

    try {
        // Check if the employee exists
        const employee = await Employee.findOne({ username: name });
        console.log(!employee);
        if (!employee) {
            req.flash("error", "Employee does not exist.");
            return res.redirect("/login");
        }

        // Check if the employee is already checked in
        const existingAttendance = await Attendance.findOne({ username: name, DateIn: date });
        if (existingAttendance) {
            req.flash("error", "You are already checked in!");
            return res.redirect("/login");
        }

        // Create a new attendance record
        const attendance = new Attendance({
            username: name,
            latitudeIn: latitude,
            longitudeIn: longitude,
            DateIn: date,
            cityIn: city,
            intime: intime
        });
        await attendance.save();

        req.flash("success", "You have successfully checked in!");
        res.redirect("/login");
    }
    catch (error) {
        console.error("Check-In Error:", error);
        req.flash("error", "An error occurred during check-in. Please try again.");
        res.redirect("/login");
    }
});

// Check-Out Route
app.post("/checkout", async (req, res) => {
    const { latitude, longitude, name, outtime, date, city } = req.body;

    try {
        // Check if the employee exists
        const employee = await Employee.findOne({ username: name });
        if (!employee) {
            req.flash("error", "Employee does not exist.");
            return res.redirect("/login");
        }

        // Check if the employee is checked in
        const existingAttendance = await Attendance.findOne({ username: name, DateIn: date });
        if (!existingAttendance || existingAttendance.outime) {
            req.flash("error", "You are not checked in or already checked out!");
            return res.redirect("/login");
        }

        // Update the attendance record with check-out details
        existingAttendance.latitudeOut = latitude;
        existingAttendance.longitudeOut = longitude;
        existingAttendance.outime = outtime;
        existingAttendance.DateOut = date;
        existingAttendance.cityOut = city;
        await existingAttendance.save();

        req.flash("success", "You have successfully checked out!");
        res.redirect("/login");
    } catch (error) {
        console.error("Check-Out Error:", error);
        req.flash("error", "An error occurred during check-out. Please try again.");
        res.redirect("/login");
    }
});
app.get("/Admin/Dashboard/Attendance", async (req, res) => {
    let attendance = await Attendance.find({});
    console.log(attendance);
    res.render("main/attendance.ejs", { attendance });
});
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        // req.flash("success", "succesfully logged out!");
        res.redirect("/login");
    });
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
