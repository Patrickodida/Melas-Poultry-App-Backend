const validateRequest = (schema) => {
    return function (req, res, next) {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        console.log('Validation Error:', error);
        console.log('Validated Value:', value);

        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
        }

        next();
    };
};

module.exports = validateRequest;
