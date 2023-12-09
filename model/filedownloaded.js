//const Sequelize=require('sequelize');
//const sequelize=require('../util/database');
//const file =sequelize.define('filedownloaded',{
    ///id:{
       // type:Sequelize.INTEGER,
        //autoIncrement: true,
        //allowNull:false,
        //primaryKey:true
    //},
    //fileurl:{
      //  type:Sequelize.STRING,
        //allowNull:false
    //}
   
//});

///module.exports=file;
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileurl: {
        type: String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
});

const FileDownloaded = mongoose.model('FileDownloaded', fileSchema);

module.exports = FileDownloaded;
