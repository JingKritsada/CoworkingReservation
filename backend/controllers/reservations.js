const Reservation = require('../models/Reservation');
const Space = require('../models/Space');
const BannedUser = require('../models/BannedUser'); // Import BannedUser model

// Description: Get all reservations
// Route: GET /api/v1/reservations
// Access: Private
exports.getReservations = async (req, res, next) => {
    try {
        let conditions = {};
        if (req.user.role !== 'admin') {
            conditions.user_id = req.user.id;
        } else {
            if (req.params.spaceId) {
                conditions.space_id = req.params.spaceId;
            }
        }

        const reservations = await Reservation.findAll(conditions);
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to get reservations'
        });
    }
};

// Description: Get a reservation
// Route: GET /api/v1/reservations/:id
// Access: Private
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        if (req.user.role !== 'admin' && reservation.user.id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to get this reservation`
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to get reservation'
        });
    }
};

// Description: Create a reservation
// Route: POST /api/v1/spaces/:spaceId/reservations
// Access: Private
exports.createReservation = async (req, res, next) => {
    try {
        req.body.space_id = req.params.spaceId;
        const space = await Space.findById(req.params.spaceId);

        if (!space) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        req.body.user_id = req.user.id; // Only override if user_id is not provided

        //  Check if the user is banned
        const bannedUser = await BannedUser.findByUserId(req.user.id);
        if (bannedUser) {
            return res.status(403).json({
                success: false,
                message: 'You are banned from making reservations'
            });
        }

        //  Check if the user already has 3 reservations
        const conditions = { user_id: req.user.id };
        const existedReservations = await Reservation.findAll(conditions);

        if (existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already booked 3 reservations`
            });
        }

        //  Ensure status is set to "pending" by default
        const { user_id, space_id, reservation_date } = req.body;
        const reservation = await Reservation.create({ user_id, space_id, reservation_date, status: 'pending' });

        res.status(201).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to create reservation'
        });
    }
};

// Description: Update a reservation
// Route: PUT /api/v1/reservations/:id
// Access: Private
exports.updateReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        if (req.user.role !== 'admin' && reservation.user.id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reservation`
            });
        }

        // Allow updating status (e.g., mark as "checked_in")
        const { user_id, space_id, reservation_date, status } = req.body;
        const updatedReservation = await Reservation.update(req.params.id, { user_id, space_id, reservation_date, status });

        res.status(200).json({
            success: true,
            data: updatedReservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to update reservation'
        });
    }
};

// Description: Delete a reservation
// Route: DELETE /api/v1/reservations/:id
// Access: Private
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        if (reservation.user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this reservation`
            });
        }

        await Reservation.remove(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Reservation deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Unable to delete reservation'
        });
    }
};
