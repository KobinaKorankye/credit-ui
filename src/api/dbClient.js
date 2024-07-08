import axios from "axios";

const dbClient = axios.create({
  baseURL: "http://localhost:4000/",
});

export default dbClient;