const express = require('express');

const credits_controller = require('./credits_controller');

const router = express.Router();

router.get('/:user_id',credits_controller.getCredits);