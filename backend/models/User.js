const sql = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// constructor
const User = function (user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.telephone = user.telephone;
    this.role = user.role;
};

User.findAll = () => {
    return new Promise((resolve, reject) => {
        const queryText = 'SELECT * FROM users';
        sql.query(queryText, (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }

            resolve(res.rows);
        });
    });
};

User.findById = (id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'SELECT * FROM users WHERE id = $1';
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
            resolve(res.rows[0]);
        });
    });
};

User.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const queryText = 'SELECT * FROM users WHERE email = $1';
        sql.query(queryText, [email], (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }
            if (res.rows.length === 0) {
                resolve(null);
                return;
            }

            resolve(new User(res.rows[0]));
        });
    });
};

User.create = (newUser) => {
    return new Promise(async (resolve, reject) => {
        newUser.password = await bcrypt.hash(newUser.password, 10);
        const queryText = 'INSERT INTO users (name, email, password, telephone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        sql.query(queryText, [newUser.name, newUser.email, newUser.password, newUser.telephone, newUser.role], (err, res) => {
            if (err) {
                console.log('error: ', err);
                reject(err);
                return;
            }

            resolve(res.rows[0]);
        });
    });
};

User.update = (id, user) => {
    return new Promise((resolve, reject) => {
        let queryText = 'UPDATE users SET';
        const fields = [];
        const values = [];
        values.push(id);

        Object.keys(user).forEach((key, index) => {
            if (user[key] !== null && user[key] !== undefined) {
                if (key === 'password') {
                    user.password = bcrypt.hashSync(user.password, 10);
                }

                fields.push(`${key} = $${fields.length + 2}`);
                values.push(user[key]);
            }
        });

        if (fields.length === 0) {
            return reject(new Error("No valid fields provided for update"));
        }

        queryText += ` ${fields.join(', ')} WHERE id = $1 RETURNING *`;

        sql.query(queryText, values, (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }
            if (res.rows.length === 0) {
                reject(new Error("No user found with the provided ID"));
                return;
            }

            resolve(res.rows[0]);
        });
    });
};

User.remove = (id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'DELETE FROM users WHERE id = $1';
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

User.getSignedJwtToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;