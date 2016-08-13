const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const lifeMarkerSchema = new mongoose.Schema({
    marker_id: mongoose.Schema.Types.ObjectId,
    title: String,
    dates: {
        from: Date,
        to: Date
    },
    location: {
        locationName: String,
        address: String,
        lat: Number,
        long: Number
    },
    description: String,
    private: Boolean
}, {timestamps: true});

const LifeMarker = mongoose.model('LifeMarker', lifeMarkerSchema);

module.exports = LifeMarker;
