const express = require('express');
const router = express.Router();

const reservationRouter = require('./reservations');
const { protect, authorize } = require('../middlewares/auth');
const { getSpaces, getSpace, createSpace, updateSpace, deleteSpace } = require('../controllers/spaces');

router.use('/:spaceId/reservations', reservationRouter);

router.route('/')
    .get(getSpaces)
    .post(protect, authorize('admin'), createSpace);

router.route('/:id')
    .get(getSpace)
    .put(protect, authorize('admin'), updateSpace)
    .delete(protect, authorize('admin'), deleteSpace);

module.exports = router;