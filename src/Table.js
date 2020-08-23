import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  console.log(countries);
  return (
    <div className="table">
      {countries.map((country, index) => (
        <tr key={index}>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;