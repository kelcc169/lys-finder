require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('../models')
const methodOverride = require('method-override');

const router = express.Router();

router.use(methodOverride('_method'));

//GET / - show list of stores user has saved, maybe a map?
router.get('/', function (req, res) {
    db.user.findByPk(req.user.id).then(function (user) {
        user.getLocations().then(function (locations) {
            res.render('profile/list', { locations })
        });
    });
});

//GET /:id - show your one store and all its notes
router.get('/:id', function (req, res) {
    let ravId = parseInt(req.params.id)
    let apiUrl = 'https://api.ravelry.com/shops/' + ravId + '.json?include=schedules'
    let headers = {
        'Authorization': 'Basic ' + Buffer.from(`${process.env.APIUSER}:${process.env.APIPASS}`).toString('base64')
    };

    //find usersLocations
    db.location.findOne({
        where: {ravId: ravId}
    }).then( function (location) {
        db.favorite.findOne({
            where: {
                locationId: location.id,
                userId: req.user.id
            }
            //find notes with usersLocsId
        }).then(function (favorite) {
            console.log(favorite)
            db.comment.findAll({
                where: {
                    favoriteId: favorite.id
                }
            }).then( function (comments) {
                console.log(comments)
                axios.get(apiUrl, {headers} ).then( function(response) {
                    let shopData = response.data
                    res.render('profile/show', { shopData, comments })
                })
            })
        })
    });
});

//POST /add/:id - add to go-to list
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
            }
        }).then(function (shop) {
            console.log(shop)
            res.redirect('/profile')
        });
    }).catch(function (error) {
        res.send(error);
    });  
});

// POST /notes - add note to location record
router.post('/:id/notes', function (req, res) {
    //find location
    let ravId = parseInt(req.params.id);
    db.location.findOne({
        where: {ravId: ravId}
    }).then( function(location) {
        db.favorite.findOne({
            where: {
                locationId: location.id,
                userId: req.user.id
            }
        }).then( function(favorite) {
            db.comment.create({
                content: req.body.content,
                favoriteId: favorite.id
            }).then(function (data) {
                res.redirect('/profile/' + ravId)
            }).catch( function (error) {
                res.send(error)
            })
        })
    })
});

// PUT /profile/:id - update store to "visited"
router.put('/update/:id', function (req, res) {
    let ravId = parseInt(req.params.id);

    db.location.findOne({
        where: {
            ravId: ravId
        }
    }).then(function (location) {
        db.favorite.update({
                    visited: true
                }, {
                where: {
                    locationId: location.id,
                    userId: req.user.id
                }
        }).then( function (data) {
            res.redirect('/profile')
        });
    });
});

// DELETE /profile/:id - remove store from your favorites
router.delete('/:id', function (req, res) {
    let ravId = parseInt(req.params.id);

    db.location.findOne({
        where: {
            ravId: ravId
        }
    }).then(function (location) {
        db.favorite.destroy({
            where: {
                locationId: location.id,
                userId: req.user.id
            }
        }).then(function (data) {
            res.redirect('/profile/list')
        })
    })
});

module.exports = router;