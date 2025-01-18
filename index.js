const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const  apiRoutes = require('./routes/auth');
const { connectDB } = require('./config/configDB');
const { webhookHandler } = require('./middleware/webhook');


dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(bodyParser.json());
// Routes
app.use(apiRoutes);
app.use(webhookHandler);


// Start server
const port = process.env.PORT || 5003;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
