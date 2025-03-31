const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const AdminSchema = new Schema({
    username:{
       type:String,
       required:true
    },
    Email:{
        type:String,
        required:true
    },
    Phonenumber:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
});

AdminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', AdminSchema);