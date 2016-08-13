'use strict';
const _ = require('lodash');
const async = require('async');
const validator = require('validator');
const request = require('request');
const Map = require('../models/Map');
const LifeMarker = require('../models/LifeMarker');

/**
 * GET /map/my-life-map
 * Viewing my life map page.
 */
exports.getMyLifeMap = (req, res, next) => {
    res.render('map/my-life-map', {
        title: 'My Life Map'
    });
};

/**
 * GET /map/edit-life-map
 * Edit my life map info page.
 */
exports.getEditLifeMap = (req, res, next) => {
    res.render('map/edit-life-map', {
        title: 'Edit My Life Map'
    });
};

/**
 * POST /map/edit-life-map/create-marker
 * Create a new life marker.
 */
exports.postEditLifeMap = (req, res, next) => {
    req.assert('title', 'Title cannot be empty').notEmpty();
    req.assert('date-from', 'Date from cannot be empty').notEmpty();
    req.assert('date-to', 'Date to cannot be empty').notEmpty();
    req.assert('location-name', 'Location name cannot be empty').notEmpty();
    req.assert('location-address', 'Location address cannot be empty').notEmpty();

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
            to: req.body['date-to'],
        },
        location: {
            locationName: req.body['location-name'],
            address: req.body['location-address'],
            lat: 300.00,
            long: 300.25
        },
        description: req.body.description,
        private: req.body.private
    });

    lifeMarker.save((err) => {
        if (err) { return next(err); }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
};

/**
 * PUT /map/edit-life-map/:life-marker
 * Edit life marker chosen.
 */
exports.putEditLifeMap = (req, res, next) => {
    res.render('map/edit-life-map', {
        title: 'Edit My Life Map'
    });
};

/**
 * GET /map/persons
 * View list of persons available page.
 */
exports.getPersons = (req, res, next) => {
    res.render('map/persons', {
        title: 'Person Life Map'
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