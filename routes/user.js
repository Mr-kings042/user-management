const express = require('express');
const {
    RegisterUser,
    Userlogin,
    getUser
} = require('../controllers/user');
const router = express.Router();
const verifyToken = require('../middleware/TokenHandler');

router.post('/auth/register', RegisterUser);
router.post('/auth/login', Userlogin);
router.get('/api/users/:id',verifyToken,getUser);

module.exports = router;