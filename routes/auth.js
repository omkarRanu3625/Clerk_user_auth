const express = require('express');
const { createUser, updateUser, deleteUser } = require('../controllers/auth');
const router = express.Router();


router.post('/createUser', createUser);
router.post('/updateUser/:userId', updateUser);
router.delete('/deleteUser/:userId', deleteUser);

module.exports = router;
