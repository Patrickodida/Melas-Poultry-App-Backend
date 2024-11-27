const validateRequest = (schema) => {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.body, { abortEarly: false }); // Validate all fields
        console.log('Validation Error:', error);
        console.log('Validated Value:', value);

        if (error) {
            // Respond with an array of all validation errors for better debugging
            const errorMessages = error.details.map((detail) => detail.message);
            return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
        }

        next(); // Proceed to the next middleware/controller
    };
};

module.exports = validateRequest;
