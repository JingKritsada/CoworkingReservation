const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/auth');
const { getReservations, getReservation, createReservation, updateReservation, deleteReservation } = require('../controllers/reservations');

router.route('/')
    .get(protect, getReservations)
    .post(protect, createReservation);

router.route('/:id')
    .get(protect, getReservation)
    .put(protect, updateReservation)
    .delete(protect, deleteReservation);

module.exports = router;