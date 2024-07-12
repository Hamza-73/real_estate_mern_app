const express = require('express')
const router = express.Router();

const { updateUser , deleteUser , signOut } = require('../controllers/user.controller');
const { verifyToken } = require('../utils/verifyUser');

router.get('/logout',  signOut );
router.post('/update/:id', verifyToken ,updateUser );
router.delete('/delete/:id', verifyToken , deleteUser );

module.exports = router;