import axios from "axios";


const BASE_URL = "https://lively-fly-stole.cyclic.app/api/";


export const publicRequest = axios.create({
    baseURL: BASE_URL,
});
  
export const userRequest = axios.create({
    baseURL: BASE_URL,
});
