const mongoose = require("mongoose");

const usershema = new mongoose.Schema({
    username : { type:String , require:true, unique:true },
    email : { type:String , require:true, unique:true },
    password: { type:String , require:true },
    avatar: { type:String , default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s" }
}, { timestamps : true});

const User = mongoose.model('User', usershema);

module.exports = User;