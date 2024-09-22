const mongoose = require('mongoose')
const submissions = require('../dbSchema');

const unlock = async(req, res, next) => {
    try{
        await mongoose.connect('mongodb://locked_db:27017');
        const { id } = req.params;
        console.log(id)
        const costArray = await submissions.find({ _id : id }).select('extra_credits user_id');
        const cost = costArray[0].extra_credits
        const user_id = costArray[0].user_id
        console.log('Extra credits needed', cost)

        const data = {
            "amount": -1*cost,
            "user_id": user_id
        }

        console.log(data)
        // const response = await axios.post(`http://localhost:1000/editCredits`, data);
        // if(response.status === 200){
            // next();
        // }else{
        //     res.status(406).send('Not enough credits')
        // }
        next()

    }catch(error){
        console.error('Error while processing the request:', error.message || error);
        res.status(500).send('Internal Server Error.');
    }
}



// const data = {
//     "amount": -50,
//     "user_id": user_id
// }

module.exports = unlock;
