'use strict';
const _ = require('lodash');
const async = require('async');
const validator = require('validator');
const request = require('request');
const GoogleMapsAPI = require('googlemaps');
const LifeMarker = require('../models/LifeMarker');
const User = require('../models/User');
const mongoose = require('mongoose');

function getGoogleMapsInstance() {
    return new Promise(function (res, rej) {
        var gmConfig = {
            key: process.env.GOOGLE_MAPS_API_KEY
        };
        res(new GoogleMapsAPI(gmConfig));
    });
}

function getGeocodedValues(gmAPI, req, res, next) {
    return new Promise(function (res, rej) {
        var geocodeParams = {
            "address": req.body['location-address']
        };

        gmAPI.geocode(geocodeParams, function (err, result) {
            var results = {
                formatted_address: '',
                lat: 30.267153,
                lng: -97.938383
            };

            results.formatted_address = result.results[0].formatted_address;
            results.lat = result.results[0].geometry.location.lat;
            results.lng = result.results[0].geometry.location.lng;

            // console.log(result);
            // console.log(results);

            if (results.formatted_address != '') {
                res(results);
            } else {
                rej(req.flash('failure'), {msg: 'Invalid Address'});
            }
        });
    });
}

/**
 * GET /map/my-life-map
 * Viewing my life map page.
 */
exports.getMyLifeMap = (req, res, next) => {
    LifeMarker.find({'marker_id' : req.user.id}, {'location': 1, '_id': 0}, (err, docs) => {
        res.render('map/my-life-map', {
            title: 'My Life Map',
            lifeMarkers: docs
        });
    });
};

/**
 * GET /map/edit-life-map
 * Edit my life map info page.
 */
exports.getEditLifeMap = (req, res, next) => {
    LifeMarker.find({'marker_id' : req.user.id}, (err, docs) => {
        res.render('map/edit-life-map', {
            title: 'Edit My Life Map',
            lifeMarkers: docs
        });
    });
};

/**
 * POST /map/edit-life-map/create-marker
 * Create a new life marker.
 */
exports.postCreateNewLifeMarker = (req, res, next) => {
    req.assert('title', 'Title cannot be empty').notEmpty();
    req.assert('date-from', 'Date from cannot be empty').notEmpty();
    req.assert('date-to', 'Date to cannot be empty').notEmpty();
    req.assert('location-name', 'Location name cannot be empty').notEmpty();
    req.assert('location-address', 'Location address cannot be empty').notEmpty();

    getGoogleMapsInstance()
        .then(function (gmAPI) {
            return getGeocodedValues(gmAPI, req, res, next);
        })
        .then(function (results) {
            const errors = req.validationErrors();

            if (errors) {
                req.flash('errors', errors);
                return res.redirect('/edit-life-map');
            }

            const lifeMarker = new LifeMarker({
                marker_id: req.body['user-id'],
                title: req.body.title,
                dates: {
                    from: req.body['date-from'],
                    to: req.body['date-to']
                },
                location: {
                    locationName: req.body['location-name'],
                    address: results.formatted_address,
                    lat: results.lat,
                    lng: results.lng
                },
                description: req.body.description,
                private: req.body.private
            });

            lifeMarker.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/edit-life-map');
            });
        });
};

/**
 * POST /map/edit-life-marker
 * Edit life marker chosen page pre-populated with chose life-marker data.
 */
exports.postEditLifeMarker = (req, res, next) => {
    const lifeMarker = req.body['life-marker'];
    LifeMarker.findById(lifeMarker, (err, doc) => {
        if (err) {
            return next(err);
        }
        res.render('map/edit-life-marker', {
            title: 'Edit Life Marker',
            lifeMarker: doc
        });
    });
};

/**
 * POST /map/edit-life-marker/update-life-marker
 *
 * Edit life marker chosen.
 */
exports.postUpdateLifeMarker = (req, res, next) => {
    req.assert('title', 'Title cannot be empty').notEmpty();
    req.assert('date-from', 'Date from cannot be empty').notEmpty();
    req.assert('date-to', 'Date to cannot be empty').notEmpty();
    req.assert('location-name', 'Location name cannot be empty').notEmpty();
    req.assert('location-address', 'Location address cannot be empty').notEmpty();

    getGoogleMapsInstance()
        .then(function (gmAPI) {
            return getGeocodedValues(gmAPI, req, res, next);
        })
        .then(function (results) {
            const errors = req.validationErrors();

            if (errors) {
                req.flash('errors', errors);
                return res.redirect('/edit-life-map');
            }

            LifeMarker.findById(req.body['lifeMarker-id'], (err, lifeMarker) => {
                if (err) {
                    return next(err);
                }
                lifeMarker.title = req.body.title;
                lifeMarker.dates = {
                    from: req.body['date-from'],
                    to: req.body['date-to']
                };
                lifeMarker.location = {
                    locationName: req.body['location-name'],
                    address: results.formatted_address,
                    lat: results.lat,
                    lng: results.lng
                };
                lifeMarker.description = req.body.description;
                lifeMarker.private = req.body.private;

                lifeMarker.save((err) => {
                    if (err) {return next(err);}
                    req.flash('success', { msg: 'Life Marker has been changed.' });
                    res.redirect('/edit-life-map');
                });
            });
        });
};

/**
 * GET /map/persons
 * View map of all persons life markers page.
 */
exports.getPersons = (req, res, next) => {
    LifeMarker.find({}, {'location': 1, '_id': 0}, (err, docs) => {
        res.render('map/persons', {
            title: 'Life of All',
            lifeMarkers: docs
        });
    });
};

/**
 * GET /map/persons/:person
 * Show life map of person selected page.
 */
exports.getPersonLifeMap = (req, res, next) => {
    res.render('map/persons/:person', {
        title: 'Person Life Map'
    });
};