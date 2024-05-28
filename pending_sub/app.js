const express = require("express");
const cors = require("cors");

const routes = require("pending_routes.js")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true }));

app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found'})
});

module.exports = app;