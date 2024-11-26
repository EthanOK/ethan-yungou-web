const mysql = require("mysql");

const getPoolMysql = () => {
  try {
    let pool = mysql.createPool({
      connectionLimit: 10,
      host: "192.168.0.173",
      user: "root",
      password: "root",
      port: "3306",
      database: "aggregator_ethan"
    });
    return pool;
  } catch (error) {
    console.log(error);
    return null;
  }
};
module.exports = { getPoolMysql };

// pool.getConnection(function (err, connection) {
//   if (err) throw err;
//   console.log("Connected!");

//   // 在这里进行数据库操作

//   // 释放连接，将连接放回连接池供其他请求使用
//   connection.release();
// });
