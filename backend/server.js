require("dotenv").config();
const app = require("./app");

const { server } = require("./config/app_config");

const PORT = server.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
