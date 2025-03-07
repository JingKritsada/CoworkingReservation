const sql = require('../config/db.js');

// Constructor
const Reservation = function (reservation) {
    this.user_id = reservation.user_id;
    this.space_id = reservation.space_id;
    this.reservation_date = reservation.reservation_date;
    this.status = reservation.status || 'pending'; // Default to 'pending'
};

// Find all reservations with optional filters
Reservation.findAll = (conditions) => {
    return new Promise((resolve, reject) => {
        let queryText = `
            SELECT 
                r.reservation_id,
                r.reservation_date,
                r.status,
                s.space_id as space_id,
                s.name as space_name,
                s.address as space_address,
                u.id as user_id,
                u.name as user_name,
                u.email as user_email
            FROM reservations r
            INNER JOIN spaces s ON r.space_id = s.space_id
            INNER JOIN users u ON r.user_id = u.id
        `;

        const whereClauses = [];
        const values = [];
        let paramIndex = 1;

        if (conditions.user_id) {
            whereClauses.push(`r.user_id = $${paramIndex}`);
            values.push(conditions.user_id);
            paramIndex++;
        }

        if (conditions.space_id) {
            whereClauses.push(`r.space_id = $${paramIndex}`);
            values.push(conditions.space_id);
            paramIndex++;
        }

        if (whereClauses.length > 0) {
            queryText += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        sql.query(queryText, values, (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }

            const reservations = res.rows.map(row => ({
                reservation_id: row.reservation_id,
                reservation_date: row.reservation_date,
                status: row.status,
                space: {
                    id: row.space_id,
                    name: row.space_name,
                    address: row.space_address,
                },
                user: {
                    id: row.user_id,
                    name: row.user_name,
                    email: row.user_email
                }
            }));
            resolve(reservations);
        });
    });
};

// Find a reservation by ID
Reservation.findById = (id) => {
    return new Promise((resolve, reject) => {
        const queryText = `
            SELECT 
                r.reservation_id,
                r.reservation_date,
                r.status,
                s.space_id as space_id,
                s.name as space_name,
                s.address as space_address,
                u.id as user_id,
                u.name as user_name,
                u.email as user_email
            FROM reservations r
            INNER JOIN spaces s ON r.space_id = s.space_id
            INNER JOIN users u ON r.user_id = u.id
            WHERE r.reservation_id = $1
        `;

        sql.query(queryText, [id], (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }

            if (res.rows.length === 0) {
                resolve(null);
                return;
            }

            const row = res.rows[0];
            const reservation = {
                reservation_id: row.reservation_id,
                reservation_date: row.reservation_date,
                status: row.status,
                space: {
                    id: row.space_id,
                    name: row.space_name,
                    address: row.space_address,
                },
                user: {
                    id: row.user_id,
                    name: row.user_name,
                    email: row.user_email
                }
            };

            resolve(reservation);
        });
    });
};

// Create a new reservation
Reservation.create = (reservation) => {
    return new Promise((resolve, reject) => {
        const queryText = `
            INSERT INTO reservations (user_id, space_id, reservation_date, status) 
            VALUES ($1, $2, $3, 'pending') 
            RETURNING *`;
        
        sql.query(queryText, [reservation.user_id, reservation.space_id, reservation.reservation_date], (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }

            resolve(res.rows[0]);
        });
    });
};

// Update reservation details
Reservation.update = (id, reservation) => {
    return new Promise((resolve, reject) => {
        let queryText = 'UPDATE reservations SET';
        const fields = [];
        const values = [id];

        Object.keys(reservation).forEach((key) => {
            if (reservation[key] !== null && reservation[key] !== undefined) {
                fields.push(`${key} = $${fields.length + 2}`);
                values.push(reservation[key]);
            }
        });

        if (fields.length === 0) {
            return reject(new Error("No valid fields provided for update"));
        }

        queryText += ` ${fields.join(', ')} WHERE reservation_id = $1 RETURNING *`;

        sql.query(queryText, values, (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }
            if (res.rows.length === 0) {
                reject(new Error("No reservation found with the provided ID"));
                return;
            }

            resolve(res.rows[0]);
        });
    });
};

// Delete a reservation
Reservation.remove = (id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'DELETE FROM reservations WHERE reservation_id = $1';
        sql.query(queryText, [id], (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }

            resolve(res);
        });
    });
};

// Update reservation status (e.g., mark as checked-in or no-show)
Reservation.updateStatus = (reservation_id, status) => {
    return new Promise((resolve, reject) => {
        const queryText = `UPDATE reservations SET status = $1 WHERE reservation_id = $2 RETURNING *`;
        sql.query(queryText, [status, reservation_id], (err, res) => {
            if (err) {
                console.log('SQL Error:', err);
                reject(err);
                return;
            }
            resolve(res.rows[0]);
        });
    });
};

// Find all reservations that are overdue (past reservation date and still pending)
Reservation.getExpiredReservations = () => {
    return new Promise((resolve, reject) => {
        const queryText = `SELECT * FROM reservations WHERE status = 'pending' AND reservation_date < CURRENT_DATE`;
        sql.query(queryText, (err, res) => {
            if (err) {
                console.log('SQL Error:', err);
                reject(err);
                return;
            }
            resolve(res.rows);
        });
    });
};

module.exports = Reservation;
