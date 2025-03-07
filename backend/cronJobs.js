
const cron = require('node-cron');
const {getExpiredReservations, updateStatus } = require('./models/Reservation');
const db = require('./config/db');
const BannedUser = require('./models/BannedUser');



async function runAutoBanJob() {
    console.log('Checking for no-show reservations...');

    try {
        const noShowReservations = await getExpiredReservations();

        for (let reservation of noShowReservations) {
            const user_id = reservation.user_id;

            // Mark reservation as "no_show"
            await updateStatus(reservation.reservation_id, 'no_show');

            // Ban the user if not already banned
            const bannedUser = await BannedUser.findByUserId(user_id);
            if (!bannedUser) {
                await BannedUser.create(user_id);
            }
        }
    } catch (error) {
        console.error('Error processing no-shows:',error);
    }
}

async function runAutoUnbanJob(){
    console.log('Checking for users eligible for unban...');

    try {
        const unbanUsers = await db.query(
            `SELECT user_id FROM banned_users WHERE banned_at < NOW() - INTERVAL '30 days'`
        );

        for (const user of unbanUsers.rows) {
            const userId = user.user_id;

            await db.query(
                `DELETE FROM banned_users WHERE user_id = $1`, 
                [userId]
            );
            console.log(`User ${userId} has been unbanned.`);
        }
    } catch (error) {
        console.error('Error processing auto-unban:', error);
    }
}

async function runAutoUnbanJobTwo(){
    console.log('Checking for users eligible for unban...');

    try {
        const unbanUsers = await db.query(
            `SELECT user_id FROM banned_users WHERE banned_at < NOW()`
        );

        for (const user of unbanUsers.rows) {
            const userId = user.user_id;

            await db.query(
                `DELETE FROM banned_users WHERE user_id = $1`, 
                [userId]
            );
            console.log(`User ${userId} has been unbanned.`);
        }
    } catch (error) {
        console.error('Error processing auto-unban:', error);
    }
}

cron.schedule('0 0 * * *', runAutoBanJob);
cron.schedule('0 1 * * *', runAutoUnbanJob);
module.exports = { runAutoBanJob,runAutoUnbanJob ,runAutoUnbanJobTwo};
