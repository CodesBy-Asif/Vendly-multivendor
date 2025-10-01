const app = require("./app");
require("dotenv").config();
const connectDatabase = require("./config/db");

const PORT = process.env.PORT || 3000;




connectDatabase().then(() => {
  // Start server only after DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})



