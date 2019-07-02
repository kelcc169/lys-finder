require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('../models')

const router = express.Router();

//GET / - show your name, click to go to lists for visited/want to visit
router.get('/', function (req, res) {
    res.render('profile/index')
})

//GET /list - show list of stores user wants to go to
router.get('/list', function (req, res) {
    db.user.findByPk(req.user.id).then(function (user) {
        user.getLocations().then(function (locations) {
            console.log(locations)
            res.render('profile/list', { locations })
        })
    })
    // res.render('profile/list')
})

//GET /visited - show list of stores user has gone to, including notes

//POST /notes - add note to location record

module.exports = router;