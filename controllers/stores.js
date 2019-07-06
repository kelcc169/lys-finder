require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('../models')

const router = express.Router();

//geocoding setup
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mapbox({
    accessToken: process.env.MAPBOX_PUBLIC_KEY
})

//GET / - show search page
router.get('/', function (req, res) {
    res.render('stores/index')
});

//GET - /search show 
router.get('/search', function (req, res) {
    let location = req.query.city
    geocodingClient.forwardGeocode({
        query: location
    }).send().then(function (response) {
        let results = response.body.features[0].center
        console.log(results)

        let headers = {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.APIUSER}:${process.env.APIPASS}`).toString('base64')
        };
        
        let apiUrl = 'https://api.ravelry.com/shops/search.json?shop_type_id=1&radius=20&units=miles&lat=' + results[1] + '&lng=' + results[0];
        axios.get(apiUrl, {headers} ).then( function(response) {
            let shopData = response.data
            res.render('stores/map', { shopData })
        }).catch(function(error) {
            res.json(error);
        });
    });
});

// TODO change route to just be store and id
//GET /search/:id - show an individual result from the location
router.get('/search/:id', function (req, res) {
    let store = parseInt(req.params.id)
    let apiUrl = 'https://api.ravelry.com/shops/' + store + '.json?include=schedules+brands'
    let headers = {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.APIUSER}:${process.env.APIPASS}`).toString('base64')
    };

    axios.get(apiUrl, {headers} ).then( function(response) {
        let shopData = response.data
        res.render('stores/show', { shopData })
    });
});

//POST /search - add to go-to list
router.post('/add/:id', function (req, res) {
    db.location.findOrCreate({
        where: {
            name: req.body.name,
            city: req.body.city,
            state: req.body.state,
            ravId: req.body.ravId
        }
    }).spread(function (store, created) {
        db.favorite.findOrCreate({
            where: {
                userId: req.user.id,
                locationId: store.id,
                visited: false
            }
        }).then(function (shop) {
            console.log(shop)
            res.redirect('/profile')
        });
    }).catch(function (error) {
        res.send(error);
    });  
});

module.exports = router;
