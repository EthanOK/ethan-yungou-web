// 查询 mysql 数据库 返回 json 数据
const getResultSelectDB = async (pool, sql) => {
  try {
    const connection = await new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
          return;
        }
        resolve(connection);
      });
    });

    console.log("Connected!");

    const result = await new Promise((resolve, reject) => {
      connection.query(sql, function (err, result) {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });

    connection.release();

    const jsonResult = JSON.stringify(result);
    return jsonResult;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = { getResultSelectDB };
