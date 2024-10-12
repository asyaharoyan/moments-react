import axios from "axios";

axios.defaults.baseURL = "https://my-first-api-project-2f4ba817d81a.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;