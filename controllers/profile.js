require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('../models')

const router = express.Router();

//GET / - show your name, click to go to lists for visited/want to visit
router.get('/', function (req, res) {
    res.render('profile/index')
});

//GET /list - show list of stores user has saved
router.get('/list', function (req, res) {
    db.user.findByPk(req.user.id).then(function (user) {
        user.getLocations().then(function (locations) {
            res.render('profile/list', { locations })
        });
    });
});

//GET /:id - show your one store and all its notes
router.get('/:id', function (req, res) {
    let store = parseInt(req.params.id)
    let apiUrl = 'https://api.ravelry.com/shops/' + store + '.json?include=schedules+brands'
    let headers = {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.APIUSER}:${process.env.APIPASS}`).toString('base64')
    };

    axios.get(apiUrl, {headers} ).then( function(response) {
        let shopData = response.data
        res.render('profile/show', { shopData })
    });
});

// POST /notes - add note to location record
router.post('/:id/notes', function (req, res) {
    //find location
    let ravId = parseInt(req.params.id);
    db.location.findOne({
        where: {ravId: ravId}
    }).then( function(location) {
        db.usersLocations.findOne({
            where: {
                locationId: location.id,
                userId: req.user.id
            }
        }).then( function(userLoc) {
            db.note.create({
                content: req.body.content,
                usersLocationsId: userLoc.id
            }).then(function (data) {
                res.send('we did it!')
            }).catch( function (error) {
                res.send(error)
            })
        })
    })
});

// PUT /notes - update/edit notes

// DELETE /notes

module.exports = router;