'use strict';
const _ = require('lodash');
const async = require('async');
const validator = require('validator');
const request = require('request');

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