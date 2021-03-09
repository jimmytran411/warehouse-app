import axios from "axios";
import { config } from "./config";

export const getAvailabilities = async (manufacturer, token) => {
  return axios
    .get(`${config.baseApi}/v2/availability/${manufacturer}`, {
      cancelToken: token,
    })
    .then((response) => {
      return response.data.response;
    })
    .catch((error) => {
      const errorMessage = error.message;
      if (axios.isCancel(error)) {
        console.log(`Request cancelled: ${errorMessage}`);
      } else {
        console.log("Errors:" + errorMessage);
      }
    });
};

export const getProducts = async (product, token) => {
  return axios
    .get(`${config.baseApi}/v2/products/${product}`, {
      cancelToken: token,
    })
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.message;
      if (axios.isCancel(error)) {
        console.log(`Request cancelled: ${errorMessage}`);
      } else {
        console.log("Errors:" + errorMessage);
      }
      return [
        {
          id: "loading",
          name: "loading",
          manufacturer: "loading",
          color: "loading",
          price: "loading",
          availablility: "loading",
        },
      ];
    });
};
