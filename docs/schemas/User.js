/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - telephone
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         telephone:
 *           type: string
 *           description: The telephone number of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *           enum:
 *             - admin
 *             - user
 *           default: user
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: password123
 *         telephone: 123-456-7890
 *         role: user
 */