/* eslint-disable no-undef */
const mssql = require("mssql");
const config = require("./config");

const connection = async () => {
  let pool = null;
  try {
    pool = mssql.connect(config);
    console.log("connected successfully to db");
  } catch (error) {
    console.log(`Error occurred : ${error.message}`);
  }
  return pool;
};

const createRequest = async (request, params = {}) => {
  const keys = Object.keys(params);
  keys.map((keyName) => {
    const keyValue = params[keyName];
    request.input(keyName, keyValue);
  });
  return request;
};
const execution = async (procedureName, params = {}) => {
  const requestone = await connection();
  const requesttwo = await requestone.request();
  request = await createRequest(requesttwo, params);
  const results = await request.execute(procedureName);
  return results;
};

const querying = async (query) => {
  const results = await connection().request.query(query);
  return results;
};

module.exports = { query: querying, execute: execution };
