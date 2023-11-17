import React from "react";

const DataTable = ({ data }) => {
  if (data.length == 0) {
    return (
      <div>
        <p>Not Data</p>
      </div>
    );
  } else {
    // Generate the table rows
    const tableRows = data.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.key || "N/A"}</td>
        <td>{item.value || "N/A"}</td>
      </tr>
    ));

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    );
  }
};

export default DataTable;
