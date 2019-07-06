require('dotenv').config();
const express = require('express');
const axios = require('axios');
const db = require('../models')
const methodOverride = require('method-override');

const router = express.Router();

router.use(methodOverride('_method'));

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
router.put('/:id', function (req, res) {
    let ravId = parseInt(req.params.id);

    //find record in favorites
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
            res.redirect('/profile/list')
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