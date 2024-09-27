import axios from "axios";

let serverBaseURL = process.env.NEXT_PUBLIC_SERVER_URL;

const AxiosService = axios.create({
  baseURL: `${serverBaseURL}`,
  headers: {
    "Content-Type": "application/json",
    Authorization:
    typeof window !== "undefined" ? localStorage.getItem("loginToken") : null,
  },
});

AxiosService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("loginToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosService;
