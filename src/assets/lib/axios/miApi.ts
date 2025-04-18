import axios from "axios";

const myApi = axios.create({
  baseURL: "https://sportnutrition.somee.com/api",
});
export default myApi;
