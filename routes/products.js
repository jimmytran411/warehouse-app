const axios = require("axios");
const mcache = require("memory-cache");

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const express = require("express");

const router = express.Router();

const baseApi = "https://bad-api-assignment.reaktor.com/v2";
const productUrl = `${baseApi}/products/`;
const availabilityUrl = `${baseApi}/availability/`;

const CACHE_TIME = 5 * 60 * 1000;

const cache = (duration) => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration);
        res.sendResponse(body);
      };
      next();
    }
  };
};

const getProducts = async (product) => {
  return axios
    .get(`${productUrl}/${product}`)
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

const getAvailability = async (manufacturer) => {
  return axios
    .get(`${availabilityUrl}/${manufacturer}`)
    .then((response) => {
      const availability = response.data;
      if (availability === "[]") {
        console.log(availability);
        return getAvailability(manufacturer);
      } else {
        return availability;
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};

router.get("/v2/products/:category", cache(CACHE_TIME), async (req, res) => {
  const category = req.params.category;
  const products = await getProducts(category);
  if (!products) {
    res.status(404).send();
  } else {
    res.send(products);
  }
});

router.get(
  "/v2/availability/:manufacturer",
  cache(CACHE_TIME),
  async (req, res) => {
    const manufacturer = req.params.manufacturer;
    const availability = await getAvailability(manufacturer);
    if (!availability) {
      res.status(404).send();
    } else {
      res.send(availability);
    }
  }
);

module.exports = router;
