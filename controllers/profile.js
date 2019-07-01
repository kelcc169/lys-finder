require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

//GET / - show your name, click to go to lists for visited/want to visit

//GET /list - show list of stores user wants to go to

//GET /visited - show list of stores user has gone to, including notes

//POST /notes - add note to location record

module.exports = router;