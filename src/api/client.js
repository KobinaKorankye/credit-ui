import axios from "axios";

const client = axios.create({
  baseURL: "https://credit-api-4krg.onrender.com",
});

export default client;
