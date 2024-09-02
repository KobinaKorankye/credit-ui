import axios from "axios";

const client = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
});

export default client;
