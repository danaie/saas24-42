const express = require('express');
const { Submission } = require('../dbSchema'); // Import the Submission model from the db
const router = express.Router();



// DELETE request to delete all submissions (analytics)
router.get('/deleteall', async (req, res) => {
    try {
      await mongoose.connect('mongodb://solverq_db:27017')
      // Delete all documents from the Submission collection
      const result = await Submission.deleteMany({});
      
      console.log(`${result.deletedCount} submissions deleted from the database`);
  
      res.json({ message: `${result.deletedCount} submissions deleted from the database` });
    } catch (error) {
      console.error('Error deleting submissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  module.exports = router;
