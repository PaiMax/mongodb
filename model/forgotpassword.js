//const Sequelize=require('sequelize');
//const sequelize=require('../util/database');
//const forgot=sequelize.define('ForgotPasswordRequests',{
    //id:{
        //type:Sequelize.UUID,
        //allowNull:false,
        //primaryKey:true
//},

//isactive:{
    //type:Sequelize.BOOLEAN
//}

//}/)
//module.exports=forgot;
const mongoose = require('mongoose');

const forgotSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    isactive: {
        type: Boolean
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
});

const ForgotPasswordRequest = mongoose.model('ForgotPasswordRequest', forgotSchema);

module.exports = ForgotPasswordRequest;
