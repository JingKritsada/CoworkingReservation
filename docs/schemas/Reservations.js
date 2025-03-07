/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - user_id
 *         - space_id
 *         - reservation_date
 *       properties:
 *         reservation_id:
 *           type: integer
 *           description: The auto-generated id of the reservation
 *         user_id:
 *           type: integer
 *           description: The id of the user making the reservation
 *         space_id:
 *           type: integer
 *           description: The id of the space being reserved
 *         reservation_date:
 *           type: string
 *           format: date
 *           description: The date of the reservation
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the reservation was created
 *       example:
 *         reservation_id: 1
 *         user_id: 123
 *         space_id: 456
 *         reservation_date: 2023-10-01
 *         created_at: 2023-10-01T12:00:00Z
 */