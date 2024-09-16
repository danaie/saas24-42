const crypto = require('crypto');

const createID = (req, res, next) => {
    const keys = Object.keys(req.body);
    console.log(req.body.timestamp)
    const { user_id, submission_name, timestamp} = req.body;

    const randomNum = Math.floor(Math.random() * 100000);

    const idString = `${user_id}-${submission_name}-${timestamp}-${randomNum}`;

    const requestID = crypto.createHash('sha256').update(idString).digest('hex');
    req.body._id = requestID
    console.log('Generated Request ID:', requestID);

    next()
}

module.exports = createID