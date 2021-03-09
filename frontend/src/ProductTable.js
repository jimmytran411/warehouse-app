import React from "react";
import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css";
import { LoadingAnimation } from "./utils/LoadingAnimation";

export const ProductTable = ({
  productsWithAvailability,
  onGetAvailability,
}) => {
  return (
    <Table
      width={1250}
      height={800}
      headerHeight={30}
      rowHeight={40}
      rowCount={productsWithAvailability.length}
      rowGetter={({ index }) => productsWithAvailability[index]}
    >
      <Column label="Id" dataKey={"id"} width={250} />
      <Column label="Name" dataKey="name" width={250} />
      <Column label="Manufacturer" dataKey="manufacturer" width={150} />
      <Column label="Color" dataKey="color" width={125} />
      <Column label="Price" dataKey="price" width={75} />
      <Column
        width={400}
        label="Availability"
        dataKey="availability"
        cellRenderer={({ cellData }) => {
          if (cellData === "loading" || !cellData) {
            return <LoadingAnimation />;
          } else if (cellData.substring(0, 5) === "Empty") {
            const manufacturer = cellData.substring(6, cellData.length);
            return (
              <div>
                Something went wrong. Click{" "}
                <button
                  className="btn-get-availability"
                  onClick={() => {
                    onGetAvailability(manufacturer);
                  }}
                >
                  Here
                </button>{" "}
                to try again
              </div>
            );
          } else {
            switch (cellData) {
              case "instock":
                return <span style={{ color: "green" }}>In Stock</span>;
              case "outofstock":
                return <span style={{ color: "red" }}>Out Of Stock</span>;
              case "lessthan10":
                return (
                  <span style={{ color: "rgb(187, 201, 64)" }}>
                    Less Than 10
                  </span>
                );
              default:
                console.log("Something else");
            }
          }
        }}
      />
    </Table>
  );
};
