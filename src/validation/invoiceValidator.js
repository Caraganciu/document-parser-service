const { allInvoiceValidationRules } = require('./invoiceRules');

function validateInvoiceText(text) {
    const missingFields = [];

    for (const rule of allInvoiceValidationRules) {
        if (!rule.validate(text)) {
            missingFields.push(rule.key);
        }
    }

    return {
        isValid: missingFields.length === 0,
        missingFields
    };
}

module.exports = {
    validateInvoiceText
};
