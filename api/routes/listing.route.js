const express = require('express');
const { createListing, deleteListing, updateListings, getListing,  getListings } = require('../controllers/listing.controller');
const { verifyToken } = require('../utils/verifyUser');

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListings);
router.get('/get/:id',  getListing);
router.get('/get',  getListings);

module.exports = router;