const User = require('../models/User');

// Description  : Register a new user
// Route        : POST /api/v1/auth/register
// Access       : Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, telephone, role } = req.body;
        const user = await User.create({ name, email, password, telephone, role });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error(error.stack);
        res.status(400).json({
            success: false,
            message: 'Unable to create user'
        });
    }
};

// Description  : Login user
// Route        : POST /api/v1/auth/login
// Access       : Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to login user'
        });
    }
};

// Description  : Logout user
// Route        : GET /api/v1/auth/logout
// Access       : Private
exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
    
        res.status(200).json({
            success: true,
            message: 'User logged out'
        });   
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to logout user'
        });
    }
};

// Description  : Get current logged in user
// Route        : GET /api/v1/auth/me
// Access       : Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to get user'
        });
    }
};

// Description  : Get all user
// Route        : GET /api/v1/auth/
// Access       : Private
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to get users'
        });
    }
};

// Description  : Get a single user
// Route        : GET /api/v1/auth/:id
// Access       : Private
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to get user'
        });
    }
};

// Description  : Update user
// Route        : PUT /api/v1/auth/:id
// Access       : Private
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this account`
            });
        }

        const { name, email, password, telephone, role } = req.body;
        const updatedUser = await User.update(req.params.id, { name, email, password, telephone, role });

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to update user'
        });
    }
};

// Description  : Delete user
// Route        : DELETE /api/v1/auth/:id
// Access       : Private
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this account`
            });
        }

        await User.remove(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            message: 'Unable to delete user'
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = User.getSignedJwtToken(user.id);

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
};