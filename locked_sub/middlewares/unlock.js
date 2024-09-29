const mongoose = require('mongoose')
const amqp = require("amqplib/callback_api");
const submissions = require('../dbSchema');
const axios = require('axios').default;


const unlock = async(req, res, next) => {
  try {
      await mongoose.connect('mongodb://locked_db:27017');
      const { id } = req.params;
      console.log('Unlocking submission with ID:', id);
      
      const costArray = await submissions.find({ _id : id }).select('extra_credits user_id');
      const cost = costArray[0].extra_credits;
      const user_id = costArray[0].user_id;
      console.log('Extra credits needed', cost);

      const data = {
          "amount": -1 * cost,
          "user_id": user_id
      };

      const response = await axios.post(`http://credit-transaction:8080/edit_credits`, data);
      if (response.status === 200) {
          const del = await submissions.findByIdAndDelete(id);
          // (RabbitMQ publish code here)
          next();
      } else {
          res.status(406).send('Not enough credits'); // This line may not be reached
      }
  } catch (error) {
      if (error.response) {
          // Handle specific error responses
          if (error.response.status === 406) {
              return res.status(406).json({ message: "Not enough credits." });
          }
          // Log the error for debugging
          console.error(`Error ${error.response.status}:`, error.response.data);
          return res.status(error.response.status).json(error.response.data); // Forward the error
      }
      
      // Generic error handler
      console.error('Error while processing the request:', error.message || error);
      return res.status(500).send('Internal Server Error.');
  }
}




// const data = {
//     "amount": -50,
//     "user_id": user_id
// }

module.exports = unlock;
