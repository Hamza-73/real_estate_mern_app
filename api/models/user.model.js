const mongoose = require("mongoose");

const usershema = new mongoose.Schema({
    username : { type:String , require:true, unique:true },
    email : { type:String , require:true, unique:true },
    password: { type:String , require:true }
}, { timestamps : true});

const User = mongoose.model('User', usershema);

module.exports = User;