const sql = require('../config/db');

const BannedUser = function (bannedUser) {
    this.id = bannedUser.id;
    this.user_id = bannedUser.user_id; //Foreign key to user's id
    this.banned_at = bannedUser.banned_at;
};

BannedUser.findAll = () => {
    return new Promise((resolve, reject) => {
        const queryText = 'SELECT * FROM banned_users';
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

BannedUser.findByUserId = (user_id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'SELECT * FROM banned_users WHERE user_id = $1';
        sql.query(queryText, [user_id], (err, res) => {
            if (err) {
                console.log('SQL Error:', err);
                reject(err);
                return;
            }
            if (res.rows.length === 0) {
                resolve(null);
                return;
            }
            resolve(res.rows[0]);
        });
    });
};

BannedUser.findById = (id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'SELECT * FROM banned_users WHERE id = $1';
        sql.query(queryText, [id], (err, res) => {
            if (err) {
                console.log('SQL Error:', err);
                reject(err);
                return;
            }
            if (res.rows.length === 0) {
                resolve(null);
                return;
            }
            resolve(res.rows[0]);
        });
    });
};

BannedUser.create = (user_id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'INSERT INTO banned_users (user_id,banned_at) VALUES ($1,NOW()) RETURNING *';
        sql.query(queryText, [user_id], (err, res) => {
            if (err) {
                console.log('SQL Error:', err);
                reject(err);
                return;
            }
            resolve(res.rows[0]);
        });
    });
};

BannedUser.remove = (user_id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'DELETE FROM banned_users WHERE user_id = $1';
        sql.query(queryText, [user_id], (err, res) => {
            if (err) {
                console.log('SQL Error:', err);
                reject(err);
                return;
            }
            resolve(res);
        });
    });
};

module.exports = BannedUser;
