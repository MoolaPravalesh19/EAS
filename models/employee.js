const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const EmployeeSchema = new Schema({
    username:{
       type:String,
       required:true
    },
    
    Phonenumber:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
});

EmployeeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Employee', EmployeeSchema);