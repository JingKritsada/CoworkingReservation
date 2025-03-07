const { Pool } = require('pg');

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'root',
    database: 'coworking_db',
});

// create userTable
async function createUserTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            telephone VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'))
        )`;

        await connection.query(query);
        console.log('User table created successfully');
    } catch (error) {
        console.error('Error creating user table:', error);
    }
}

// create spaceTable
async function createSpaceTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS spaces (
            space_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            telephone VARCHAR(255) NOT NULL,
            open_time TIME NOT NULL,
            close_time TIME NOT NULL
        )`;

        await connection.query(query);
        console.log('Space table created successfully');
    } catch (error) {
        console.error('Error creating space table:', error);
    }
}

// create reservationTable
async function createReservationTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS reservations (
            reservation_id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            space_id INT NOT NULL,
            reservation_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (space_id) REFERENCES spaces(space_id) ON DELETE CASCADE
        )`;

        await connection.query(query);
        console.log('Reservation table created successfully');
    } catch (error) {
        console.error('Error creating reservation table:', error);
    }
}

//CREDIT MARK FOR VIDEO
async function createBannedUsersTable() {
    try {
        const query = ` 
        CREATE TABLE IF NOT EXISTS banned_users (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`;

        await connection.query(query);

        console.log('Banned Users table created successfully');
        const checkColumnQuery = `
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'banned_users' AND column_name = 'banned_at';
        `;
        const res = await connection.query(checkColumnQuery);

        if (res.rows.length === 0) {
            const alterQuery = `
                ALTER TABLE banned_users ADD COLUMN banned_at TIMESTAMP DEFAULT NOW();
            `;
            await connection.query(alterQuery);
            console.log('Added "banned_at" column to banned_users table');
        } else {
            console.log('Column "banned_at" already exists in banned_users table');
        }
    } catch (error) {
        console.error('Error creating banned users table:', error);
    }
}

async function addStatusColumn() {
    try {
        const checkColumnQuery = `
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'reservations' AND column_name = 'status';
        `;
        const res = await connection.query(checkColumnQuery);

        if (res.rows.length === 0) {
            // Column does not exist, so we add it
            const alterQuery = `
                ALTER TABLE reservations ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending';
            `;
            await connection.query(alterQuery);
            console.log('Added "status" column to reservations table');
        } else {
            console.log('Column "status" already exists in reservations table');
        }
    } catch (error) {
        console.error('Error checking/adding status column:', error);
    }
}


createUserTable();
createSpaceTable();
createReservationTable();


//CREDIT MARK FOR VIDEO
addStatusColumn();
createBannedUsersTable();

module.exports = connection;