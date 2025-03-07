/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for User authentication
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Unable to create user
 * 
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Please provide an email and password
 *       401:
 *         description: Invalid credentials
 * 
 * /api/v1/auth/logout:
 *   get:
 *     tags: [Authentication]
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Unable to logout user
 * 
 * /api/v1/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current logged in user
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       500:
 *         description: Unable to get user
 * 
 * /api/v1/auth/:
 *   get:
 *     tags: [Authentication]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       500:
 *         description: Unable to get users
 * 
 * /api/v1/auth/{id}:
 *   get:
 *     tags: [Authentication]
 *     summary: Get a single user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 *       500:
 *         description: Unable to get user
 *   put:
 *     tags: [Authentication]
 *     summary: Update user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../schemas/User'
 *     responses:
 *       200:
 *         description: Successfully updated user
 *       403:
 *         description: User is not authorized to update this account
 *       404:
 *         description: User not found
 *       500:
 *         description: Unable to update user
 *   delete:
 *     tags: [Authentication]
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted user
 *       403:
 *         description: User is not authorized to delete this account
 *       404:
 *         description: User not found
 *       500:
 *         description: Unable to delete user
 */