/**
 * @swagger
 * components:
 *   schemas:
 *     Space:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - telephone
 *         - open_time
 *         - close_time
 *       properties:
 *         space_id:
 *           type: integer
 *           description: The auto-generated id of the space
 *         name:
 *           type: string
 *           description: The name of the co-working space
 *         address:
 *           type: string
 *           description: The address of the co-working space
 *         telephone:
 *           type: string
 *           description: The contact telephone number of the co-working space
 *         open_time:
 *           type: string
 *           format: time
 *           description: The opening time of the co-working space
 *         close_time:
 *           type: string
 *           format: time
 *           description: The closing time of the co-working space
 *       example:
 *         space_id: 1
 *         name: "Cozy Workspace"
 *         address: "123 Main St, Anytown, USA"
 *         telephone: "123-456-7890"
 *         open_time: "08:00:00"
 *         close_time: "18:00:00"
 */