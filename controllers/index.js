const connection = require("../configDb");
const dbconnection = require("../configDb");
const bcrypt = require("bcryptjs");
const jwtgenerate = require("../helpers/tokenGenerate");
const lodash = require("lodash");
const validate = require("../helpers/validate");
const encrypt = require("../helpers/encrypt");

const signup = async (req, res) => {
  try {
    const { fullname, username, email, password, confirmpassword } = req.body;
    if (password !== confirmpassword)
      return res.status(400).send("Passwords do not match");

    const { error } = await validate({
      fullname,
      username,
      email,
      password,
    });
    console.log(error);

    if (error) return res.status(400).send(error.message);
    console.log("joan");
    let { recordset } = await dbconnection.execute("getuser", { email });
    console.log(recordset);
    if (recordset.length !== 0) return res.status(401).send("Account exists");

    const pass = await encrypt(password);
    console.log(pass);
    await dbconnection.execute("registeruser", {
      fullname,
      username,
      email,
      password: pass,
    });
    res.status(201).send("Successfully registered");
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    let { userDetails } = req.body;
    let { email, password } = userDetails;
    let { recordset } = await dbconnection.execute("getuser", { email });
    let user = recordset[0];
    console.log(user);
    if (!user) return res.status(401).send("Account does not exist");

    let auth = await bcrypt.compare(password, user.password);

    if (!auth) return res.status(401).send("Incorrect password provided");

    const token = jwtgenerate({ email, password });
    if (!token)
      return res.status(401).send("Encountered problem generating token.");
    console.log(token);
    res.send({
      user: lodash.pick(user, [
        "fullname",
        "username",
        "email",
        "employer",
        "isAdmin",
      ]),
      token,
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

const getusers = async (req, res) => {
  try {
    let { email } = req.body;
    let { recordset } = await connection.execute("getusers", { email });
    res.status(201).send(recordset);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = {
  signup,
  login,
  getusers,
};
