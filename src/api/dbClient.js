import axios from "axios";

const dbClient = axios.create({
  baseURL: "https://credit-db-backend.onrender.com",
});

export default dbClient;