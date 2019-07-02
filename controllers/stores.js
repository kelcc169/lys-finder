require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('../models')


const router = express.Router();

//GET / - show search page
router.get('/', function (req, res) {
    res.render('stores/index')
});

//GET - /search show 
router.get('/search', function (req, res) {
    let location = req.query.city + ',' + req.query.state
    let apiUrl = 'https://api.ravelry.com/shops/search.json?shop_type_id=1&query=' + location;
    let headers = {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.APIUSER}:${process.env.APIPASS}`).toString('base64')
    };

    axios.get(apiUrl, {headers} ).then( function(response) {
        let shopData = response.data
        console.log(shopData)
        res.render('stores/map', { shopData })
    }).catch(function(error) {
        res.json(error);
    });
});

//GET /search/:id - show an individual result from the location
router.get('/search/:id', function (req, res) {
    let store = parseInt(req.params.id)
    let apiUrl = 'https://api.ravelry.com/shops/' + store + '.json?include=schedules'
    let headers = {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.APIUSER}:${process.env.APIPASS}`).toString('base64')
    };

    axios.get(apiUrl, {headers} ).then( function(response) {
        let shopData = response.data
        console.log(shopData)
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
    }).spread(function (shop, created) {
        console.log(shop)
        res.send('something got created!')
        // use session data to go back to the previous page?
    }).catch(function (error) {
        res.send('something went wrong and/or it already existed');
    })  
});

module.exports = router;