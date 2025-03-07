const PORT = process.env.PORT || 5003;

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Co-working Space Reservation',
        version: '1.0.0',
        description: 'A simple API to manage co-working space reservations',
    },
    servers: [
        {
            url: `http://localhost:${PORT}/api/v1/`,
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

module.exports = swaggerDefinition;