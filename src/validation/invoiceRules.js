const InvoiceValidationRule = {
    ISSUED_TO: {
        key: 'issued to',
        validate: (text) => text.toLowerCase().includes('issued to')
    },
    PAY_TO: {
        key: 'pay to',
        validate: (text) => text.toLowerCase().includes('pay to')
    },
    TOTAL: {
        key: 'total',
        validate: (text) => text.toLowerCase().includes('total')
    },
    SUBTOTAL: {
        key: 'subtotal',
        validate: (text) => text.toLowerCase().includes('subtotal')
    }
};

const allInvoiceValidationRules = Object.values(InvoiceValidationRule);

module.exports = {
    InvoiceValidationRule,
    allInvoiceValidationRules
};
