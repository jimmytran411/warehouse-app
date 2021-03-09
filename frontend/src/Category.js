import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts, getAvailabilities } from "./utils/request";
import { LoadingAnimation } from "./utils/LoadingAnimation";
import axios from "axios";
import { ProductTable } from "./ProductTable";

export const Category = () => {
  const [products, setProducts] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [availabilities, setAvailabilities] = useState({});
  const [loadingStatus, setLoadingStatus] = useState("");
  const [productsWithAvailability, setProductsWithAvailability] = useState([]);

  const { categoryId } = useParams();

  useEffect(() => {
    const productRequest = axios.CancelToken.source();
    async function fetchProducts() {
      setLoadingStatus("loading");
      const products = await getProducts(categoryId, productRequest.token);
      setProducts(products);
      setProductsWithAvailability(products);
      const manufacturers = [
        ...new Set(
          products.map((item) => {
            return item.manufacturer;
          })
        ),
      ];
      setManufacturers(manufacturers);
      setLoadingStatus("loaded");
    }
    fetchProducts();
    return () => {
      productRequest.cancel("Cancelling in cleanup");
    };
  }, [categoryId]);

  useEffect(() => {
    let availabilityRequestSource = axios.CancelToken.source();
    async function fetchAvailabilities() {
      await manufacturers.map(async (manufacturer) => {
        try {
          if (!availabilities[manufacturer]) {
            const availability = await getAvailabilities(
              manufacturer,
              availabilityRequestSource.token
            );
            setAvailabilities((prevstate) => {
              return { ...prevstate, [manufacturer]: availability };
            });
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
    fetchAvailabilities();
    return () => {
      availabilityRequestSource.cancel("Cancelling in cleanup");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manufacturers]);

  useEffect(() => {
    const productsWithAvailability = products.map(
      ({ id, manufacturer, ...rest }) => {
        const manufacturerAvailability = availabilities[manufacturer];
        if (manufacturerAvailability === "[]") {
          return {
            id,
            manufacturer,
            availability: `Empty ${manufacturer}`,
            ...rest,
          };
        } else {
          const availability = (manufacturerAvailability || []).find(
            (element) => element.id === id.toUpperCase()
          );
          return {
            id,
            manufacturer,
            availability: availability
              ? availability.DATAPAYLOAD.match(
                  /(?<=<INSTOCKVALUE>).*(?=<\/INSTOCKVALUE>)/gm
                )[0].toLowerCase()
              : "loading",
            ...rest,
          };
        }
      }
    );
    setProductsWithAvailability(productsWithAvailability);
  }, [availabilities, manufacturers, products]);

  const onGetAvailability = async (manufacturer) => {
    setAvailabilities((prevstate) => {
      return { ...prevstate, [manufacturer]: [] };
    });
    try {
      const availability = await getAvailabilities(manufacturer);
      setAvailabilities((prevstate) => {
        return { ...prevstate, [manufacturer]: availability };
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      {loadingStatus === "loading" && (
        <div className="initial-loading">
          <LoadingAnimation />
        </div>
      )}
      {loadingStatus === "loaded" && (
        <ProductTable
          productsWithAvailability={productsWithAvailability}
          onGetAvailability={onGetAvailability}
        />
      )}
    </React.Fragment>
  );
};
