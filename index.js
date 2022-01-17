const express = require("express");
const cors = require("cors");
const PORT = 9000;
const app = express();
const usersRoute = require("./routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", usersRoute);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
