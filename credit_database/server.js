const app = require('./app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`🚀 Credit Transactions server running on port ${PORT}`));
