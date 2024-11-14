const mongoose = require('mongoose');
const Schema = mongoose.Schema;


UserModel = new Schema({
    userName : {
        type : String,
        required : true,
        unique : true
    },
    userEmail : {
        type : String,
        unique : true,
        required : true,
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    }
});

UserModel = mongoose.model('UserModel',UserModel);

module.exports = UserModel;