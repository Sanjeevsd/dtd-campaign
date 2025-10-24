import axios from "axios";

const baseURL = "http://localhost:4444/api/v3/";
//   process.env.NODE_ENV === 'development'
//     ? 'http://0.0.0.0:4444/api/v3/'
//     : 'https://admin.aajproperty.com/api/v3/';

const api = axios.create({
  baseURL,
});

export default api;
