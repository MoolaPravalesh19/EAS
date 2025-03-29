const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const AttendSchema = new Schema({
    username:{
       type:String,
       required:true
    },
    latitudeIn:{
        type:Number,
        required:true
    },
    longitudeIn:{
        type:Number,
        required:true
    },
    DateIn:{
        type:String,
        required:true
    },
    cityIn:{
        type:String,
        required:true
    },
    intime:{
        type:String,
        required:true
    },
    latitudeOut:{
        type:Number,
        
    },
    longitudeOut:{
        type:Number,
        
    },
    DateOut:{
        type:String,
        
    },
    cityOut:{
        type:String,
        
    },
    outime:{
        type:String,
    }
});

AttendSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Attendance', AttendSchema);