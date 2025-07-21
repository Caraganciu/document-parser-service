require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`Server running on port ${port}`);
});
