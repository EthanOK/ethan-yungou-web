const { getPoolMysql } = require("./ConnectMysql.js");
const { getResultSelectDB } = require("./OperateMysql.js");

let pool = getPoolMysql();
let sql = "SELECT * FROM system";
async function main() {
  let result = await getResultSelectDB(sql);
  console.log(result);
}
main();
