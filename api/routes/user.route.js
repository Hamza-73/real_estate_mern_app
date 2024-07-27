const express = require('express')
const router = express.Router();

const { updateUser , deleteUser , signOut, getUserListing, getUser } = require('../controllers/user.controller');
const { verifyToken } = require('../utils/verifyUser');

router.get('/logout',  signOut );
router.post('/update/:id', verifyToken ,updateUser );
router.delete('/delete/:id', verifyToken , deleteUser );
router.get('/listings/:id', verifyToken , getUserListing );
router.get('/:id', verifyToken , getUser );

module.exports = router;