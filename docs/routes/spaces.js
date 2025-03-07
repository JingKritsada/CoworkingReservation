/**
 * @swagger
 * tags:
 *   name: Co-working Spaces
 *   description: API to Co-working Spaces management
 */

/**
 * @swagger
 * /spaces:
 *   get:
 *     summary: Get all spaces
 *     tags: [Co-working Spaces]
 *     responses:
 *       200:
 *         description: List of all spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '../schemas/Space'
 *       500:
 *         description: Unable to get spaces
 *   post:
 *     summary: Create a new space
 *     tags: [Co-working Spaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../schemas/Space'
 *     responses:
 *       201:
 *         description: Space created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '../schemas/Space'
 *       500:
 *         description: Unable to create space
 * /spaces/{id}:
 *   get:
 *     summary: Get a space by ID
 *     tags: [Co-working Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The space ID
 *     responses:
 *       200:
 *         description: Space details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '../schemas/Space'
 *       404:
 *         description: Space not found
 *       500:
 *         description: Unable to get space
 *   put:
 *     summary: Update a space by ID
 *     tags: [Co-working Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '../schemas/Space'
 *     responses:
 *       200:
 *         description: Space updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '../schemas/Space'
 *       404:
 *         description: Space not found
 *       500:
 *         description: Unable to update space
 *   delete:
 *     summary: Delete a space by ID
 *     tags: [Co-working Spaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The space ID
 *     responses:
 *       200:
 *         description: Space deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Space not found
 *       500:
 *         description: Unable to delete space
 */