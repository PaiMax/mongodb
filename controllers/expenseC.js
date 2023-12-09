const expense=require('../model/expense');
const jwt=require('jsonwebtoken');
 const userTabel=require('../model/user');
// const sequelize=require('../util/database');
const S3Service=require('../services/S3services');
 const fileDownloadTabel=require('../model/filedownloaded');
 const mongoose=require('mongoose');



exports.addexpense= async (req,res,next)=>{
    //const t= await sequelize.transaction(); 
    const session = await mongoose.startSession();
    session.startTransaction();
    
 try{
         const token=req.header('Authorization');
    
    
     const amount=req.body.amount1;
      const des=req.body.dis;
     const category=req.body.category;

    const user=jwt.verify(token,process.env.TOKEN_COMPARE);

    const result=await  new  expense({
        amount:amount,
        description:des,
         category:category,
       userId:user.userId

   },);
     console.log(result);
    
       
        const amountUser=await userTabel.findByPk(user.userId).select('totalamount').session(session);
            console.log("amount user----"+amountUser.dataValues.totalamount);
            console.log('type==='+typeof amount);
            const amountParse=parseInt(amount);
            
            amountUser.dataValues.totalamount+=amountParse;
            await amountUser.save({session});
            console.log("total amount="+amountUser.dataValues.totalamount);
            await userTabel.update({totalamount:amountUser.dataValues.totalamount},{where:{id:user.userId},transaction:t})
            //console.log("expense-----------"+expenseData);
            await t.commit();
            const expenseData =await expense.findByPk(result.dataValues.id,{ attributes : ['id','amount','description','category']})
            console.log(expenseData);
            await session.commitTransaction();
             session.endSession();
            res.send(expenseData.dataValues);
            }
    
    
    catch(err){
        await session.abortTransaction();
        session.endSession();
        console.log(err)
        res.status(500).send({ message: 'An error occurred while adding the expense.' })
        
        
        
        


}
}







exports.removeExpense = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const idToDelete = req.params.id;
        const expenseToDelete = await Expense.findById(idToDelete).select('amount userId');
        await Expense.findByIdAndDelete(idToDelete);

        const userToUpdate = await User.findById(expenseToDelete.userId).select('totalamount').session(session);

        const newAmount = userToUpdate.totalamount - expenseToDelete.amount;
        userToUpdate.totalamount = newAmount;
        await userToUpdate.save({ session });

        await session.commitTransaction();
        session.endSession();

        console.log('Deleted');
        res.send('Deleted successful');
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err);
        res.status(500).json({ success: 'fail' });
    }
};






exports.updateExpense = (req, res, next) => {
    const idToUpdate = req.params.id;
    const dataToUpdate = req.body;

    expense.findByIdAndUpdate(idToUpdate, {
        amount: dataToUpdate.amount1,
        description: dataToUpdate.dis,
        category: dataToUpdate.category
    })
    .then(updatedExpense => {
        if (updatedExpense) {
            console.log('Successfully updated');
            res.send('Updated');
        } else {
            console.log('Document not found.');
            res.status(404).send('Document not found.');
        }
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error updating document.');
    });
};





exports.getExpense = (req, res, next) => {
    const itemsPerPage = +req.query.pageSize;
    const page = +req.query.page || 1;

    let totalItems;

    expense.countDocuments({ userId: req.user.id })
        .then(total => {
            totalItems = total;
            return expense.find({ userId: req.user.id })
                .select('id amount description category')
                .skip((page - 1) * itemsPerPage)
                .limit(itemsPerPage);
        })
        .then(userdata => {
            console.log('Users are:', userdata);

            return res.json({
                user: userdata,
                currentPage: page,
                hasNextPage: itemsPerPage * page < totalItems,
                nextPage: page + 1,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / itemsPerPage),
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching data.');
        });
};






exports.download = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const expenses = await expense.find({ userId: req.user.id });

        const StringExpenses = JSON.stringify(expenses);

        const userId = req.user.id;
        const fileName = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Service.uploadToS3(StringExpenses, fileName);
        

        const fileDownload = new FileDownload({
            fileurl: fileUrl,
            userId: userId,
        });

        await fileDownload.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ fileUrl, success: true });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err);
        res.status(500).json({ fileUrl: '', success: false, err: err });
    }
};



exports.showFileDownloaded = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const files = await fileDownloadTabel.find({ userId: userId }).select('fileurl createdAt');

        res.status(200).json({ data: files });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
};










