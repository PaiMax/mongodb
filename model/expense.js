//const Sequelize=require('sequelize');
//const sequelize=require('../util/database');

const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const expenseSchema =new Schema({
    
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
        unique:true
    },
    category:{
        type:String,
        required:true

    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
});

const Expense=mongoose.model('Expense',expenseSchema);
module.exports=Expense;