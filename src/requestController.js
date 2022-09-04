import axios from "axios";


const BASE_URL = "https://mern--blogging.herokuapp.com/api/";


export const publicRequest = axios.create({
    baseURL: BASE_URL,
});
  
export const userRequest = axios.create({
    baseURL: BASE_URL,
});
