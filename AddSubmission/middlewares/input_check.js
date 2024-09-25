const axios = require('axios').default;

const inputCheck = async (req, res, next) => {
    try
    {
        const keys = Object.keys(req.body);
        if (keys.length !== 8 || keys[0] !== 'locations' || keys[1] !== 'num_vehicles' || keys[2] !== 'depot' || keys[3] !== 'max_distance' || keys[4] !== 'user_id' || keys[5] !== 'username' || keys[6] !== 'submission_name' || keys[7] !== 'timestamp') {
            return res.status(400).send('Wrong parameters in Request Body');
        }

        const { locations, num_vehicles, depot, max_distance, user_id, username, submission_name, timestamp} = req.body;

        for (let loc of locations) {
            const locKeys = Object.keys(loc);

            if (locKeys.length !== 2 || locKeys[0] !== 'Latitude' || locKeys[1] !== 'Longitude') {
                return res.status(400).send('Wrong parameters in locations');
            }

            if (typeof loc.Latitude !== 'number' || typeof loc.Longitude !== 'number') {
                return res.status(400).send('Latitude and Longitude must be numbers');
            }
        }

        if (typeof num_vehicles !== 'number' || typeof depot !== 'number' || typeof max_distance !== 'number') {
            return res.status(400).send('num_vehicles, depot and max_distance must be numbers');
        }
        console.log(timestamp)
        if (typeof username !== 'string' || typeof submission_name !== 'string' || typeof user_id !== 'string') {
            return res.status(400).send('username, submission_name and user_id should be strings');
        }

        if (typeof timestamp === 'string') {
            // Try to convert the string to a Date object
            const date = new Date(timestamp);
        
            // Check if the conversion resulted in a valid Date
            if (isNaN(date.getTime())) {
                return res.status(400).send('timestamp should be a valid Date string');
            }
        } else {
            return res.status(400).send('timestamp should be a string representing a Date');
        }
        
        const data = {
            "amount": -50,
            "user_id": user_id
        }

        const response = await axios.post(`http://credit-transaction:8080/edit_credits`, data);
        if(response.status === 200){
            next();
        }else{
             res.status(406).send('Not enough credits')
        }
        
    }catch (error) {
        console.error('Error while processing the request:', error.message || error);
        res.status(500).send('Internal Server Error.');
    }
};

module.exports = inputCheck;
