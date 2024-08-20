const app = require('./app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`🚀 Pending submissions server running on port ${PORT}`));
