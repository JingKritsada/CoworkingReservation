const express = require('express');
const router = express.Router();

const { protect, authorize, validateRegister } = require('../middlewares/auth');
const { register, login, logout, getMe, getUsers, getUser, updateUser, deleteUser } = require('../controllers/auth');

router.post('/register', validateRegister, register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

router.route('/')
    .get(protect, authorize('admin'), getUsers);

router.route('/:id')
    .get(protect, authorize('admin'), getUser)
    .put(protect, updateUser)
    .delete(protect, deleteUser);

module.exports = router;