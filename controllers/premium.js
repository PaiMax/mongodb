const user=require('../model/user');
const expense=require('../model/expense');
//const Sequelize=require('sequelize');
//const sequelize = require('../util/database');


exports.showLeader = async (req, res, next) => {
    try {
        const leaders = await user.find({}).select('name totalamount').sort('-totalamount');
        res.json(leaders);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
