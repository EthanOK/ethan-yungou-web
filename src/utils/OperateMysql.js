const mysql = require("mysql");

const getResultSelectDB = async (sql) => {
  try {
    const connection = mysql.createConnection({
      host: "192.168.0.173",
      user: "root",
      password: "root",
      port: "3306",
      database: "aggregator_ethan"
    });

    const queryPromise = () => {
      return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
          if (err) {
            console.log("[SELECT ERROR] - ", err.message);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    connection.connect();

    // Await the result from the queryPromise
    const result = await queryPromise();

    connection.end();

    const jsonResult = JSON.stringify(result);
    return jsonResult;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = { getResultSelectDB };
