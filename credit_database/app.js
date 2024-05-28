const express = require('express');
const cors = require("cors");

const credits_routes = require('./credits_routes.js');
const app = express();
const base_url = "saas"

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true }));

app.use(base_url+'/credits',credits_routes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found'})
});

module.exports = app;