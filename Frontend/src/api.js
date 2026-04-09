import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // change to your backend URL
  withCredentials: true,               // if using cookies/sessions
});

export default API;