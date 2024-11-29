import axios from "axios";

const client = axios.create({
  baseURL: "http://54.246.247.31:8000", // For EC2, run backend in prod mode; " fastapi run "
  // baseURL: "http://localhost:8000",
});

export default client;
