const fetch = require("node-fetch");
require("dotenv").config();

const BASE_URL = "https://www.googleapis.com/analytics/v3";
const getAccountSummaries = async (token) => {
  const requestEndpoint = `${BASE_URL}/management/accountSummaries`;
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await fetch(requestEndpoint, requestOptions);
    const data = await res.json();
    const formattedData = data.items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        webProperties: item.webProperties,
      };
    });
    return formattedData;
  } catch (e) {
    console.log(e);
  }
};
const getSegments = async (token) => {
  const requestEndpoint = `${BASE_URL}/management/segments`;
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await fetch(requestEndpoint, requestOptions);
    const data = await res.json();
    const formattedData = data.items.map((item) => {
      return {
        definition: item.definition,
        id: item.segmentId,
        name: item.name,
        type: item.type,
      };
    });
    return formattedData;
  } catch (e) {
    console.log(e);
  }
};

const getSchema = async (request, response) => {
  const token = request.headers["authorization"]?.split(" ")[1];
  if (!token) {
    response.status(400).send("Not Authorized");
  }
  const [accountSummaries, segments] = await Promise.all([getAccountSummaries(token), getSegments(token)]);
  const schema = {
    accounts: accountSummaries,
    segments: segments,
  };
  response.json({
    data: schema,
  });
};

module.exports = {
  getSchema,
};
