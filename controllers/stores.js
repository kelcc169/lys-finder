require('dotenv').config();
const express = require('express');
const axios = require('axios');

const router = express.Router();

//GET / - show search thing
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
        res.json(response.data)
    }).catch(function(error) {
        res.json(error);
    });
    
});

//GET /search/:id - show an individual result from the location
router.get('/search/:id', function (req, res) {
    //show just one of the results from the map?
});

//POST /search - add to go-to list

module.exports = router;