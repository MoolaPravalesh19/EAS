require("dotenv").config();
const mongoose=require("mongoose");
const Admin=require("../models/admin.js");
const Employee=require("../models/employee.js");
const data = require("./data.js");
const bcrypt = require('bcrypt');
// const MONGO_URL="mongodb://127.0.0.1:27017/employee";
// main().then(()=>{
//     console.log("connected DB");
// })
// .catch((err)=>{
//     console.log(err);
// })
// async function main(){
//     await mongoose.connect(MONGO_URL);   
// }
const dburl=process.env.ATLASDB_URL;
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const admin = data.sampleadmins;
const employees = data.data1;
const addadmin= async ()=>{
    console.log(admin)
    let hashpassword=await bcrypt.hash(admin.Password,10);
    let Admin1 = new Admin({
        username: admin.username,
        Email:admin.Email,
        Phonenumber:admin.Phonenumber,
        Password:hashpassword
    })
    Admin1.save();
}
const addemployees = async () => {
    

    for (let employee of employees) {
        // Hash the password
       
        // Create a new employee object with the hashed password
        let employeedetails= new Employee({
            username: employee.username,
            Phonenumber: employee.Phonenumber,
            Email: employee.Email,
        });
        employeedetails.save();
        
    }

    // Insert all employees at once
    console.log("employees added with hashed passwords");
};

const initDBB = async () => {
    await addemployees();
    await addadmin();
    console.log("data saved");
}
initDBB();