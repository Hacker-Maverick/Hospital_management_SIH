import mongoose from "mongoose";

const reghosschema = new mongoose.Schema({
    hos_id:{
        type:mongoose.Schema.Types.String,
        unique:true
    },
    hospitalname:{
        type:mongoose.Schema.Types.String,
        required:true,
    },
    hospitalcode:{
        type:mongoose.Schema.Types.String,
        required:true,
    },
    admins:[{
        username:{
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
        },
        password:{type:mongoose.Schema.Types.String,
        required:true,
        }
    }]

})

export const registered_hospitals = mongoose.model("registered_hospitals",reghosschema);