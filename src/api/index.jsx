import axios from "axios";

export const BASE_URL = "https://tabackend.up.railway.app";

const useAxios = axios.create({
  baseURL: `${BASE_URL}`,
});

export default useAxios;