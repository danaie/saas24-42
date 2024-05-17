const express = require('express');

const credits_routes = require('./credits_routes.js');
const app = express();
const base_url = "saas"

app.use(express.json());
app.use(express.urlencoded( {extended: true }));

app.use(base_url+'/credits',credits_routes);
