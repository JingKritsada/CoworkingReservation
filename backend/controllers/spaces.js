const Space = require('../models/Space.js');

// Description: Get all spaces with filters, sorting, and pagination
// Route: GET /api/v1/spaces
// Access: Public
exports.getSpaces = async (req, res, next) => {
    try {
        const { select, sort, limit, page, ...filters } = req.query;
        console.log(req.query);

        const tmpPage = parseInt(page, 10) || 1;
        const tmpLimit = parseInt(limit, 10) || 25;
        const offset = (tmpPage - 1) * tmpLimit;

        const pagination = {
            limit: tmpLimit,
            offset: offset
        };

        const options = { select, sort, pagination, filters };

        const spaces = await Space.findAll(options);

        res.status(200).json({
            success: true,
            count: spaces.length,
            data: spaces
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to get spaces'
        });
    }
};


// Description: Get a single space
// Route: GET /api/v1/spaces/:id
// Access: Public
exports.getSpace = async (req, res, next) => {
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        res.status(200).json({
            success: true,
            data: space
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to get space'
        });
    }
};

// Description: Create a new space
// Route: POST /api/v1/spaces
// Access: Private
exports.createSpace = async (req, res, next) => {
    try {
        const { name, address, telephone, open_time, close_time } = req.body;
        const space = await Space.create({ name, address, telephone, open_time, close_time });

        res.status(201).json({
            success: true,
            data: space
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to create space'
        });
    }
};

// Description: Update a space
// Route: PUT /api/v1/spaces/:id
// Access: Private
exports.updateSpace = async (req, res, next) => {
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        const { name, address, telephone, open_time, close_time } = req.body;
        const updatedSpace = await Space.update(req.params.id, { name, address, telephone, open_time, close_time });

        res.status(200).json({
            success: true,
            data: updatedSpace
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to update space'
        });
    }
};

// Description: Delete a space
// Route: DELETE /api/v1/spaces/:id
// Access: Private
exports.deleteSpace = async (req, res, next) => {
    try {
        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({
                success: false,
                message: 'Space not found'
            });
        }

        await Space.remove(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Space deleted'
        });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to delete space'
        });
    }
};